export type IndianPortId =
  | 'paradip'
  | 'dhamra'
  | 'gangavaram'
  | 'vizag_outer'
  | 'gopalpur'
  | 'haldia';

export type LoadingPortId =
  | 'gladstone'
  | 'newcastle'
  | 'muara_berau'
  | 'samarinda'
  | 'richards_bay'
  | 'maputo'
  | 'hampton_roads';

export type VesselTypeId =
  | 'capesize'
  | 'kamsarmax_panamax'
  | 'supramax_ultramax'
  | 'handysize';

export type CommodityId =
  | 'coking_coal'
  | 'thermal_coal'
  | 'iron_ore'
  | 'limestone'
  | 'bauxite';

export interface DischargePort {
  id: IndianPortId;
  name: string;
  state: string;
  maxDraft: number; // in meters
  maxLoa: number; // in meters
  maxBeam: number; // in meters
  dailyDischargeRate: number; // MT/day
  congestionIndex: number; // 1-10 scale
  avgWaitDays: number; // days in anchorage
  berthType: string;
  isRiverine: boolean;
  notes: string;
  coordinates: [number, number]; // [lat, lng]
  lighteningAnchorages?: string[];
  supportsOffshoreLightening?: boolean;
  typicalTransshipmentCostPerMT?: number;
  shortLoadThresholdMT?: number;
}

export interface LoadingPort {
  id: LoadingPortId;
  name: string;
  country: string;
  region: string;
  supportedCommodities: CommodityId[];
  distanceToEastCoastNM: Record<IndianPortId, number>;
  loadingRateMTDay: number;
  avgLoadingWaitDays: number;
  coordinates: [number, number];
}

export interface VesselType {
  id: VesselTypeId;
  name: string;
  dwtMin: number;
  dwtMax: number;
  dwtTypical: number;
  draftTypical: number; // meters
  loaTypical: number; // meters
  beamTypical: number; // meters
  speedKnots: number;
  vlsfoDailyMT: number; // metric tons per day
  baseDailyHireTCE: number; // USD per day
  demurrageRatePerDay: number; // USD per day
  description: string;
}

export interface Commodity {
  id: CommodityId;
  name: string;
  category: 'Met Coal' | 'Thermal Coal' | 'Ores' | 'Minerals';
  typicalStowageFactor: number; // cu ft / MT
  defaultParcelSize: number; // MT
  minParcelSize: number;
  maxParcelSize: number;
}

export interface BalticIndexRecord {
  date: string;
  bci: number; // Baltic Capesize Index
  bpi: number; // Baltic Panamax Index
  bsi: number; // Baltic Supramax Index
  brentCrude: number; // $/bbl
  vlsfoBunker: number; // $/MT Singapore/Fujairah
  isForecast?: boolean;
  bciP10?: number;
  bciP50?: number;
  bciP90?: number;
  bpiP10?: number;
  bpiP50?: number;
  bpiP90?: number;
  bsiP10?: number;
  bsiP50?: number;
  bsiP90?: number;
}

export interface PortFeasibilityResult {
  isFeasible: boolean;
  draftFeasible: boolean;
  loaFeasible: boolean;
  beamFeasible: boolean;
  reasons: string[];
  recommendedVessel: VesselTypeId | null;
  canSwitchVessel: boolean;
  requiresLighteningOrShortLoad: boolean;
  lighteningRecommendedMT?: number;
  shortLoadRecommendedMT?: number;
  port: DischargePort;
  vessel: VesselType;
  maxAllowableParcelMT: number;
  calculatedSailingDraft: number;
}

export interface VoyageCalculationResult {
  distanceNM: number;
  sailingDaysOneWay: number;
  loadingDays: number;
  dischargeDays: number;
  weatherBufferDays: number;
  portWaitingDays: number;
  totalTurnaroundDays: number;
  bunkerConsumptionTotalMT: number;
  bunkerCostUSD: number;
  spotRatePerMT: number;
  spotTotalCostUSD: number;
  coaRatePerMT: number;
  coaTotalCostUSD: number;
  potentialSavingsUSD: number;
  potentialSavingsINR: number;
  savingsPercent: number;
  decisionRecommendation: 'ENTER_COA' | 'STAY_SPOT' | 'SHORT_TERM_TENDER';
  decisionRationale: string;
  demurrageRiskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  estimatedDemurrageExposureUSD: number;
  isTransshipmentApplied?: boolean;
  transshipmentRatePerMT?: number;
  transshipmentCostUSD?: number;
}
