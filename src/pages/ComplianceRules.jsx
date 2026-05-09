import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

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

  return (
    <div className="container mt-4 mb-5">
      <div className="gov-card p-5">
        <div className="text-center mb-4">
          <h2 className="text-danger">MANDATORY DECLARATION</h2>
          <h4 className="portal-title">Environmental Compliance & AQI Guidelines</h4>
        </div>

        <div className="alert alert-warning">
          <strong>Important:</strong> You must read and acknowledge these rules before accessing the National Industry Air Quality Portal dashboard.
        </div>

        <div className="rules-content my-4 p-4 border bg-light" style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <h5>1. Objective & Scope</h5>
          <p>
            In accordance with the Air (Prevention and Control of Pollution) Act, it is mandatory for all registered industries to provide daily, accurate emission data. This data is public and crucial for national environmental health.
          </p>

          <h5>2. Tax Imposition Logic & Categorization</h5>
          <p>
            Environmental taxes are calculated strictly based on the toxicity and volume of released gases:
          </p>
          <ul>
            <li><strong>High Toxic Gases (SO2, NO2, PM2.5, PM10)</strong>: Subject to higher environmental taxation multipliers due to severe health impacts.</li>
            <li><strong>Low Toxic Gases (CO2)</strong>: Subject to medium base taxation rates.</li>
          </ul>

          <h5>3. Industrial Purifier / Filter Rebates</h5>
          <p>
            The Government of India encourages the installation of Air Purification and Filtration systems.
            <strong> If an industry uses active filters and successfully maintains an overall AQI categorization of "Good" or "Satisfactory" (AQI &lt;= 100), the daily environmental tax will be reduced to ZERO (₹ 0).</strong>
            However, if the filters are failing to maintain an acceptable AQI (AQI &gt; 100), standard taxation applies even if filters are present.
          </p>

          <h5>4. Public Data & Automated Alerts</h5>
          <p>
            All submitted emission data and calculated AQI statistics are published directly to the public admin dashboard. 
            The system will automatically generate alerts and notifications to the registered official email if the industrial plant's AQI crosses into the "Poor" or "Severe" thresholds.
          </p>

          <h5>5. Penalties for Non-Compliance</h5>
          <p>
            Falsification of data or prolonged exposure in the "Severe" category will result in immediate suspension of the plant's operational license and severe financial penalties under section 37 of the Environmental Act.
          </p>
        </div>

        <div className="d-flex flex-column align-items-center mt-4 pt-3 border-top">
          <p className="fw-bold mb-3">
            I, on behalf of {currentUser.companyName} ({currentUser.companyCategory} Category), hereby acknowledge that I have read and understood the Environmental Protection Guidelines and Tax Imposition Rules.
          </p>
          <button onClick={handleAgree} className="btn btn-gov-success btn-lg px-5 shadow">
            I Agree & Continue to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplianceRules;
