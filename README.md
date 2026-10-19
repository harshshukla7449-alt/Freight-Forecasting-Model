# NaviFreight AI: Intelligent Maritime Freight Forecasting & Bulk Chartering Decision Platform

An enterprise-grade Next.js (App Router, TypeScript, Tailwind CSS) platform providing predictive freight rate analytics, vessel feasibility validation against physical port constraints (draft, LOA, beam), and actionable contract recommendations (Spot vs Short/Mid-term COA) for bulk cargo procurement into the East Coast of India.

---

## 🌊 Overview & Business Problem

Bulk cargo procurement (coking coal, thermal coal, iron ore, limestone, bauxite) from major overseas origins (Australia, Indonesia, South Africa/Mozambique, US Gulf) into East Coast Indian ports (Paradip, Dhamra, Gangavaram, Vizag Outer, Gopalpur, Haldia) currently suffers from reactive spot-market chartering.

**NaviFreight AI** provides:
1. **Interactive Multi-Stage Scrollytelling Narrative** (powered by Framer Motion):
   - **Stage 1 (The Global Bulk Flow)**: Vector corridor tracing across Queensland/Newcastle, Kalimantan, and Mozambique arteries into Bay of Bengal with real-time stats.
   - **Stage 2 (The Physical Constraint Bottleneck)**: Interactive depth meters comparing Dhamra (17.5m), Paradip (14.5m), and Haldia (8.0m) with dynamic ship waterlines.
   - **Stage 3 (The Algorithmic Advantage)**: Quantitative comparison of Spot price exposure vs 11.8% COA savings.
   - **Stage 4 (Seamless Operational Handoff)**: Direct release into the live workspace, with a floating "Jump to Simulator" quick bypass button.
2. **Intelligent Port Constraint Feasibility Engine**: Automatically audits vessel physical dimensions (Draft, LOA, Beam) against harbor master restrictions.
3. **Predictive Rate Forecasting Hub**: 6-month historical Baltic sub-indices (Capesize BCI, Panamax BPI, Supramax BSI) and 90-day predictive forward curves with P10, P50, and P90 confidence intervals.
4. **Actionable Contract Recommendation Engine**: Compares prompt Spot freight ($/MT) vs 3-Month COA benchmarks, with projected cost savings in both USD and INR (₹ Crores).
5. **East Coast Port Matrix**: Real-time directory with berth parameters, daily discharge speeds, and congestion indices.
6. **Global Voyage Corridors & Chokepoint Intel**: Route navigation, bunkering hubs, and seasonal weather advisories across Bay of Bengal, Lombok Strait, and Malacca Strait.

---

## 🏗️ Architecture & Modules

### 1. Static Reference Data & Models (`/src/data/maritimeData.ts`)
- **East Coast Indian Ports**:
  - **Paradip (PPT)**: Max Draft 14.5m, Max LOA 260m, Max Beam 43m, Daily Discharge 25,000 MT/day.
  - **Dhamra (DPCL)**: Max Draft 17.5m, Max LOA 300m, Max Beam 50m, Daily Discharge 35,000 MT/day (Capesize-ready deep-water port).
  - **Gangavaram (GPL)**: Max Draft 18.5m, Max LOA 310m, Max Beam 50m, Daily Discharge 35,000 MT/day (Deepest port on Indian East Coast).
  - **Vizag Outer Harbor (VPA)**: Max Draft 16.5m, Max LOA 285m, Max Beam 45m, Daily Discharge 22,000 MT/day.
  - **Gopalpur**: Max Draft 13.0m, Max LOA 225m, Max Beam 32m, Daily Discharge 15,000 MT/day.
  - **Haldia Dock Complex (HDC)**: Max Draft 8.0m (Riverine), Max LOA 190m, Max Beam 28m, Daily Discharge 12,000 MT/day.
- **Overseas Loading Terminals**:
  - Gladstone & Newcastle (Australia)
  - Muara Berau & Samarinda (Indonesia)
  - Richards Bay & Maputo (Mozambique / South Africa)
  - Hampton Roads / Norfolk (USA)
  - *All configured with exact nautical miles (NM) to each Indian East Coast port.*
