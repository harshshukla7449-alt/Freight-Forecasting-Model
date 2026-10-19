import {
  DischargePort,
  LoadingPort,
  VesselType,
  Commodity,
  IndianPortId,
  LoadingPortId,
  VesselTypeId,
  CommodityId,
  PortFeasibilityResult,
  VoyageCalculationResult,
} from '../types/maritime';
import {
  EAST_COAST_PORTS,
  OVERSEAS_LOADING_PORTS,
  VESSEL_TYPES,
  COMMODITIES,
  BALTIC_HISTORICAL_AND_FORECAST,
} from '../data/maritimeData';

export const USD_TO_INR_RATE = 86.5;

/**
 * Validate vessel physical dimensions against port constraints
 */
export function validatePortFeasibility(
  portId: IndianPortId,
  vesselId: VesselTypeId,
  parcelVolume: number,
  applySandheadsLightening: boolean = false
): PortFeasibilityResult {
  const port = EAST_COAST_PORTS[portId];
  const vessel = VESSEL_TYPES[vesselId];

  // Calculate actual sailing draft based on vessel lightship and parcel load
  const lightshipDraft =
    vesselId === 'capesize' ? 8.5 : vesselId === 'kamsarmax_panamax' ? 6.2 : vesselId === 'supramax_ultramax' ? 5.2 : 4.2;
  const loadRatio = Math.min(1.0, Math.max(0.2, parcelVolume / vessel.dwtTypical));
  const calculatedSailingDraft = parseFloat(
    (lightshipDraft + (vessel.draftTypical - lightshipDraft) * loadRatio).toFixed(1)
  );

  const isHaldiaOrShallow = port.id === 'haldia' || port.maxDraft < 9.0;

  // If Sandheads lightening plan is applied for Haldia/shallow:
  // Arrival draft is lightened offshore to safe river threshold <= port max draft
  const effectiveDraft = (applySandheadsLightening && isHaldiaOrShallow)
    ? Math.min(calculatedSailingDraft, port.maxDraft - 0.2)
    : calculatedSailingDraft;

  const draftFeasible = effectiveDraft <= port.maxDraft;
  const loaFeasible = vessel.loaTypical <= port.maxLoa;
  const beamFeasible = vessel.beamTypical <= port.maxBeam;

  const reasons: string[] = [];

  if (!draftFeasible) {
    const draftDiff = (calculatedSailingDraft - port.maxDraft).toFixed(1);
    reasons.push(
      `${vessel.name} loaded arrival draft (${calculatedSailingDraft}m) exceeds ${port.name} max permissible draft (${port.maxDraft}m) by +${draftDiff}m.`
    );
  }

  if (!loaFeasible) {
    const loaDiff = (vessel.loaTypical - port.maxLoa).toFixed(0);
    reasons.push(
      `${vessel.name} LOA (${vessel.loaTypical}m) exceeds ${port.name} berth limit (${port.maxLoa}m) by +${loaDiff}m.`
    );
  }

  if (!beamFeasible) {
    const beamDiff = (vessel.beamTypical - port.maxBeam).toFixed(1);
    reasons.push(
      `${vessel.name} beam (${vessel.beamTypical}m) exceeds ${port.name} gantry/berth outreach limit (${port.maxBeam}m) by +${beamDiff}m.`
    );
  }

  // Determine recommended vessel & mitigation strategy
  let recommendedVessel: VesselTypeId | null = null;
  let canSwitchVessel = false;
  let requiresLighteningOrShortLoad = false;
  let lighteningRecommendedMT = 0;
  let shortLoadRecommendedMT = 22000;

  if (isHaldiaOrShallow) {
    requiresLighteningOrShortLoad = true;
    shortLoadRecommendedMT = 22000;
    lighteningRecommendedMT = Math.max(0, parcelVolume - 22000);

    if (vesselId === 'handysize') {
      // Handysize is already the smallest bulk category!
      // DO NOT suggest switching to Handysize.
      recommendedVessel = null;
      canSwitchVessel = false;
    } else {
      // Larger vessel selected: recommend switching down to Handysize
      recommendedVessel = 'handysize';
      canSwitchVessel = true;
    }
  } else {
    // Normal / Deep port logic
    if (parcelVolume >= 120000) {
      if (port.maxDraft >= 17.5 && port.maxLoa >= 290) {
        recommendedVessel = 'capesize';
      } else {
        recommendedVessel = 'kamsarmax_panamax';
        if (vesselId === 'capesize') {
          reasons.push(
            `Capesize exceeds ${port.name} draft (${port.maxDraft}m). Recommending Kamsarmax parcels or diverting to deep-water Dhamra/Gangavaram.`
          );
        }
      }
    } else if (parcelVolume <= 45000) {
      recommendedVessel = 'handysize';
    } else if (parcelVolume <= 65000) {
      recommendedVessel = 'supramax_ultramax';
    } else {
      if (port.maxDraft >= 14.4) {
        recommendedVessel = 'kamsarmax_panamax';
      } else {
        recommendedVessel = 'supramax_ultramax';
      }
    }

    // Prevent redundant recommendation if already using recommended vessel
    if (recommendedVessel === vesselId) {
      canSwitchVessel = false;
      recommendedVessel = null;
    } else if (recommendedVessel !== null) {
      canSwitchVessel = true;
    }
  }

  const isFeasible = draftFeasible && loaFeasible && beamFeasible;

  // Max allowable parcel at this port
  let maxAllowableParcelMT = 180000;
  if (port.maxDraft < 9.0) maxAllowableParcelMT = 35000;
  else if (port.maxDraft < 13.5) maxAllowableParcelMT = 58000;
  else if (port.maxDraft < 15.0) maxAllowableParcelMT = 85000;
  else if (port.maxDraft < 17.0) maxAllowableParcelMT = 110000;

  return {
    isFeasible,
    draftFeasible,
    loaFeasible,
    beamFeasible,
    reasons,
    recommendedVessel,
    canSwitchVessel,
    requiresLighteningOrShortLoad,
    lighteningRecommendedMT,
    shortLoadRecommendedMT,
    port,
    vessel,
    maxAllowableParcelMT,
    calculatedSailingDraft,
  };
}

