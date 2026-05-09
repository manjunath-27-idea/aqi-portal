import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { getAQICategory } from '../utils/calculations';

const AdminDashboard = () => {
  const { companies } = useContext(AppContext);
  const [selectedCompany, setSelectedCompany] = useState(null);

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
  let companiesWithPurifier = 0;
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
      
      if (latestSub.hasPurifier) companiesWithPurifier++;
      if (latestSub.aqi > 200) alertCount++;
      
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
      <h2 className="mb-4">National Industry Overview (Public Data)</h2>
      <p className="text-muted mb-4">All data displayed below is public record according to the Environmental Protection Act. Active alerts and Regional Danger Zones are tracked automatically via CEMS logic.</p>

      {/* Global Stats */}
      <div className="row mb-5">
        <div className="col-md-3">
          <div className="dashboard-stat-card border-left-primary h-100">
            <p className="text-muted mb-1 fw-bold">Registered Industries</p>
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
            <p className="text-muted mb-1 fw-bold">Active Severe Alerts</p>
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
      <div className="gov-card p-4">
        <h4 className="gov-card-title">Registered Companies Registry</h4>
        <p className="small text-muted">Click on any company row to view detailed submission history and chemical breakdowns.</p>
        {companies.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-hover table-striped border align-middle" style={{fontSize: '0.9rem', cursor: 'pointer'}}>
              <thead className="table-dark">
                <tr>
                  <th>Reg. No</th>
                  <th>Company Name & Zone</th>
                  <th>Declared Chem</th>
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

                  return (
                    <tr key={company.id} className={isAlert ? "table-danger" : ""} onClick={() => setSelectedCompany(company)}>
                      <td>{company.regNumber}</td>
                      <td>
                        <span className="fw-bold d-block">{company.companyName}</span>
                        <small className="text-muted">{company.region} Zone | {company.stateLocation} | {company.companyCategory}</small>
                      </td>
                      <td>
                        {company.declaredChemicals ? (
                          <span className="text-muted" style={{fontSize: '0.75rem'}}>{company.declaredChemicals.join(', ')}</span>
                        ) : 'N/A'}
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
                            {isAlert ? <span className="badge bg-danger">NON-COMPLIANT</span> : <span className="badge bg-success">Compliant</span>}
                            {hasDiscrepancy && <span className="badge bg-warning text-dark">Undeclared Gas Detected</span>}
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

      {/* Company Detail Modal */}
      {selectedCompany && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header bg-navy text-white" style={{backgroundColor: 'var(--gov-navy)'}}>
                  <h5 className="modal-title text-white">{selectedCompany.companyName} - Detailed Profile</h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedCompany(null)} aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <p className="mb-1"><strong>Registration No:</strong> {selectedCompany.regNumber}</p>
                      <p className="mb-1"><strong>Industry Type:</strong> {selectedCompany.industryType} ({selectedCompany.companyCategory})</p>
                      <p className="mb-1"><strong>Location:</strong> {selectedCompany.stateLocation}, {selectedCompany.region} Zone</p>
                    </div>
                    <div className="col-md-6">
                      <p className="mb-1"><strong>Contact:</strong> <a href={`mailto:${selectedCompany.contactEmail}`}>{selectedCompany.contactEmail}</a></p>
                      <p className="mb-1"><strong>Declared Chemicals:</strong> {selectedCompany.declaredChemicals?.join(', ') || 'None'}</p>
                    </div>
                  </div>

                  <h6 className="border-bottom pb-2 text-primary">Historical Emission Submissions</h6>
                  {selectedCompany.submissions && selectedCompany.submissions.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-sm table-bordered">
                        <thead className="bg-light">
                          <tr>
                            <th>Date</th>
                            <th>PM2.5</th>
                            <th>PM10</th>
                            <th>SO2</th>
                            <th>NO2</th>
                            <th>CO2</th>
                            <th>AQI</th>
                            <th>Tax Paid</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[...selectedCompany.submissions].reverse().map((sub, idx) => (
                            <tr key={idx} className={sub.aqi > 200 ? 'table-danger' : ''}>
                              <td className="small">{new Date(sub.date).toLocaleDateString()}</td>
                              <td>{sub.chemicals.PM25}</td>
                              <td>{sub.chemicals.PM10}</td>
                              <td className={sub.discrepancies?.includes('SO2') ? 'text-danger fw-bold' : ''}>{sub.chemicals.SO2}</td>
                              <td className={sub.discrepancies?.includes('NO2') ? 'text-danger fw-bold' : ''}>{sub.chemicals.NO2}</td>
                              <td className={sub.discrepancies?.includes('CO2') ? 'text-danger fw-bold' : ''}>{sub.chemicals.CO2}</td>
                              <td className="fw-bold">{sub.aqi}</td>
                              <td>₹ {sub.tax.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <small className="text-muted d-block mt-2">* Red values indicate undeclared chemical detection. Highlighted rows indicate severe AQI (&gt;200).</small>
                    </div>
                  ) : (
                    <p className="text-muted">No emission data submitted yet.</p>
                  )}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setSelectedCompany(null)}>Close</button>
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
