import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { getAQICategory } from '../utils/calculations';

const AdminDashboard = () => {
  const { companies, authorities, updateAuthority } = useContext(AppContext);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [editingAuth, setEditingAuth] = useState(null);

  const handleSaveAuthority = (e) => {
    e.preventDefault();
    updateAuthority(editingAuth.type, editingAuth.id, {
      name: editingAuth.name,
      role: editingAuth.role,
      department: editingAuth.department,
      imageUrl: editingAuth.imageUrl || ''
    });
    setEditingAuth(null);
  };

  // Geographic / Regional Analysis
  const regions = ['North', 'South', 'East', 'West', 'Central'];
  const regionalData = {};
  
  regions.forEach(r => {
    regionalData[r] = {
      companies: 0,
      totalAQI: 0,
      reportingCompanies: 0,
      worstCompany: null,
      worstAQI: -1
    };
  });

  // Global Aggregate stats
  const totalCompanies = companies.length;
  let totalTaxCollected = 0;
  let sumLatestAQI = 0;
  let companiesWithData = 0;
  let alertCount = 0;

  companies.forEach(company => {
    const region = company.region || 'North'; // Fallback
    regionalData[region].companies++;

    if (company.submissions && company.submissions.length > 0) {
      const latestSub = company.submissions[company.submissions.length - 1];
      totalTaxCollected += latestSub.tax;
      sumLatestAQI += latestSub.aqi;
      
      // Alerts include severe AQI and bypass violations
      if (latestSub.aqi > 200 || latestSub.bypassDetected) alertCount++;
      
      companiesWithData++;
      regionalData[region].reportingCompanies++;
      regionalData[region].totalAQI += latestSub.aqi;

      if (latestSub.aqi > regionalData[region].worstAQI) {
        regionalData[region].worstAQI = latestSub.aqi;
        regionalData[region].worstCompany = company.companyName;
      }
    }
  });

  const avgAQI = companiesWithData > 0 ? Math.round(sumLatestAQI / companiesWithData) : 0;
  const avgAQIInfo = getAQICategory(avgAQI);

  return (
    <div className="container mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-end mb-4 border-bottom pb-3">
        <div>
          <h2 className="mb-2">National Industry Overview (Public CEMS)</h2>
          <p className="text-muted mb-0">Real-time Continuous Emission Monitoring System data for public transparency.</p>
        </div>
        <button className="btn btn-outline-primary shadow-sm" onClick={() => setShowAuthModal(true)}>
          <i className="bi bi-person-gear me-2"></i>Manage Authorities
        </button>
      </div>

      {/* Global Stats */}
      <div className="row mb-5">
        <div className="col-md-3">
          <div className="dashboard-stat-card border-left-primary h-100">
            <p className="text-muted mb-1 fw-bold">Registered CEMS Stacks</p>
            <h3>{totalCompanies}</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="dashboard-stat-card border-left-success h-100" style={{ borderLeftColor: avgAQIInfo.color }}>
            <p className="text-muted mb-1 fw-bold">National Avg AQI</p>
            <h3 style={{ color: avgAQIInfo.color }}>{avgAQI} <span className="fs-6 badge rounded-pill" style={{ backgroundColor: avgAQIInfo.color }}>{avgAQIInfo.label}</span></h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="dashboard-stat-card border-left-danger h-100" style={{ borderLeftColor: alertCount > 0 ? '#dc3545' : '#28a745' }}>
            <p className="text-muted mb-1 fw-bold">Active Enforcement Alerts</p>
            <h3 className={alertCount > 0 ? "text-danger" : "text-success"}>{alertCount}</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="dashboard-stat-card border-left-warning h-100" style={{ borderLeftColor: '#ffc107' }}>
            <p className="text-muted mb-1 fw-bold">Total Daily Tax (₹)</p>
            <h3 className="text-dark">{totalTaxCollected.toLocaleString('en-IN')}</h3>
          </div>
        </div>
      </div>

      {/* Geographic Danger Zones */}
      <div className="gov-card p-4 mb-5 bg-light">
        <h4 className="gov-card-title text-danger border-bottom-danger">Geographic Regional Danger Zones</h4>
        <div className="row mt-3">
          {regions.map(region => {
            const data = regionalData[region];
            const avgRegAQI = data.reportingCompanies > 0 ? Math.round(data.totalAQI / data.reportingCompanies) : 0;
            const regAqiInfo = getAQICategory(avgRegAQI);
            const isDanger = avgRegAQI > 200;

            return (
              <div className="col-md" key={region}>
                <div className={`card h-100 border-${isDanger ? 'danger' : 'success'} shadow-sm`}>
                  <div className={`card-header text-center fw-bold text-white bg-${isDanger ? 'danger' : 'success'}`}>
                    {region} Zone
                  </div>
                  <div className="card-body text-center p-2">
                    <p className="small text-muted mb-1">Avg AQI</p>
                    <h4 style={{color: regAqiInfo.color}} className="mb-0">{avgRegAQI > 0 ? avgRegAQI : 'N/A'}</h4>
                    <span className="badge mt-1 mb-2" style={{backgroundColor: regAqiInfo.color}}>{avgRegAQI > 0 ? regAqiInfo.label : 'No Data'}</span>
                    
                    {isDanger && data.worstCompany && (
                      <div className="mt-2 pt-2 border-top">
                        <small className="text-danger fw-bold d-block">Top Polluter:</small>
                        <small className="d-block text-truncate" title={data.worstCompany}>{data.worstCompany}</small>
                        <small className="text-muted">({data.worstAQI} AQI)</small>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Companies Registry */}
      <div className="gov-card p-4 mb-5">
        <h4 className="gov-card-title">Registered CEMS Connections Registry</h4>
        <p className="small text-muted">Click on any company row to view detailed submission history, GPS coordinates, and chemical breakdowns.</p>
        {companies.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-hover table-striped border align-middle" style={{fontSize: '0.9rem', cursor: 'pointer'}}>
              <thead className="table-dark">
                <tr>
                  <th>Reg. No</th>
                  <th>Company & Location</th>
                  <th>Industry Category</th>
                  <th>Latest AQI</th>
                  <th>Latest Tax (₹)</th>
                  <th>Status / Alerts</th>
                </tr>
              </thead>
              <tbody>
                {companies.map(company => {
                  const hasSubmissions = company.submissions && company.submissions.length > 0;
                  const latestSub = hasSubmissions ? company.submissions[company.submissions.length - 1] : null;
                  const aqiInfo = latestSub ? getAQICategory(latestSub.aqi) : null;
                  const isAlert = latestSub && latestSub.aqi > 200;
                  const hasDiscrepancy = latestSub && latestSub.discrepancies && latestSub.discrepancies.length > 0;
                  const hasBypass = latestSub && latestSub.bypassDetected;

                  return (
                    <tr key={company.id} className={isAlert || hasBypass ? "table-danger" : ""} onClick={() => setSelectedCompany(company)}>
                      <td className="fw-bold">{company.regNumber}</td>
                      <td>
                        <span className="fw-bold d-block text-primary">{company.companyName}</span>
                        <small className="text-muted">{company.region} Zone | {company.stateLocation}</small>
                      </td>
                      <td>
                        <span className="d-block">{company.industryType}</span>
                        <small className="text-muted">{company.companyCategory} Scale</small>
                      </td>
                      <td>
                        {latestSub ? (
                          <span style={{ color: aqiInfo.color, fontWeight: 'bold' }}>{latestSub.aqi} ({aqiInfo.label})</span>
                        ) : 'N/A'}
                      </td>
                      <td>{latestSub ? latestSub.tax.toLocaleString('en-IN') : '0'}</td>
                      <td>
                        {!hasSubmissions ? (
                          <span className="badge bg-secondary text-light">Data Pending</span>
                        ) : (
                          <div className="d-flex flex-column gap-1 align-items-start">
                            {hasBypass && <span className="badge bg-danger">FILTER BYPASS VIOLATION</span>}
                            {isAlert && !hasBypass && <span className="badge bg-danger">SEVERE AQI ALERT</span>}
                            {!isAlert && !hasBypass && <span className="badge bg-success">Compliant</span>}
                            {hasDiscrepancy && <span className="badge bg-warning text-dark">Undeclared Gas</span>}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-4 text-muted">
            <p>No industries have registered yet.</p>
          </div>
        )}
      </div>

      {/* Statutory Limitations Disclaimer */}
      <div className="alert alert-secondary border-secondary shadow-sm">
        <h6 className="fw-bold text-dark">Limitations of Data Dissemination</h6>
        <p className="mb-0 small text-muted">
          1. For real time AQI, the data is fed directly from the analysers without scrutiny, thus it may not be for statutory purpose.<br/>
          2. The monitoring and subsequent AQI dissemination involves multiple steps including operation of sensors and analysers, their calibration, data acquisition at local server, transmission to central database using Internet, etc. The functioning of monitoring stations may also get affected due to various technical and operational aspects like long power cuts and maintenance problems. In view of these limitations, it is possible that there may be some disruption in continuous data flow and dissemination. However, in case of breakdowns, necessary actions are initiated immediately for putting the system back into operation within reasonable time period.
        </p>
      </div>

      {/* Company Detail Modal */}
      {selectedCompany && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-xl modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header bg-navy text-white" style={{backgroundColor: 'var(--gov-navy)'}}>
                  <h5 className="modal-title text-white">{selectedCompany.companyName} - Detailed Profile</h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedCompany(null)} aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <div className="row mb-4 bg-light p-3 rounded">
                    <div className="col-md-4">
                      <p className="mb-1"><strong>Registration No:</strong> {selectedCompany.regNumber}</p>
                      <p className="mb-1"><strong>Industry Category:</strong> {selectedCompany.industryType} ({selectedCompany.companyCategory})</p>
                      <p className="mb-1"><strong>Location:</strong> {selectedCompany.stateLocation}, {selectedCompany.region} Zone</p>
                    </div>
                    <div className="col-md-4">
                      <p className="mb-1"><strong>CEMS Station ID:</strong> <span className="text-primary fw-bold">{selectedCompany.stationId || 'N/A'}</span></p>
                      <p className="mb-1"><strong>GPS Coordinates:</strong> {selectedCompany.gpsCoordinates || 'N/A'}</p>
                      <p className="mb-1"><strong>Contact:</strong> <a href={`mailto:${selectedCompany.contactEmail}`}>{selectedCompany.contactEmail}</a></p>
                    </div>
                    <div className="col-md-4">
                      <p className="mb-1"><strong>Declared Expected Emissions:</strong></p>
                      <p className="small text-muted">{selectedCompany.declaredChemicals?.join(', ') || 'None'}</p>
                    </div>
                  </div>

                  <h6 className="border-bottom pb-2 text-primary fw-bold">Historical CEMS Emissions & Process Control</h6>
                  {selectedCompany.submissions && selectedCompany.submissions.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-sm table-bordered text-center align-middle" style={{fontSize: '0.85rem'}}>
                        <thead className="bg-light">
                          <tr>
                            <th>Date</th>
                            <th>Stack Temp (°C)</th>
                            <th>Flow Rate (m³/hr)</th>
                            <th>PM2.5</th>
                            <th>PM10</th>
                            <th>SO2</th>
                            <th>NO2</th>
                            <th>CO2</th>
                            <th>O3</th>
                            <th>NH3</th>
                            <th className="bg-warning">Max AQI</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[...selectedCompany.submissions].reverse().map((sub, idx) => (
                            <tr key={idx} className={sub.aqi > 200 || sub.bypassDetected ? 'table-danger' : ''}>
                              <td className="small text-start">{new Date(sub.date).toLocaleDateString()}</td>
                              <td className={sub.temperature < 80 ? 'text-danger fw-bold' : ''}>{sub.temperature || '-'}</td>
                              <td className={sub.flowRate < 400 ? 'text-danger fw-bold' : ''}>{sub.flowRate || '-'}</td>
                              <td>{sub.chemicals.PM25}</td>
                              <td>{sub.chemicals.PM10}</td>
                              <td className={sub.discrepancies?.includes('SO2') ? 'text-danger fw-bold text-decoration-underline' : ''}>{sub.chemicals.SO2}</td>
                              <td className={sub.discrepancies?.includes('NO2') ? 'text-danger fw-bold text-decoration-underline' : ''}>{sub.chemicals.NO2}</td>
                              <td className={sub.discrepancies?.includes('CO2') ? 'text-danger fw-bold text-decoration-underline' : ''}>{sub.chemicals.CO2}</td>
                              <td className={sub.discrepancies?.includes('O3') ? 'text-danger fw-bold text-decoration-underline' : ''}>{sub.chemicals.O3}</td>
                              <td className={sub.discrepancies?.includes('NH3') ? 'text-danger fw-bold text-decoration-underline' : ''}>{sub.chemicals.NH3}</td>
                              <td className="fw-bold bg-warning bg-opacity-25 fs-6">{sub.aqi}</td>
                              <td>
                                {sub.bypassDetected ? (
                                  <span className="badge bg-danger">Bypass Violation</span>
                                ) : sub.aqi > 200 ? (
                                  <span className="badge bg-danger">Severe</span>
                                ) : (
                                  <span className="badge bg-success">Compliant</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <small className="text-muted d-block mt-2">* Underlined red values indicate undeclared chemical detection. Red Process Control values indicate potential filter bypass.</small>
                    </div>
                  ) : (
                    <p className="text-muted">No emission data submitted yet.</p>
                  )}
                </div>
                <div className="modal-footer bg-light">
                  <button type="button" className="btn btn-secondary" onClick={() => setSelectedCompany(null)}>Close Profile</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Manage Authorities Modal */}
      {showAuthModal && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header bg-primary text-white">
                  <h5 className="modal-title text-white"><i className="bi bi-person-gear me-2"></i>Manage Portal Authorities</h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => { setShowAuthModal(false); setEditingAuth(null); }}></button>
                </div>
                <div className="modal-body">
                  
                  {editingAuth ? (
                    <form onSubmit={handleSaveAuthority} className="p-4 border rounded bg-light shadow-sm">
                      <h6 className="mb-3 border-bottom pb-2 text-primary">Edit Authority Details</h6>
                      <div className="mb-3">
                        <label className="form-label fw-bold">Full Name</label>
                        <input type="text" className="form-control" value={editingAuth.name} onChange={e => setEditingAuth({...editingAuth, name: e.target.value})} required />
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-bold">Role / Title</label>
                        <input type="text" className="form-control" value={editingAuth.role} onChange={e => setEditingAuth({...editingAuth, role: e.target.value})} required />
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-bold">Department / Portfolio</label>
                        <input type="text" className="form-control" value={editingAuth.department} onChange={e => setEditingAuth({...editingAuth, department: e.target.value})} required />
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-bold">Image URL (Optional)</label>
                        <input type="url" className="form-control" placeholder="https://example.com/photo.jpg" value={editingAuth.imageUrl || ''} onChange={e => setEditingAuth({...editingAuth, imageUrl: e.target.value})} />
                        <small className="text-muted">Provide a direct link to an image. Leave blank to use auto-generated initials.</small>
                      </div>
                      <div className="d-flex justify-content-end gap-2 mt-4">
                        <button type="button" className="btn btn-outline-secondary" onClick={() => setEditingAuth(null)}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Save Changes</button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <h6 className="text-primary fw-bold mt-2 text-uppercase" style={{letterSpacing: '1px', fontSize:'0.85rem'}}>Government of India (Central)</h6>
                      <ul className="list-group mb-4 shadow-sm">
                        {authorities.central.map(auth => (
                          <li className="list-group-item d-flex justify-content-between align-items-center" key={auth.id}>
                            <div>
                              <strong className="d-block">{auth.name}</strong>
                              <small className="text-muted">{auth.role} - {auth.department}</small>
                            </div>
                            <button className="btn btn-sm btn-outline-primary" onClick={() => setEditingAuth({...auth, type: 'central'})}>Edit</button>
                          </li>
                        ))}
                      </ul>

                      <h6 className="text-success fw-bold text-uppercase" style={{letterSpacing: '1px', fontSize:'0.85rem'}}>Government of Telangana (State)</h6>
                      <ul className="list-group mb-2 shadow-sm">
                        {authorities.state.map(auth => (
                          <li className="list-group-item d-flex justify-content-between align-items-center" key={auth.id}>
                            <div>
                              <strong className="d-block">{auth.name}</strong>
                              <small className="text-muted">{auth.role} - {auth.department}</small>
                            </div>
                            <button className="btn btn-sm btn-outline-success" onClick={() => setEditingAuth({...auth, type: 'state'})}>Edit</button>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  
                </div>
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
};

export default AdminDashboard;
