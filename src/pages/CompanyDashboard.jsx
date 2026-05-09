import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { calculateAQI, calculateTax, getAQICategory } from '../utils/calculations';

// Mock Dictionary of State Authorities
const stateAuthorities = {
  "Delhi": { board: "Delhi Pollution Control Committee (DPCC)", chairman: "Dr. K.S. Jayachandran" },
  "Maharashtra": { board: "Maharashtra Pollution Control Board (MPCB)", chairman: "A.L. Jarhad" },
  "Gujarat": { board: "Gujarat Pollution Control Board (GPCB)", chairman: "R.B. Barad" },
  "Telangana": { board: "Telangana State Pollution Control Board (TSPCB)", chairman: "Rajat Kumar" },
  "Jharkhand": { board: "Jharkhand State Pollution Control Board (JSPCB)", chairman: "A.K. Rastogi" },
  "Karnataka": { board: "Karnataka State Pollution Control Board (KSPCB)", chairman: "Shanth A. Thimmaiah" }
};

const CompanyDashboard = () => {
  const { currentUser, submitData } = useContext(AppContext);
  const navigate = useNavigate();

  const [chemicals, setChemicals] = useState({
    PM25: '',
    PM10: '',
    SO2: '',
    NO2: '',
    CO2: ''
  });
  const [hasPurifier, setHasPurifier] = useState(false);
  
  const [latestAQI, setLatestAQI] = useState(null);
  const [latestTax, setLatestTax] = useState(null);
  const [undeclaredAlerts, setUndeclaredAlerts] = useState([]);
  const [mitigationSuggestions, setMitigationSuggestions] = useState([]);

  useEffect(() => {
    if (!currentUser) {
      navigate('/register');
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const handleChemicalChange = (e) => {
    setChemicals({ ...chemicals, [e.target.name]: e.target.value });
  };

  const generateSuggestions = (parsedChemicals) => {
    const suggestions = [];
    if (parsedChemicals.SO2 > 50) {
      suggestions.push("High SO2 Detected: Immediate inspection of Flue-Gas Desulfurization (FGD) units or wet scrubbers recommended. Consider using lower-sulfur fuel.");
    }
    if (parsedChemicals.NO2 > 50) {
      suggestions.push("High NO2 Detected: Optimize combustion temperatures. Check Selective Catalytic Reduction (SCR) systems for ammonia slip or catalyst degradation.");
    }
    if (parsedChemicals.PM25 > 30 || parsedChemicals.PM10 > 50) {
      suggestions.push("High Particulate Matter (PM) Detected: Inspect Electrostatic Precipitators (ESPs) and baghouse filters. Ensure water spray systems are active in material handling zones.");
    }
    if (parsedChemicals.CO2 > 100) {
      suggestions.push("High CO2 Detected: Conduct energy efficiency audits. Evaluate carbon capture storage (CCS) feasibility for long-term compliance.");
    }
    if (suggestions.length === 0) {
      suggestions.push("Emissions are within normal operating parameters. Continue standard monitoring and maintenance schedules.");
    }
    return suggestions;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const parsedChemicals = {
      PM25: Number(chemicals.PM25) || 0,
      PM10: Number(chemicals.PM10) || 0,
      SO2: Number(chemicals.SO2) || 0,
      NO2: Number(chemicals.NO2) || 0,
      CO2: Number(chemicals.CO2) || 0
    };

    // Discrepancy Check
    const undeclared = [];
    if (currentUser.declaredChemicals) {
      Object.keys(parsedChemicals).forEach(chem => {
        if (parsedChemicals[chem] > 0 && !currentUser.declaredChemicals.includes(chem)) {
          undeclared.push(chem);
        }
      });
    }
    setUndeclaredAlerts(undeclared);

    // Suggestions Generation
    setMitigationSuggestions(generateSuggestions(parsedChemicals));

    const aqi = calculateAQI(parsedChemicals);
    const tax = calculateTax(parsedChemicals, hasPurifier, aqi);

    setLatestAQI(aqi);
    setLatestTax(tax);

    submitData({
      chemicals: parsedChemicals,
      hasPurifier,
      aqi,
      tax,
      discrepancies: undeclared
    });
  };

  const aqiInfo = latestAQI !== null ? getAQICategory(latestAQI) : null;
  const isAlertLevel = latestAQI !== null && latestAQI > 200; 

  const stateAuth = stateAuthorities[currentUser.stateLocation] || { board: `${currentUser.stateLocation} State Pollution Control Board`, chairman: "Regional Director" };

  return (
    <div className="container mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <div>
          <h2 className="mb-0">Dashboard - {currentUser.companyName}</h2>
          <small className="text-muted">{currentUser.industryType} | {currentUser.companyCategory} Category | {currentUser.stateLocation} ({currentUser.region} Zone)</small>
        </div>
        <div className="text-end">
          <span className="badge bg-secondary mb-1">Reg ID: {currentUser.regNumber}</span>
          <div className="small text-muted fw-bold">Monitoring Authority:</div>
          <div className="small text-primary">{stateAuth.board}</div>
        </div>
      </div>

      {isAlertLevel && (
        <div className="alert alert-danger fw-bold shadow-sm d-flex align-items-center">
          <span className="me-3 fs-3">⚠️</span>
          <div>
            OFFICIAL ALERT: Your plant's Air Quality Index ({latestAQI}) is "{aqiInfo.label}". Immediate corrective action is required. Notices have been forwarded to {stateAuth.chairman}, Chairman, {stateAuth.board}.
          </div>
        </div>
      )}

      {undeclaredAlerts.length > 0 && (
        <div className="alert alert-warning fw-bold shadow-sm d-flex align-items-center">
          <span className="me-3 fs-3">🚨</span>
          <div>
            SENSOR DISCREPANCY: Sensors reporting emissions for undeclared chemicals: {undeclaredAlerts.join(', ')}. 
            Please fix the leak or update your profile with the {stateAuth.board}.
          </div>
        </div>
      )}

      {latestTax === 0 && hasPurifier && (
        <div className="alert alert-success fw-bold shadow-sm d-flex align-items-center">
          <span className="me-3 fs-3">✅</span>
          <div>
            COMPLIANCE SUCCESS: By utilizing active industrial purifiers and maintaining a "{aqiInfo.label}" AQI, your environmental tax has been reduced to ZERO (₹0).
          </div>
        </div>
      )}

      <div className="row">
        {/* Data Submission Form */}
        <div className="col-lg-6 mb-4">
          <div className="gov-card p-4 h-100">
            <h4 className="gov-card-title">Daily Emission Data Entry</h4>
            <form onSubmit={handleSubmit}>
              <div className="alert alert-warning py-2 small">
                All values must be entered in µg/m³ (micrograms per cubic meter).
              </div>
              
              <div className="row">
                {Object.keys(chemicals).map(chem => (
                  <div className="col-md-6 mb-3" key={chem}>
                    <label className="form-label fw-bold">
                      {chem} 
                      {currentUser.declaredChemicals && !currentUser.declaredChemicals.includes(chem) && <span className="badge bg-danger ms-2" style={{fontSize: '0.6rem'}}>Undeclared</span>}
                    </label>
                    <input 
                      type="number" 
                      className="form-control" 
                      name={chem} 
                      value={chemicals[chem]} 
                      onChange={handleChemicalChange}
                      min="0"
                      placeholder="0"
                    />
                  </div>
                ))}
              </div>

              <div className="form-check mb-4 mt-2">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="purifierCheck" 
                  checked={hasPurifier}
                  onChange={e => setHasPurifier(e.target.checked)}
                />
                <label className="form-check-label fw-bold" htmlFor="purifierCheck">
                  Industrial Air Purification System Active?
                </label>
                <div className="form-text">Active purifiers combined with Good/Satisfactory AQI (&lt;=100) eliminates your daily tax.</div>
              </div>

              <button type="submit" className="btn btn-gov-primary w-100 py-2">Submit Analysis & Calculate</button>
            </form>
          </div>
        </div>

        {/* Results / Status */}
        <div className="col-lg-6 mb-4">
          <div className="gov-card p-4 h-100 d-flex flex-column">
            <h4 className="gov-card-title">Analysis Results & Measures</h4>
            
            {latestAQI === null ? (
              <div className="text-center text-muted mt-5 flex-grow-1 d-flex flex-column justify-content-center">
                <p>Submit your emission data to view AQI, Alerts, Tax calculations, and AI Mitigation Suggestions.</p>
              </div>
            ) : (
              <div className="d-flex flex-column flex-grow-1">
                <div className="row">
                  <div className="col-6">
                    <div className="dashboard-stat-card mb-3" style={{ borderLeftColor: aqiInfo.color, padding: '15px' }}>
                      <p className="text-muted mb-0 fw-bold small">Current AQI</p>
                      <h4 className="mb-0" style={{ color: aqiInfo.color }}>{latestAQI} <span className="badge rounded-pill" style={{ backgroundColor: aqiInfo.color, fontSize: '0.7rem' }}>{aqiInfo.label}</span></h4>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="dashboard-stat-card border-left-danger mb-3" style={{ padding: '15px' }}>
                      <p className="text-muted mb-0 fw-bold small">Daily Tax</p>
                      <h4 className={latestTax === 0 ? "text-success mb-0" : "text-danger mb-0"}>₹ {latestTax.toLocaleString('en-IN')}</h4>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex-grow-1">
                  <h6 className="text-primary fw-bold border-bottom pb-2">AI Tailored Mitigation Strategies</h6>
                  <ul className="small text-muted ps-3">
                    {mitigationSuggestions.map((suggestion, idx) => (
                      <li key={idx} className="mb-2">{suggestion}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto pt-3 border-top">
                  <h6 className="fw-bold">Recent History</h6>
                  {currentUser.submissions && currentUser.submissions.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-sm table-striped mt-2 mb-0" style={{fontSize: '0.8rem'}}>
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>AQI</th>
                            <th>Tax (₹)</th>
                            <th>Discrepancy</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[...currentUser.submissions].reverse().slice(0, 3).map((sub, idx) => (
                            <tr key={idx}>
                              <td>{new Date(sub.date).toLocaleDateString('en-IN')}</td>
                              <td>{sub.aqi}</td>
                              <td>{sub.tax}</td>
                              <td>{sub.discrepancies && sub.discrepancies.length > 0 ? <span className="text-danger fw-bold">Yes</span> : 'No'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-muted small">No history available.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