- **Vessel Classes**:
  - **Capesize**: ~150k–185k DWT, Draft ~17.8m, LOA ~290m, Beam ~45.0m
  - **Kamsarmax / Panamax**: ~75k–85k DWT, Draft ~14.4m, LOA ~229m, Beam ~32.2m
  - **Supramax / Ultramax**: ~55k–64k DWT, Draft ~13.0m, LOA ~199m, Beam ~32.2m
  - **Handysize**: ~28k–38k DWT, Draft ~10.5m, LOA ~180m, Beam ~28.0m

### 2. Intelligent Charter Simulator (`/src/components/CharterSimulator.tsx`)
- Form inputs: Commodity, Parcel Volume (MT), Loading Origin, Discharge Port, Target Laycan/Arrival Month.
- **Real-time Feasibility & Constraint Engine**:
  - Automatically compares dynamic vessel loaded arrival draft against port permissible draft.
  - **No Redundant Recommendations**: If a Handysize vessel is selected for a shallow draft port like Haldia (8.0m max draft), it recognizes Handysize is already the smallest bulk category and does not display an unhelpful "Switch vessel to Handysize".
  - **Realistic Maritime Transshipment / Lightening Logic**:
    - **Strategy A: Offshore Lightening / Transshipment**: Transload ~10,000–14,000 MT at deepwater anchorage (Sandheads / Sagar Island Anchorage) onto river barges prior to Haldia lock entry.
    - **Strategy B: Short-Load Parcel**: Cap parcel intake strictly to ~20,000–22,000 MT to keep arrival freshwater draft within Haldia's ~8.0m river threshold.
    - **Interactive Resolution**: "Apply Sandheads Lightening Plan" toggle incorporates a $3.80/MT floating transshipment allowance into the landed rate and clears physical feasibility to `FEASIBLE VIA ANCHORAGE TRANSSHIPMENT`.
  - **Auto-Sizing on Vessel Switch**: For other ports (e.g. Cape -> Kamsarmax for Paradip), clicking "Switch vessel" directly updates both the vessel class and resets parcel volume to the optimal size for that berth (e.g. 75,000 MT).
- **Contract Recommendation Engine**: Spot Rate ($/MT) vs 3-Month COA Rate ($/MT) with actionable tags:
  - `[ENTER 3-MONTH COA CONTRACT - HIGH SAVINGS]` or
  - `[STAY ON SPOT - RATES PROJECTED TO DROP 12% IN 30 DAYS]`
- Landed savings in USD and INR (₹ Crores).
- Voyage logistics: Sailing days, loading/discharge days, turnaround time, bunker fuel consumption (VLSFO), and demurrage exposure.

### 3. Freight Forecasting & Volatility Hub (`/src/components/ForecastChart.tsx`)
- Interactive Recharts visualization with toggleable segments (All, Capesize BCI, Panamax BPI, Supramax BSI).
- Toggleable horizons (30d, 60d, 90d, 180d).
- Upper/lower confidence intervals (P10, P50, P90) shaded area envelope.
- Early Warning Radar with fundamental market drivers (SW Monsoon clearing, Australian coal terminal turnaround, Bunker price fluctuations).

### 4. East Coast Port Capability Matrix (`/src/components/PortMatrix.tsx`)
- Searchable & filterable directory (e.g. "Capesize-Ready", "Low Wait Time < 2 Days").
- Real-time compatibility badges for each vessel class.
- Detailed drawer with rail connectivity (ECoR / SER) and harbor master guidelines.

### 5. Voyage Corridors & Chokepoints (`/src/components/RouteVoyageMap.tsx`)
- Transit passage analysis across Lombok Strait, Malacca Strait, Cape of Good Hope, and Bay of Bengal.
- Bunker replenishment hubs & IMO Carbon Intensity Indicator (CII).

---

## 🚀 Getting Started

### Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build & Serve
```bash
npm run build
npm start
```
Runs on port 3000.
