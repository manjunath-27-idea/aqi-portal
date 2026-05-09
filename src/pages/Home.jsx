import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container mt-4 mb-5">
      
      {/* Top Authorities Section */}
      <div className="row mb-4">
        <div className="col-12 text-center">
          <div className="p-3 bg-light border rounded shadow-sm d-inline-block">
            <h5 className="mb-3 text-secondary border-bottom pb-2">Governing Authorities</h5>
            <div className="d-flex justify-content-center gap-5 flex-wrap">
              <div className="text-center">
                <div className="fw-bold text-dark">Shri Bhupender Yadav</div>
                <div className="small text-muted">Hon'ble Minister</div>
                <div className="small text-muted" style={{fontSize: '0.75rem'}}>Ministry of Environment, Forest and Climate Change</div>
              </div>
              <div className="text-center">
                <div className="fw-bold text-dark">Shri Kirti Vardhan Singh</div>
                <div className="small text-muted">Hon'ble Minister of State</div>
                <div className="small text-muted" style={{fontSize: '0.75rem'}}>Ministry of Environment, Forest and Climate Change</div>
              </div>
              <div className="text-center">
                <div className="fw-bold text-dark">Shri Tanmay Kumar</div>
                <div className="small text-muted">Chairman</div>
                <div className="small text-muted" style={{fontSize: '0.75rem'}}>Central Pollution Control Board (CPCB)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-8">
          <div className="gov-card p-4 mb-4">
            <h2 className="gov-card-title">Welcome to the National Industry AQI & Tax Portal</h2>
            <p>
              Under the mandate of the Ministry of Environment, Forest and Climate Change (MoEFCC) and the Central Pollution Control Board (CPCB), all industrial sectors must register to this central portal for the continuous monitoring of Air Quality Index (AQI) emissions and environmental compliance.
            </p>

            <h4 className="mt-5 mb-3 border-bottom pb-2 text-primary">National Acts & Regulations</h4>
            <ul className="list-group list-group-flush mb-4">
              <li className="list-group-item">
                <strong>The Air (Prevention and Control of Pollution) Act, 1981:</strong> Provides for the prevention, control, and abatement of air pollution, empowering the CPCB to set industrial emission standards.
              </li>
              <li className="list-group-item">
                <strong>The Environment (Protection) Act, 1986:</strong> An umbrella legislation that authorizes the Central Government to protect and improve environmental quality and control pollution from all sources.
              </li>
              <li className="list-group-item">
                <strong>National Clean Air Programme (NCAP):</strong> A national-level strategy to tackle air pollution comprehensively with targets to achieve a 20% to 30% reduction in Particulate Matter concentrations.
              </li>
            </ul>

            <h4 className="mt-4 mb-3 border-bottom pb-2 text-success">International Monitoring Standards</h4>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <strong>WHO Global Air Quality Guidelines (AQGs):</strong> The system evaluates reported chemicals against the rigorous limits suggested by the World Health Organization for PM2.5, PM10, O3, NO2, SO2, and CO.
              </li>
              <li className="list-group-item">
                <strong>Paris Agreement Compliance:</strong> Tracking industrial greenhouse gases (like CO2) ensures national commitments to the UNFCCC are monitored and enforced.
              </li>
              <li className="list-group-item">
                <strong>Continuous Emissions Monitoring Systems (CEMS):</strong> Adopting standards similar to the US EPA and European Environment Agency (EEA), requiring automated, tamper-proof sensor data reporting.
              </li>
            </ul>

            <div className="alert alert-info mt-4 shadow-sm border-info">
              <strong>Notice to Industries:</strong> The platform now integrates automated Sensor Discrepancy Detection. Emitting undeclared toxic chemicals will result in immediate system alerts and subsequent site inspections by CPCB officials.
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="gov-card p-4 text-center sticky-top" style={{top: '20px'}}>
            <h4 className="gov-card-title mb-4">Industry Access Portal</h4>
            <p className="small mb-4 text-muted">Mandatory registration for obtaining Environmental Compliance IDs and daily emission reporting.</p>
            <Link to="/register" className="btn btn-gov-primary w-100 mb-3 py-2 fw-bold shadow-sm">
              Register / Login
            </Link>
            <hr />
            <p className="small mb-4 text-muted">Public portal for transparent national air quality tracking and regional danger zones.</p>
            <Link to="/admin" className="btn btn-outline-secondary w-100 py-2 fw-bold">
              Public Dashboard & Statistics
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