/**
 * Intelligent recommendation for best vessel based on cargo and port
 */
export function getOptimalVesselForShipment(
  portId: IndianPortId,
  parcelVolume: number
): VesselTypeId {
  const port = EAST_COAST_PORTS[portId];
  if (port.id === 'haldia') return 'handysize';
  if (parcelVolume >= 130000 && port.maxDraft >= 17.5) return 'capesize';
  if (parcelVolume >= 65000 && port.maxDraft >= 14.0) return 'kamsarmax_panamax';
  if (parcelVolume >= 40000 && port.maxDraft >= 12.0) return 'supramax_ultramax';
  return 'handysize';
}

/**
 * Returns optimal parcel volume when switching to a vessel class
 */
export function getRecommendedParcelSize(
  vesselId: VesselTypeId,
  portId: IndianPortId
): number {
  if (portId === 'haldia') {
    return 22000; // Optimal short-load cap for Haldia lock gate draft
  }
  switch (vesselId) {
    case 'capesize':
      return 150000;
    case 'kamsarmax_panamax':
      return 75000;
    case 'supramax_ultramax':
      return 55000;
    case 'handysize':
      return 32000;
  }
}

/**
 * Calculate comprehensive voyage economics, spot vs COA rates, and demurrage risks
 */
export function calculateVoyageSimulation(params: {
  commodityId: CommodityId;
  parcelVolume: number;
  loadingPortId: LoadingPortId;
  dischargePortId: IndianPortId;
  vesselTypeId: VesselTypeId;
  laycanMonthIndex?: number; // 0 = Oct, 1 = Nov, 2 = Dec, 3 = Jan 2027
  bunkerAdjustmentPercent?: number; // +/- % from base $605/MT
  applySandheadsLightening?: boolean; // Floating transshipment at Sandheads/Sagar
}): VoyageCalculationResult {
  const {
    commodityId,
    parcelVolume,
    loadingPortId,
    dischargePortId,
    vesselTypeId,
    laycanMonthIndex = 0,
    bunkerAdjustmentPercent = 0,
    applySandheadsLightening = false,
  } = params;

  const loadPort = OVERSEAS_LOADING_PORTS[loadingPortId];
  const dischPort = EAST_COAST_PORTS[dischargePortId];
  const vessel = VESSEL_TYPES[vesselTypeId];

  // 1. Nautical distance
  const distanceNM = loadPort.distanceToEastCoastNM[dischargePortId] || 4500;

  // 2. Sailing days
  const speed = vessel.speedKnots;
  const sailingHours = distanceNM / speed;
  const sailingDaysOneWay = parseFloat((sailingHours / 24).toFixed(1));

  // 3. Port operational days
  const loadingDays = parseFloat(
    (parcelVolume / Math.max(loadPort.loadingRateMTDay, 10000)).toFixed(1)
  );
  const dischargeDays = parseFloat(
    (parcelVolume / Math.max(dischPort.dailyDischargeRate, 5000)).toFixed(1)
  );
  const weatherBufferDays = dischPort.isRiverine ? 2.5 : 1.0;
  const portWaitingDays = parseFloat(
    (loadPort.avgLoadingWaitDays + dischPort.avgWaitDays).toFixed(1)
  );

  const totalTurnaroundDays = parseFloat(
    (
      sailingDaysOneWay +
      loadingDays +
      dischargeDays +
      portWaitingDays +
      weatherBufferDays
    ).toFixed(1)
  );

  // 4. Bunker Fuel calculation
  const baseVlsfoPrice = 605 * (1 + bunkerAdjustmentPercent / 100);
  const atSeaFuelMT = sailingDaysOneWay * vessel.vlsfoDailyMT;
  const inPortFuelMT = (loadingDays + dischargeDays + portWaitingDays) * 3.5;
  const bunkerConsumptionTotalMT = parseFloat((atSeaFuelMT + inPortFuelMT).toFixed(1));
  const bunkerCostUSD = Math.round(bunkerConsumptionTotalMT * baseVlsfoPrice);

  // 5. Freight Rate Modeling ($/MT)
  const distMultiplier = distanceNM / 1000;
  let unitFreightBase = 0;

  switch (vesselTypeId) {
    case 'capesize':
      unitFreightBase = 2.45 * distMultiplier + 2.8;
      break;
    case 'kamsarmax_panamax':
      unitFreightBase = 2.95 * distMultiplier + 3.2;
      break;
    case 'supramax_ultramax':
      unitFreightBase = 3.35 * distMultiplier + 3.6;
      break;
    case 'handysize':
      unitFreightBase = 4.10 * distMultiplier + 4.2;
      break;
  }

  // Adjust for port congestion premium and riverine draft restrictions
  if (dischPort.isRiverine) {
    unitFreightBase += 3.8; // Haldia riverine & lock surcharge
  } else if (dischPort.congestionIndex > 7.0) {
    unitFreightBase += 1.2; // Paradip congestion surcharge
  }

  // Add floating transshipment allowance if Sandheads lightening is active
  let transshipmentRatePerMT = 0;
  let transshipmentCostUSD = 0;
  if (applySandheadsLightening) {
    transshipmentRatePerMT = dischPort.typicalTransshipmentCostPerMT || 3.80;
    unitFreightBase += transshipmentRatePerMT;
    transshipmentCostUSD = Math.round(transshipmentRatePerMT * parcelVolume);
  }

  // Bunker price adjustment factor
  const fuelFactor = (baseVlsfoPrice - 605) * 0.006;
  let spotRatePerMT = parseFloat((unitFreightBase + fuelFactor).toFixed(2));

  // Forward curve projection factor for COA
  const forwardDropPercentages = [0, 0.045, 0.098, 0.124]; // Oct, Nov, Dec, Jan
  const projectedDrop = forwardDropPercentages[Math.min(laycanMonthIndex, 3)];

  const coaRatePerMT = parseFloat((spotRatePerMT * 0.885).toFixed(2));

  const spotTotalCostUSD = Math.round(spotRatePerMT * parcelVolume);
  const coaTotalCostUSD = Math.round(coaRatePerMT * parcelVolume);

  // Demurrage calculation
  const demurrageDaily = vessel.demurrageRatePerDay;
  const estimatedDemurrageExposureUSD = Math.round(
    dischPort.avgWaitDays * demurrageDaily
  );

  let demurrageRiskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' = 'LOW';
  if (dischPort.avgWaitDays >= 4.5 || dischPort.isRiverine) {
    demurrageRiskLevel = 'CRITICAL';
  } else if (dischPort.avgWaitDays >= 3.0) {
    demurrageRiskLevel = 'HIGH';
  } else if (dischPort.avgWaitDays >= 1.8) {
    demurrageRiskLevel = 'MODERATE';
  }

  // Savings and decision logic
  let potentialSavingsUSD = 0;
  let savingsPercent = 0;
  let decisionRecommendation: 'ENTER_COA' | 'STAY_SPOT' | 'SHORT_TERM_TENDER' =
    'ENTER_COA';
  let decisionRationale = '';

  const transshipmentNote = applySandheadsLightening
    ? `Includes Sandheads offshore transshipment allowance ($${transshipmentRatePerMT.toFixed(2)}/MT). `
    : '';

  if (laycanMonthIndex >= 2) {
    decisionRecommendation = 'STAY_SPOT';
    const futureExpectedSpot = spotRatePerMT * (1 - projectedDrop);
    potentialSavingsUSD = Math.round((spotRatePerMT - futureExpectedSpot) * parcelVolume);
    savingsPercent = parseFloat((projectedDrop * 100).toFixed(1));
    decisionRationale = `${transshipmentNote}Forward freight curves indicate regional Pacific tonnage replenishment and post-monsoon clearing will soften spot rates by ~${savingsPercent}% by Dec/Jan. Chartering on prompt spot closer to laycan or index-linked contract is projected to yield lowest landed procurement cost.`;
  } else {
    decisionRecommendation = 'ENTER_COA';
    potentialSavingsUSD = spotTotalCostUSD - coaTotalCostUSD;
    savingsPercent = parseFloat(
      (((spotRatePerMT - coaRatePerMT) / spotRatePerMT) * 100).toFixed(1)
    );
    decisionRationale = `${transshipmentNote}Prompt spot availability across Bay of Bengal is constrained with vessel waiting times elevated. Locking in a 3-Month COA secures guaranteed laycan windows at $${coaRatePerMT}/MT, saving $${(spotRatePerMT - coaRatePerMT).toFixed(2)}/MT (${savingsPercent}%) against volatile spot fixtures.`;
  }

  const potentialSavingsINR = Math.round(potentialSavingsUSD * USD_TO_INR_RATE);

  return {
    distanceNM,
    sailingDaysOneWay,
    loadingDays,
    dischargeDays,
    weatherBufferDays,
    portWaitingDays,
    totalTurnaroundDays,
    bunkerConsumptionTotalMT,
    bunkerCostUSD,
    spotRatePerMT,
    spotTotalCostUSD,
    coaRatePerMT,
    coaTotalCostUSD,
    potentialSavingsUSD,
    potentialSavingsINR,
    savingsPercent,
    decisionRecommendation,
    decisionRationale,
    demurrageRiskLevel,
    estimatedDemurrageExposureUSD,
    isTransshipmentApplied: applySandheadsLightening,
    transshipmentRatePerMT,
    transshipmentCostUSD,
  };
}

/**
 * Format currency in Indian Crores / Lakhs or USD
 */
export function formatINR(val: number): string {
  const crores = val / 10000000;
  if (crores >= 1) {
    return `₹${crores.toFixed(2)} Cr`;
  }
  const lakhs = val / 100000;
  if (lakhs >= 1) {
    return `₹${lakhs.toFixed(2)} Lakh`;
  }
  return `₹${val.toLocaleString('en-IN')}`;
}

export function formatUSD(val: number): string {
  if (val >= 1000000) {
    return `$${(val / 1000000).toFixed(2)}M`;
  }
  return `$${val.toLocaleString('en-US')}`;
}
