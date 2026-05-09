# National Industry Air Quality & Tax Portal

An advanced, compliant Air Quality Index (AQI) tracking and tax calculation portal designed for industrial emissions monitoring. Modeled after official Indian Government digital platforms, this application features strict regulatory compliance workflows, automated Continuous Emissions Monitoring Systems (CEMS) discrepancy detection, and transparent public reporting.

## Key Features

- **Mandatory Compliance Flow**: Industries must register and acknowledge formal environmental regulations and tax imposition logic before accessing the system.
- **Toxicity-Weighted Environmental Tax**: Taxes are dynamically calculated based on the specific toxicity of released gases (High tax for $SO_2$ and $NO_2$, lower base tax for $CO_2$).
- **Purifier Rebate System**: Industries utilizing active Air Purification systems receive a 100% tax rebate (₹0) **only if** they successfully maintain an AQI in the "Good" or "Satisfactory" tier (<= 100).
- **Sensor Discrepancy Engine**: Companies must declare their expected emissions during registration. If daily sensor submissions contain undeclared chemicals, the system immediately flags the facility for non-compliance.
- **AI-Driven Mitigation Strategies**: The dashboard analyzes daily chemical footprints and provides tailored, actionable advice to reduce specific emissions (e.g., suggesting Scrubber maintenance for high $SO_2$).
- **Geographic Danger Zones**: The public Admin dashboard groups industries by regional zones (North, South, East, West, Central) and identifies the top polluting companies in severe AQI zones.
- **Multi-Lingual Support**: Built-in language toggles (English, Hindi, Telugu) for strict GIGW accessibility compliance.
- **Dynamic Authorities**: The dashboard automatically maps and displays the appropriate State Pollution Control Board authorities based on the industry's registered state.

## Technology Stack

- **Frontend**: React.js (Vite), React Router DOM
- **Styling**: Bootstrap 5, Custom CSS Variables
- **State Management**: React Context API, LocalStorage Data Persistence
- **Design System**: Glassmorphism elements combined with high-contrast, official government color palettes (Saffron, Navy Blue, Forest Green).

## Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```

## Seed Data

The application comes pre-loaded with demonstration data to immediately populate the Admin Dashboard without manual registration:
- **Tata Steel**: Compliant heavy industry, ₹0 tax.
- **Vapi Chemical Works**: Severe AQI, triggering undeclared chemical discrepancies.
- **Delhi North Power**: Power plant failing to maintain clean air despite having purifiers, revoking their tax rebate.
