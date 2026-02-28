# 🏆 AI-Powered Agricultural Decision & Trade Intelligence Platform
**Hackathon 30-Hour Execution Plan**

This document serves as the master checklist for our hackathon build, prioritizing high-impact, realistic features that focus on our strong AI core.

## 🎯 CORE OBJECTIVE
Build a platform that:
- Connects farmers directly with buyers
- Uses AI to predict price & demand
- Suggests best time to sell
- Ensures trust & transparency
- Reduces logistics inefficiencies
- Works for low-literacy users

---

## 🟢 1️⃣ MUST BUILD FEATURES (High Priority)

### 🌾 A. Farmer Side
- [ ] **1. Farmer Onboarding**
  - [ ] OTP login
  - [ ] Location capture
  - [ ] Language selection
- [ ] **2. Crop Listing**
  - [ ] Input: Crop photo, Quantity, Harvest date, Expected price (optional)
  - [ ] AI: CNN quality grading
  - [ ] AI: Suggested price range
- [x] **3. Real-Time Price Intelligence**
  - [x] Display: Current mandi price
  - [x] Display: Nearby region comparison
  - [x] Display: Historical trend graph
  - [x] AI: 7-day forecast (LSTM/Prophet)
- [x] **4. "Sell Now or Wait" Recommendation Engine (KILLER FEATURE)**
  - [x] Based on: Predicted price, Demand forecast, Logistics cost
  - [x] Output: e.g., "Wait 3 days for 6% higher profit."
- [ ] **5. Smart Negotiation Assistant**
  - [ ] When buyer offers low: Show fair price range, Suggest counter offer, Show explanation
- [x] **6. Trust Score System (0–100)**
  - [x] Based on: Transaction completion, Delivery timeliness, Payment reliability
  - [x] Simple explainable weighted formula (Integrated in Frontend & API)
- [ ] **7. Basic Escrow Logic (Simulated)**
  - [ ] Flow: Buyer pays → funds locked → Release after confirmation

### 🛒 B. Buyer Side
- [ ] **1. Search & Filter**
  - [ ] By Crop, Price range, Quality grade, Trust score
- [ ] **2. Smart Farmer Matching**
  - [ ] Sorted by: Profit potential, Distance, Trust score
- [ ] **3. AI Fair Bid Suggestion**
  - [ ] Show recommended offer (Regression based on mandi + predicted trend)
- [ ] **4. Bulk Order Matching (Simplified Version)**
  - [ ] Clustering algorithm to group small farmers for large demand

---

## 🧠 MODELS & SERVICES BUILT (Backend & AI Focus)

- [x] **1️⃣ Price Prediction Model (Core Differentiation)**
  - **Goal**: Predict next 7 days price.
  - **Status**: **DONE**. Integrated via `price_prediction_service.py`. Uses historical Mandi data and temporal features.
  - **Path**: LSTM / Prophet implementation in `mandi-mcp`.

- [x] **2️⃣ Demand Forecast Model**
  - **Goal**: Predict demand level.
  - **Status**: **DONE**. Integrated via `demand_forecast_service.py`. Features seasonal & festival impact analysis.
  - **Path**: Multi-variable regression model in `mandi-mcp`.

- [x] **3️⃣ CNN Quality Grading (Crop Detection)**
  - **Goal**: Grade crop images and detect diseases.
  - **Status**: **DONE**. Integrated via `vision_service.py`. Uses MobileNetV3 for efficient on-device/server-side grading.
  - **Path**: Computer Vision API in `mandi-mcp`.

- [x] **4️⃣ Trust Score Engine**
  - **Goal**: Measure reliability.
  - **Status**: **DONE**. Logic implemented in `src/app/api/farmer/trust-score/route.ts` and `TrustScore.tsx`.
  - **Formula**: `0.4 * Payment + 0.3 * Delivery + 0.2 * Rating + 0.1 * Dispute Penalty`.

- [x] **5️⃣ Smart Sell/Wait Recommendation Engine**
  - **Goal**: Optimization for maximum profit.
  - **Status**: **DONE**. Integrated in `sell-recommendation/route.ts`.
  - **Logic**: Combines Price Forecast + Logistics Cost + Market Demand.

- [x] **6️⃣ Logistics & Profit Optimizer**
  - **Goal**: Real-time route and profit calculation.
  - **Status**: **DONE**. Logic in `logistics/route.ts` and `LogisticsCalculator.tsx`.

---

## 🟡 2️⃣ NEXT STEPS (Enhancers)
- [ ] Voice-based listing (Speech-to-text API)
- [ ] Smart Negotiation Assistant for lower buyer offers.
- [ ] Route optimization (basic shortest path integration)
- [ ] Farmer Onboarding (OTP login & Location capture)

## 🔴 3️⃣ DEMO-ONLY (Simulated Features)
- [ ] Blockchain price log simulation
- [ ] Smart contract escrow (mock)
- [ ] Crop recommendation engine
- [ ] Sustainability score
