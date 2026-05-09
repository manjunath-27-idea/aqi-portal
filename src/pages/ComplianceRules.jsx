import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const stateRules = {
  "Delhi": {
    title: "Delhi Pollution Control Committee (DPCC) Guidelines",
    rules: "In accordance with the Graded Response Action Plan (GRAP), industries in the NCR region must halt diesel generator operations and specific manufacturing activities when AQI crosses the 'Severe' threshold (AQI > 400)."
  },
  "Maharashtra": {
    title: "Maharashtra Pollution Control Board (MPCB) Circulars",
    rules: "Industries must adhere to the MPCB's strict emission norms and ensure continuous connectivity of online continuous emission monitoring systems (OCEMS) to the central MPCB server without any downtime."
  },
  "Gujarat": {
    title: "Gujarat Pollution Control Board (GPCB) Mandates",
    rules: "Facilities within GIDC estates must strictly comply with regional emission standards and implement comprehensive Volatile Organic Compound (VOC) leak detection and repair (LDAR) programs."
  },
  "Telangana": {
    title: "Telangana State Pollution Control Board (TSPCB) Directives",
    rules: "Mandatory green belt development of at least 33% of the total plant area is required to mitigate fugitive emissions, alongside continuous ambient air quality monitoring (CAAQM) at the plant boundary."
  },
  "Jharkhand": {
    title: "Jharkhand State Pollution Control Board (JSPCB) Rules",
    rules: "Mining and heavy manufacturing industries must operate advanced dust suppression systems and submit quarterly environmental audit reports directly to the regional officer."
  },
  "Karnataka": {
    title: "Karnataka State Pollution Control Board (KSPCB) Regulations",
    rules: "Industries operating near urban centers (e.g., Bengaluru) must cap their particulate matter emissions below standard national thresholds and utilize green energy sources wherever feasible."
  }
};

const ComplianceRules = () => {
  const { currentUser, acceptRules } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/register');
    } else if (currentUser.hasAcceptedRules) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const handleAgree = () => {
    acceptRules();
    navigate('/dashboard');
  };

  const localStateRule = stateRules[currentUser.stateLocation] || {
    title: `${currentUser.stateLocation} State Pollution Control Board Guidelines`,
    rules: "All regional industries must ensure their emissions do not breach the specific micro-level thresholds set by local municipal and state environmental authorities, under section 17(1)(g) of the Air Act."
  };

  return (
    <div className="container mt-4 mb-5">
      <div className="gov-card p-5 shadow-lg border-top border-4 border-danger">
        <div className="text-center mb-4">
          <h2 className="text-danger">MANDATORY DECLARATION</h2>
          <h4 className="portal-title">Environmental Compliance & AQI Guidelines</h4>
        </div>

        <div className="alert alert-warning fw-bold text-dark shadow-sm">
          <strong>Important:</strong> You must read and acknowledge these rules before accessing the National Industry Air Quality Portal dashboard.
        </div>

        <div className="rules-content my-4 p-4 border bg-light rounded" style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <h5 className="text-primary border-bottom pb-2">National Regulations</h5>
          
          <h6 className="mt-3">1. Objective & Scope</h6>
          <p className="small text-muted">
            In accordance with the Air (Prevention and Control of Pollution) Act, it is mandatory for all registered industries to provide daily, accurate emission data. This data is public and crucial for national environmental health.
          </p>

          <h6 className="mt-3">2. Tax Imposition Logic & Categorization</h6>
          <p className="small text-muted">
            Environmental taxes are calculated strictly based on the toxicity and volume of released gases:
          </p>
          <ul className="small text-muted">
            <li><strong>High Toxic Gases (SO2, NO2, PM2.5, PM10)</strong>: Subject to higher environmental taxation multipliers due to severe health impacts.</li>
            <li><strong>Low Toxic Gases (CO2)</strong>: Subject to medium base taxation rates.</li>
          </ul>

          <h6 className="mt-3">3. Industrial Purifier / Filter Rebates</h6>
          <p className="small text-muted">
            The Government of India encourages the installation of Air Purification and Filtration systems.
            <strong className="text-success"> If an industry uses active filters and successfully maintains an overall AQI categorization of "Good" or "Satisfactory" (AQI &lt;= 100), the daily environmental tax will be reduced to ZERO (₹ 0).</strong>
            However, if the filters are failing to maintain an acceptable AQI (AQI &gt; 100), standard taxation applies even if filters are present.
          </p>

          <h6 className="mt-3">4. Public Data & Automated Alerts</h6>
          <p className="small text-muted">
            All submitted emission data and calculated AQI statistics are published directly to the public admin dashboard. 
            The system will automatically generate alerts and notifications to the registered official email if the industrial plant's AQI crosses into the "Poor" or "Severe" thresholds.
          </p>

          <h6 className="mt-3">5. Penalties for Non-Compliance</h6>
          <p className="small text-muted">
            Falsification of data or prolonged exposure in the "Severe" category will result in immediate suspension of the plant's operational license and severe financial penalties under section 37 of the Environmental Act.
          </p>

          {/* Dynamic State Rules Section */}
          <h5 className="text-danger border-bottom pb-2 mt-5">State-Specific Regulations: {currentUser.stateLocation}</h5>
          <div className="alert alert-secondary mt-3 border-secondary">
            <h6 className="fw-bold">{localStateRule.title}</h6>
            <p className="mb-0 small">{localStateRule.rules}</p>
          </div>

        </div>

        <div className="d-flex flex-column align-items-center mt-4 pt-3 border-top">
          <p className="fw-bold mb-3 text-center">
            I, on behalf of <span className="text-primary">{currentUser.companyName}</span> ({currentUser.companyCategory} Category, {currentUser.stateLocation}), hereby acknowledge that I have read and understood the National Environmental Protection Guidelines and the specific State Pollution Control Board mandates.
          </p>
          <button onClick={handleAgree} className="btn btn-gov-success btn-lg px-5 shadow fw-bold">
            I Agree & Continue to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplianceRules;
