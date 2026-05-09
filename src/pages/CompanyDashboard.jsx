import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { calculateAQI, calculateTax, getAQICategory } from '../utils/calculations';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
    PM25: '', PM10: '', SO2: '', NO2: '', CO2: '', O3: '', NH3: ''
  });
  const [temperature, setTemperature] = useState('');
  const [flowRate, setFlowRate] = useState('');
  const [hasPurifier, setHasPurifier] = useState(false);
  
  const [latestAQI, setLatestAQI] = useState(null);
  const [latestTax, setLatestTax] = useState(null);
  const [undeclaredAlerts, setUndeclaredAlerts] = useState([]);
  const [mitigationSuggestions, setMitigationSuggestions] = useState([]);
  const [bypassDetected, setBypassDetected] = useState(false);
  const [aqiError, setAqiError] = useState('');
  
  const [activeTab, setActiveTab] = useState('monitor');
  const [maintenanceMode, setMaintenanceMode] = useState(false);

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
    setAqiError('');
    setBypassDetected(false);
    
    const parsedChemicals = {
      PM25: Number(chemicals.PM25) || 0,
      PM10: Number(chemicals.PM10) || 0,
      SO2: Number(chemicals.SO2) || 0,
      NO2: Number(chemicals.NO2) || 0,
      CO2: Number(chemicals.CO2) || 0,
      O3: Number(chemicals.O3) || 0,
      NH3: Number(chemicals.NH3) || 0
    };

    const tempVal = Number(temperature) || 0;
    const flowVal = Number(flowRate) || 0;

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

    // Official AQI Logic
    const aqiResult = calculateAQI(parsedChemicals);
    if (aqiResult.error) {
      setAqiError(aqiResult.error);
      return; // Stop submission
    }

    const aqi = aqiResult.value;

    // Bypass Logic
    let isBypass = false;
    if (hasPurifier && (tempVal < 80 || flowVal < 400)) {
      isBypass = true;
      setBypassDetected(true);
    }

    // Suggestions Generation
    setMitigationSuggestions(generateSuggestions(parsedChemicals));
    const tax = calculateTax(parsedChemicals, hasPurifier, aqi);

    setLatestAQI(aqi);
    setLatestTax(tax);

    submitData({
      chemicals: parsedChemicals,
      temperature: tempVal,
      flowRate: flowVal,
      hasPurifier,
      aqi,
      tax,
      discrepancies: undeclared,
      bypassDetected: isBypass
    });
  };

  const aqiInfo = latestAQI !== null ? getAQICategory(latestAQI) : null;
  const isAlertLevel = latestAQI !== null && latestAQI > 200; 

  const stateAuth = stateAuthorities[currentUser.stateLocation] || { board: `${currentUser.stateLocation} State Pollution Control Board`, chairman: "Regional Director" };

  return (
    <div className={`container-fluid py-4 mb-5 ${maintenanceMode ? 'bg-warning bg-opacity-10' : ''}`} style={{minHeight: '100vh', transition: 'background-color 0.5s'}}>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3 border-dark border-opacity-25">
          <div>
            <h2 className="mb-0">CEMS Dashboard - {currentUser.companyName}</h2>
            <small className="text-muted fw-bold">
              <span className="text-primary">{currentUser.industryType}</span> | {currentUser.companyCategory} | {currentUser.stateLocation} ({currentUser.region})
            </small>
          </div>
          <div className="text-end">
            <div className="form-check form-switch d-inline-block text-start mb-2 bg-white p-2 border rounded shadow-sm">
              <input className="form-check-input ms-0 me-2" type="checkbox" id="maintenanceMode" checked={maintenanceMode} onChange={() => setMaintenanceMode(!maintenanceMode)} style={{cursor: 'pointer'}} />
              <label className="form-check-label fw-bold text-warning" htmlFor="maintenanceMode" style={{cursor: 'pointer'}}>Maintenance Window</label>
            </div>
            <div className="badge bg-dark mb-1 d-block text-start">Station: {currentUser.stationId || 'N/A'}</div>
            <div className="badge bg-secondary mb-1 d-block text-start">GPS: {currentUser.gpsCoordinates || 'N/A'}</div>
            <div className="small text-muted fw-bold mt-2">Authority:</div>
            <div className="small text-primary">{stateAuth.board}</div>
          </div>
        </div>

        {maintenanceMode && (
          <div className="alert alert-warning shadow-sm border-warning fw-bold d-flex align-items-center mb-4">
            <span className="me-3 fs-3">🚧</span>
            <div>
              MAINTENANCE MODE ACTIVE: Automated penalization for sensor calibration spikes is temporarily suspended for a 2-hour window. Ensure manual calibration logs are retained.
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <ul className="nav nav-tabs mb-4 border-bottom-0">
          <li className="nav-item">
            <button className={`nav-link fw-bold ${activeTab === 'monitor' ? 'active border-bottom-0' : 'bg-light text-muted'}`} onClick={() => setActiveTab('monitor')}>Live OCEMS Monitor</button>
          </li>
          <li className="nav-item">
            <button className={`nav-link fw-bold ${activeTab === 'analytics' ? 'active border-bottom-0' : 'bg-light text-muted'}`} onClick={() => setActiveTab('analytics')}>Historical Analytics</button>
          </li>
          <li className="nav-item">
            <button className={`nav-link fw-bold ${activeTab === 'ledger' ? 'active border-bottom-0' : 'bg-light text-muted'}`} onClick={() => setActiveTab('ledger')}>Tax & Financial Ledger</button>
          </li>
        </ul>

        {/* TAB CONTENT: MONITOR */}
        {activeTab === 'monitor' && (
          <>

      {aqiError && (
        <div className="alert alert-danger fw-bold shadow-sm d-flex align-items-center">
          <span className="me-3 fs-3">🛑</span>
          <div>{aqiError}</div>
        </div>
      )}

      {bypassDetected && (
        <div className="alert alert-danger shadow-lg border-danger border-2 d-flex align-items-start">
          <span className="me-3 fs-1">🚨</span>
          <div>
            <h5 className="fw-bold text-danger mb-1">ENFORCEMENT ACTION: Gas Cleaning Plant Bypass Detected</h5>
            <p className="mb-1">Your reported stack temperature or flow rate is abnormally low while claiming active purification. This indicates a potential filter bypass.</p>
            <p className="mb-0 fw-bold small text-dark"><span className="text-danger">▶ Automated SMS & Email Alerts</span> have been dispatched to {stateAuth.chairman}, Chairman, {stateAuth.board} for immediate inspection.</p>
          </div>
        </div>
      )}

      {isAlertLevel && !bypassDetected && (
        <div className="alert alert-danger fw-bold shadow-sm d-flex align-items-start">
          <span className="me-3 fs-2">⚠️</span>
          <div>
            <p className="mb-1">OFFICIAL ALERT: Your plant's Air Quality Index ({latestAQI}) is "{aqiInfo.label}". Sustained levels above 200 will result in closure notices.</p>
            <p className="mb-0 fw-bold small text-dark"><span className="text-danger">▶ Automated SMS & Email Alerts</span> have been dispatched to {stateAuth.board} compliance officers.</p>
          </div>
        </div>
      )}

      {undeclaredAlerts.length > 0 && (
        <div className="alert alert-warning fw-bold shadow-sm d-flex align-items-center">
          <span className="me-3 fs-3">🔍</span>
          <div>
            SENSOR DISCREPANCY: Sensors reporting emissions for undeclared chemicals: {undeclaredAlerts.join(', ')}. 
            Please fix the leak or update your profile.
          </div>
        </div>
      )}

      {latestTax === 0 && hasPurifier && !bypassDetected && (
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
            <h4 className="gov-card-title text-primary border-bottom pb-2">CEMS Data Link (Manual Overide)</h4>
            <form onSubmit={handleSubmit}>
              <div className="alert alert-info py-2 small mb-3">
                <strong>Statutory Rule:</strong> AQI Calculation requires a minimum of 3 pollutants, and one MUST be PM2.5 or PM10.
              </div>
              
              <div className="row">
                {Object.keys(chemicals).map(chem => (
                  <div className="col-md-4 mb-3" key={chem}>
                    <label className="form-label fw-bold" style={{fontSize: '0.85rem'}}>
                      {chem} 
                      {currentUser.declaredChemicals && !currentUser.declaredChemicals.includes(chem) && <span className="badge bg-danger ms-1" style={{fontSize: '0.5rem'}}>Undeclared</span>}
                    </label>
                    <input type="number" className="form-control form-control-sm" name={chem} value={chemicals[chem]} onChange={handleChemicalChange} min="0" placeholder="0" />
                  </div>
                ))}
              </div>

              <h6 className="mt-2 border-bottom pb-2 text-secondary">Process Control Parameters</h6>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold small">Stack Temp (°C)</label>
                  <input type="number" className="form-control" value={temperature} onChange={e => setTemperature(e.target.value)} min="0" placeholder="e.g. 150" required />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold small">Gas Flow Rate (m³/hr)</label>
                  <input type="number" className="form-control" value={flowRate} onChange={e => setFlowRate(e.target.value)} min="0" placeholder="e.g. 1000" required />
                </div>
              </div>

              <div className="form-check mb-4 mt-2 p-3 bg-light border rounded">
                <input className="form-check-input ms-1" type="checkbox" id="purifierCheck" checked={hasPurifier} onChange={e => setHasPurifier(e.target.checked)} />
                <label className="form-check-label fw-bold ms-2" htmlFor="purifierCheck">
                  Gas Cleaning Plant / Purifier Active?
                </label>
                <div className="form-text small ms-2">Warning: Falsely claiming active status while temperatures are dropped will trigger a Bypass Violation Alert.</div>
              </div>

              <button type="submit" className="btn btn-gov-primary w-100 py-2">Submit Analysis & Calculate</button>
            </form>
          </div>
        </div>

        {/* Results / Status */}
        <div className="col-lg-6 mb-4">
          <div className="gov-card p-4 h-100 d-flex flex-column">
            <h4 className="gov-card-title text-primary border-bottom pb-2">Analysis Results & Measures</h4>
            
            {latestAQI === null ? (
              <div className="text-center text-muted mt-5 flex-grow-1 d-flex flex-column justify-content-center">
                <p>Submit your emission data to view AQI, Enforcement Alerts, Tax calculations, and AI Mitigation Suggestions.</p>
              </div>
            ) : (
              <div className="d-flex flex-column flex-grow-1">
                <div className="row">
                  <div className="col-6">
                    <div className="dashboard-stat-card mb-3" style={{ borderLeftColor: aqiInfo.color, padding: '15px' }}>
                      <p className="text-muted mb-0 fw-bold small">Current AQI (Max Sub-Index)</p>
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
                            <th>Bypass Violation</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[...currentUser.submissions].reverse().slice(0, 3).map((sub, idx) => (
                            <tr key={idx}>
                              <td>{new Date(sub.date).toLocaleDateString('en-IN')}</td>
                              <td>{sub.aqi}</td>
                              <td>{sub.tax}</td>
                              <td>{sub.bypassDetected ? <span className="text-danger fw-bold">YES</span> : 'No'}</td>
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
          </>
        )}

        {/* TAB CONTENT: ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="gov-card p-4 shadow-sm border-top-0 rounded-bottom">
            <h4 className="text-primary mb-4 border-bottom pb-2">Historical Emission Trends (30 Days)</h4>
            {currentUser.submissions && currentUser.submissions.length > 0 ? (
              <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                  <LineChart data={currentUser.submissions.map(sub => ({
                      date: new Date(sub.date).toLocaleDateString('en-IN'),
                      AQI: sub.aqi,
                      PM25: sub.chemicals.PM25 || 0,
                      SO2: sub.chemicals.SO2 || 0,
                      CO2: sub.chemicals.CO2 || 0
                    }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip contentStyle={{ borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                    <Legend />
                    <Line type="monotone" dataKey="AQI" stroke="#dc3545" strokeWidth={3} activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="PM25" stroke="#8884d8" />
                    <Line type="monotone" dataKey="SO2" stroke="#82ca9d" />
                    <Line type="monotone" dataKey="CO2" stroke="#ffc658" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
               <div className="text-center py-5">
                 <h1 className="text-muted opacity-25" style={{fontSize: '4rem'}}>📊</h1>
                 <p className="text-muted mt-3">No historical data available yet. Please submit data to generate analytics.</p>
               </div>
            )}
          </div>
        )}

        {/* TAB CONTENT: LEDGER */}
        {activeTab === 'ledger' && (
          <div className="gov-card p-4 shadow-sm border-top-0 rounded-bottom">
            <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
              <h4 className="text-primary mb-0">Environmental Tax Ledger</h4>
              <div className="text-end">
                <h6 className="text-muted mb-1">Total Outstanding Dues</h6>
                <h3 className="text-danger mb-0">₹ {currentUser.submissions?.reduce((sum, sub) => sum + sub.tax, 0).toLocaleString('en-IN') || 0}</h3>
              </div>
            </div>
            
            {currentUser.submissions && currentUser.submissions.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover table-striped align-middle border">
                  <thead className="table-dark">
                    <tr>
                      <th>Date of Submission</th>
                      <th>Recorded AQI</th>
                      <th>Violation Flags</th>
                      <th className="text-end">Tax Assessed (₹)</th>
                      <th className="text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...currentUser.submissions].reverse().map((sub, idx) => (
                      <tr key={idx}>
                        <td className="fw-bold">{new Date(sub.date).toLocaleString('en-IN')}</td>
                        <td><span className="badge bg-secondary fs-6">{sub.aqi}</span></td>
                        <td>
                          {sub.bypassDetected && <span className="badge bg-danger me-1">Bypass</span>}
                          {sub.discrepancies?.length > 0 && <span className="badge bg-warning text-dark">Undeclared Gas</span>}
                          {!sub.bypassDetected && (!sub.discrepancies || sub.discrepancies.length === 0) && <span className="text-muted small">None</span>}
                        </td>
                        <td className="text-end fw-bold">{sub.tax > 0 ? sub.tax.toLocaleString('en-IN') : '0'}</td>
                        <td className="text-center">
                          {sub.tax > 0 ? <span className="badge bg-danger">Unpaid</span> : <span className="badge bg-success">Cleared</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="text-end mt-4">
                  <button className="btn btn-success fw-bold px-4 py-2 shadow-sm">Proceed to Government Payment Gateway</button>
                </div>
              </div>
            ) : (
              <div className="text-center py-5">
                <h1 className="text-muted opacity-25" style={{fontSize: '4rem'}}>🧾</h1>
                <p className="text-muted mt-3">No tax records found.</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default CompanyDashboard;
