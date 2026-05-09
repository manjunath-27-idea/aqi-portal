import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Home = () => {
  const { currentUser, authorities } = useContext(AppContext);
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName) => {
    if (currentUser) {
      navigate('/dashboard');
    } else {
      alert(`Please register or login first to access the compliance portal for ${categoryName}.`);
      const regBox = document.getElementById('registration-portal');
      if (regBox) {
        regBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        regBox.classList.add('border-danger', 'border-3');
        regBox.style.transition = 'all 0.3s';
        regBox.style.boxShadow = '0 0 20px rgba(220, 53, 69, 0.6)';
        setTimeout(() => {
          regBox.classList.remove('border-danger', 'border-3');
          regBox.style.boxShadow = '';
        }, 1500);
      }
    }
  };

  return (
    <div className="container mt-4 mb-5">
      
      {/* Top Authorities Section */}
      <div className="row mb-4">
        <div className="col-12 text-center">
          <div className="p-3 bg-light border rounded shadow-sm">
            <h5 className="mb-3 text-secondary border-bottom pb-2 d-inline-block">Governing Authorities</h5>
            
            <div className="row">
              {/* Central Government */}
              <div className="col-md-7 border-end mb-3 mb-md-0">
                <h6 className="text-primary mb-2 text-uppercase fw-bold" style={{letterSpacing: '1px', fontSize: '0.75rem'}}>Government of India</h6>
                <div className="d-flex justify-content-center gap-3 flex-wrap">
                  {authorities?.central?.map(auth => (
                    <div className="text-center" key={auth.id} style={{width: '140px'}}>
                      <img src={auth.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(auth.name)}&background=${auth.bg}&color=fff&rounded=true&size=60&font-size=0.33`} alt={auth.name} className="mb-1 shadow-sm border border-2 border-white" style={{width: '60px', height: '60px', objectFit: 'cover', borderRadius: '50%'}} />
                      <div className="fw-bold text-dark" style={{fontSize: '0.85rem', lineHeight: '1.2'}}>{auth.name}</div>
                      <div className="small text-muted" style={{fontSize: '0.7rem', lineHeight: '1.2'}}>{auth.role}</div>
                      <div className="small text-muted" style={{fontSize: '0.65rem', lineHeight: '1.2'}}>{auth.department}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* State Government */}
              <div className="col-md-5">
                <h6 className="text-success mb-2 text-uppercase fw-bold" style={{letterSpacing: '1px', fontSize: '0.75rem'}}>Government of Telangana</h6>
                <div className="d-flex justify-content-center gap-3 flex-wrap">
                  {authorities?.state?.map(auth => (
                    <div className="text-center" key={auth.id} style={{width: '140px'}}>
                      <img src={auth.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(auth.name)}&background=${auth.bg}&color=fff&rounded=true&size=60&font-size=0.33`} alt={auth.name} className="mb-1 shadow-sm border border-2 border-white" style={{width: '60px', height: '60px', objectFit: 'cover', borderRadius: '50%'}} />
                      <div className="fw-bold text-dark" style={{fontSize: '0.85rem', lineHeight: '1.2'}}>{auth.name}</div>
                      <div className="small text-muted" style={{fontSize: '0.7rem', lineHeight: '1.2'}}>{auth.role}</div>
                      <div className="small text-muted" style={{fontSize: '0.65rem', lineHeight: '1.2'}}>{auth.department}</div>
                    </div>
                  ))}
                </div>
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

            <h4 className="mt-5 mb-3 border-bottom pb-2 text-danger">Mandatory OCEMS Regulated Sectors</h4>
            <p className="small text-muted mb-3">
              As per the Central Pollution Control Board (CPCB), the following <strong>17 Highly Polluting Industries</strong> and allied Red-Category sectors are legally mandated to install Online Continuous Emission Monitoring Systems (OCEMS) and transmit real-time data to this portal:
            </p>
            <div className="row g-3 mb-5">
              {[
                { name: "Aluminum Smelter", icon: "bi-box-seam-fill", color: "text-secondary", bg: "#f8f9fa" },
                { name: "Cement", icon: "bi-bricks", color: "text-secondary", bg: "#e9ecef" },
                { name: "Chlor-Alkali", icon: "bi-droplet-fill", color: "text-info", bg: "#cff4fc" },
                { name: "Copper Smelter", icon: "bi-box-fill", color: "text-warning", bg: "#fff3cd" },
                { name: "Distilleries", icon: "bi-cup-straw", color: "text-danger", bg: "#f8d7da" },
                { name: "Dyes & Intermediates", icon: "bi-palette-fill", color: "text-primary", bg: "#cfe2ff" },
                { name: "Fertilizer", icon: "bi-tree-fill", color: "text-success", bg: "#d1e7dd" },
                { name: "Iron & Steel", icon: "bi-nut-fill", color: "text-dark", bg: "#e2e3e5" },
                { name: "Lead Smelter", icon: "bi-battery-half", color: "text-secondary", bg: "#f8f9fa" },
                { name: "Oil Refinery", icon: "bi-fuel-pump-fill", color: "text-dark", bg: "#e2e3e5" },
                { name: "Pesticides", icon: "bi-bug-fill", color: "text-danger", bg: "#f8d7da" },
                { name: "Petrochemicals", icon: "bi-funnel-fill", color: "text-primary", bg: "#cfe2ff" },
                { name: "Pulp & Paper", icon: "bi-journal-text", color: "text-info", bg: "#cff4fc" },
                { name: "Pharmaceuticals", icon: "bi-capsule", color: "text-primary", bg: "#cfe2ff" },
                { name: "Sugar", icon: "bi-cup-hot-fill", color: "text-warning", bg: "#fff3cd" },
                { name: "Tanneries", icon: "bi-bag-fill", color: "text-danger", bg: "#f8d7da" },
                { name: "Thermal Power Plants", icon: "bi-lightning-charge-fill", color: "text-warning", bg: "#fff3cd" },
                { name: "Glass Manufacturing", icon: "bi-window", color: "text-info", bg: "#cff4fc" },
                { name: "Rubber & Pyrolysis", icon: "bi-record-circle-fill", color: "text-dark", bg: "#e2e3e5" },
                { name: "Waste & E-Recycling", icon: "bi-pc-display", color: "text-primary", bg: "#cfe2ff" },
                { name: "Gas Refilling Stations", icon: "bi-ev-station-fill", color: "text-danger", bg: "#f8d7da" }
              ].map((category, index) => (
                <div className="col-lg-4 col-md-6" key={index}>
                  <div className="p-3 border rounded shadow-sm" 
                       onClick={() => handleCategoryClick(category.name)}
                       style={{ backgroundColor: category.bg, minHeight: '90px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', borderColor: '#e0e0e0', color: '#333', transition: 'transform 0.2s, box-shadow 0.2s, filter 0.2s', cursor: 'pointer' }}
                       onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.filter = 'brightness(0.95)'; e.currentTarget.classList.add('shadow'); }} 
                       onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.filter = 'brightness(1)'; e.currentTarget.classList.remove('shadow'); }}
                  >
                    <div style={{ width: '60px', textAlign: 'center' }}>
                      <i className={`bi ${category.icon} ${category.color}`} style={{fontSize: '2.5rem', opacity: '0.9'}}></i>
                    </div>
                    <div className="ms-3 text-start">
                      <span style={{ fontSize: '1rem', fontWeight: 'bold', lineHeight: '1.2' }}>{category.name}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
        
        <div className="col-md-4">
          <div id="registration-portal" className="gov-card p-4 text-center sticky-top border" style={{top: '20px'}}>
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
