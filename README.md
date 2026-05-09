# National Industry Air Quality & Tax Portal

An advanced, compliant Air Quality Index (AQI) tracking and tax calculation portal designed for industrial emissions monitoring. Modeled after official Indian Government digital platforms, this application features strict regulatory compliance workflows, automated Continuous Emissions Monitoring Systems (CEMS) discrepancy detection, interactive analytics, and transparent public reporting.

---

## 💻 Technology Stack

- **Frontend**: React.js (Vite), React Router DOM (Configured with `HashRouter` for GitHub Pages deployment)
- **Data Visualization**: Recharts (for dynamic line graphs)
- **Styling**: Bootstrap 5, Custom CSS Variables
- **State Management**: React Context API, LocalStorage Data Persistence
- **Design System**: High-contrast, official government color palettes (Saffron, Navy Blue, Forest Green) with modern UI elements.

---

## 🌟 Application Capabilities & System Architecture

This portal is not just a UI; it is a complex rules engine that simulates a real-world environmental protection agency backend. Below is a detailed breakdown of what is actually included in the system.

### 1. The 21 Regulated Industrial Categories
The landing page features an interactive, MeeSeva-style grid navigation system for the 21 heavily polluting industries recognized by the CPCB. Logged-in users clicking their category are routed to their dashboard, while guests are directed to register. Included industries:
*Aluminum Smelter, Basic Drugs & Pharmaceuticals, Cement, Chlor-Alkali, Copper Smelter, Distillery, Dyes and Dye-Intermediates, Fertilizer, Iron and Steel, Lead Smelter, Oil Refinery, Pesticides, Petrochemicals, Pulp and Paper, Sugar, Tanneries, Thermal Power Plants, Rubber Manufacturing, Waste & E-Recycling, Glass Manufacturing, and Gas Manufacturing.*

### 2. Supported OCEMS Chemicals & Sensors
The system strictly monitors 7 specific industrial pollutants. Companies must declare which of these they emit during registration.
- **PM2.5 & PM10**: Particulate Matter (Highly weighted in AQI).
- **SO₂ (Sulfur Dioxide) & NO₂ (Nitrogen Dioxide)**: Highly toxic, heavily taxed pollutants.
- **CO₂ (Carbon Dioxide)**: Primary greenhouse gas.
- **O₃ (Ozone) & NH₃ (Ammonia)**.

### 3. Regulatory Rules Engine & Bypass Detection
The backend simulation applies strict mathematical rules to every submitted data point:
- **Statutory AQI Logic**: AQI is only calculated if at least 3 pollutants are submitted, and one MUST be PM2.5 or PM10.
- **Filter Bypass Enforcement**: The system monitors "Process Control Parameters" (Stack Temperature and Gas Flow Rate). If a company claims their Gas Cleaning Plant is ACTIVE, but their Stack Temp is < 80°C or Flow Rate < 400 m³/hr, the system triggers an immediate **Bypass Violation Alert** and notifies authorities, recognizing that the sensors are being starved of exhaust.
- **Sensor Discrepancy Alerts**: If a company registers saying they only emit CO₂, but their sensors pick up SO₂, the system flags an "Undeclared Gas" violation.

### 4. Toxicity-Weighted Environmental Tax System
Taxes are dynamically calculated based on the specific toxicity of released gases, not just overall volume.
- **Tax Rates**: 
  - PM2.5: ₹200 per unit
  - SO₂: ₹250 per unit
  - NO₂: ₹150 per unit
  - CO₂: ₹10 per unit
- **Purifier Rebate**: If a company has an active purifier AND maintains an AQI under 100 ("Good" or "Satisfactory"), their entire environmental tax is reduced to **₹0 (100% Rebate)** as an incentive.

### 5. Advanced Company Dashboard (The Post-Login Experience)
The company portal utilizes a 3-tab architecture for complex data management:
- **Tab 1: Live OCEMS Monitor**: Features the CEMS data simulator. If a violation occurs, massive red alert banners appear at the top detailing the exact enforcement action taken.
- **Tab 2: Historical Analytics**: Integrates **Recharts** to generate an interactive, responsive line chart. It plots AQI (Red line), PM2.5 (Purple), SO₂ (Green), and CO₂ (Yellow) over the last 30 days.
- **Tab 3: Tax & Financial Ledger**: An automated financial invoice tracker. It logs historical submissions, shows violation flags for each day, calculates the Total Outstanding Dues, and displays a "Cleared/Unpaid" status.
- **Maintenance Window Mode**: A toggle switch that places the dashboard into a yellow warning state, simulating the real-world ability to temporarily suspend automated penalization while sensors are being calibrated.

### 6. Public Admin Dashboard & CMS
A comprehensive portal for the public and government officials to monitor national compliance.
- **Geographic Danger Zones**: Aggregates all registered companies into regions (North, South, East, West, Central). It calculates the average AQI per zone and highlights the "Top Polluter" in severe zones.
- **Live Companies Registry**: A master table of all industries, showing their latest AQI, total tax paid, and active alerts.
- **Dynamic Authorities CMS**: A built-in Content Management System. Admins can edit the names, roles, and departments of Central (Govt of India) and State (Govt of Telangana) authorities. It uses `ui-avatars` to instantly generate official badges based on names, with full support for uploading custom Image URLs.

---

## ⚙️ Running Locally

1. Install base dependencies and the charting library:
   ```bash
   npm install
   npm install recharts
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🌐 GitHub Pages Deployment

This project is pre-configured for deployment to GitHub Pages.
1. Install the `gh-pages` package:
   ```bash
   npm install gh-pages --save-dev
   ```
2. Run the automated deploy script:
   ```bash
   npm run deploy
   ```

---

## 🗄️ Pre-Loaded Seed Data

The application comes pre-loaded with demonstration data to immediately test the system:
- **Tata Steel (Iron and Steel, Jharkhand)**: Fully compliant, active purifiers, ₹0 tax.
- **Vapi Chemical Works (Petrochemicals, Gujarat)**: Severe AQI (322), triggering undeclared chemical discrepancies for SO₂ and O₃.
- **Delhi North Power (Thermal Power, Delhi)**: Failing to maintain clean air despite claiming active purifiers. The system detects abnormally low stack temperatures and triggers a Filter Bypass enforcement action.
