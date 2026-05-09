import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", 
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", 
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi"
];

const Register = () => {
  const { registerCompany, loginCompany } = useContext(AppContext);
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  
  // Registration State
  const [companyName, setCompanyName] = useState('');
  const [industryType, setIndustryType] = useState('Manufacturing');
  const [companyCategory, setCompanyCategory] = useState('Medium');
  const [region, setRegion] = useState('North');
  const [contactEmail, setContactEmail] = useState('');
  const [stateLocation, setStateLocation] = useState('Delhi');
  const [regNumber, setRegNumber] = useState('');
  
  // Declared Chemicals
  const [declaredChemicals, setDeclaredChemicals] = useState({
    PM25: false,
    PM10: false,
    SO2: false,
    NO2: false,
    CO2: false
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [loginRegNumber, setLoginRegNumber] = useState('');
  const [error, setError] = useState('');

  const handleChemicalToggle = (chem) => {
    setDeclaredChemicals(prev => ({ ...prev, [chem]: !prev[chem] }));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!companyName || !regNumber || !stateLocation || !contactEmail) {
      setError('Please fill all mandatory fields.');
      return;
    }

    const activeChemicals = Object.keys(declaredChemicals).filter(k => declaredChemicals[k]);
    if (activeChemicals.length === 0) {
      setError('You must declare at least one expected chemical emission type.');
      return;
    }

    registerCompany({ 
      companyName, 
      industryType, 
      companyCategory,
      region,
      contactEmail,
      stateLocation, 
      regNumber,
      declaredChemicals: activeChemicals
    });
    setSuccessMessage('Registration Successful! Please login using your Registration Number.');
    setIsLogin(true);
    setError('');
    // Clear fields
    setCompanyName(''); setRegNumber(''); setContactEmail('');
    setDeclaredChemicals({PM25: false, PM10: false, SO2: false, NO2: false, CO2: false});
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const success = loginCompany(loginRegNumber);
    if (success) {
      navigate('/dashboard'); 
    } else {
      setError('Invalid Registration Number. Please try again or register.');
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="gov-card p-4">
            <h3 className="gov-card-title text-center mb-4">
              {isLogin ? 'Industry Login' : 'Industry Registration & Chemical Declaration'}
            </h3>
            
            {error && <div className="alert alert-danger py-2">{error}</div>}
            {successMessage && <div className="alert alert-success py-2">{successMessage}</div>}

            {isLogin ? (
              <form onSubmit={handleLogin} className="col-md-8 mx-auto">
                <div className="mb-3">
                  <label className="form-label fw-bold">Registration Number <span className="text-danger">*</span></label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={loginRegNumber}
                    onChange={(e) => setLoginRegNumber(e.target.value)}
                    placeholder="Enter valid Govt. Reg. No."
                  />
                </div>
                <button type="submit" className="btn btn-gov-primary w-100 py-2 mt-3">Login to Portal</button>
                <div className="text-center mt-3">
                  <span className="text-muted">Not registered? </span>
                  <button type="button" className="btn btn-link p-0 text-decoration-none" onClick={() => {setIsLogin(false); setError(''); setSuccessMessage('');}}>Register Here</button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegister}>
                <div className="mb-3">
                  <label className="form-label fw-bold">Company Name <span className="text-danger">*</span></label>
                  <input type="text" className="form-control" value={companyName} onChange={e => setCompanyName(e.target.value)} />
                </div>
                
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-bold">Industry Type</label>
                    <select className="form-select" value={industryType} onChange={e => setIndustryType(e.target.value)}>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Chemical">Chemical Processing</option>
                      <option value="Mining">Mining</option>
                      <option value="Power Plant">Power Plant</option>
                      <option value="Textile">Textile</option>
                    </select>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-bold">Company Category</label>
                    <select className="form-select" value={companyCategory} onChange={e => setCompanyCategory(e.target.value)}>
                      <option value="Heavy">Heavy Scale</option>
                      <option value="Medium">Medium Scale</option>
                      <option value="Small">Small Scale / MSME</option>
                    </select>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-bold">Region Zone</label>
                    <select className="form-select" value={region} onChange={e => setRegion(e.target.value)}>
                      <option value="North">North Zone</option>
                      <option value="South">South Zone</option>
                      <option value="East">East Zone</option>
                      <option value="West">West Zone</option>
                      <option value="Central">Central Zone</option>
                    </select>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Official Email <span className="text-danger">*</span></label>
                    <input type="email" className="form-control" value={contactEmail} onChange={e => setContactEmail(e.target.value)} placeholder="For official alerts" />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Plant Location (State) <span className="text-danger">*</span></label>
                    <select className="form-select" value={stateLocation} onChange={e => setStateLocation(e.target.value)}>
                      {indianStates.map(st => <option key={st} value={st}>{st}</option>)}
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold">Declared Expected Emissions <span className="text-danger">*</span></label>
                  <div className="form-text mb-2 text-warning fw-bold">Select all chemicals your plant is expected to release. Emitting undeclared chemicals will trigger sensor discrepancy alerts.</div>
                  <div className="d-flex flex-wrap gap-3">
                    {Object.keys(declaredChemicals).map(chem => (
                      <div className="form-check" key={chem}>
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          id={`check-${chem}`}
                          checked={declaredChemicals[chem]}
                          onChange={() => handleChemicalToggle(chem)}
                        />
                        <label className="form-check-label" htmlFor={`check-${chem}`}>
                          {chem}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold">Government Registration Number <span className="text-danger">*</span></label>
                  <input type="text" className="form-control" value={regNumber} onChange={e => setRegNumber(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-gov-primary w-100 py-2">Submit Registration & Declaration</button>
                <div className="text-center mt-3">
                  <span className="text-muted">Already registered? </span>
                  <button type="button" className="btn btn-link p-0 text-decoration-none" onClick={() => {setIsLogin(true); setError(''); setSuccessMessage('');}}>Login Here</button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
