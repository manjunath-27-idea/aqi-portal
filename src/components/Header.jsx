import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Header = () => {
  const { currentUser, logout, language, changeLanguage } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const text = {
    EN: {
      home: "Home",
      dashboard: "Company Dashboard",
      register: "Register/Login",
      admin: "Admin View",
      skip: "Skip to Main Content",
      screenReader: "Screen Reader Access",
      title: "National Industry Air Quality Portal",
      subtitle: "Ministry of Environment, Forest and Climate Change, Government of India"
    },
    HI: {
      home: "मुख्य पृष्ठ",
      dashboard: "कंपनी डैशबोर्ड",
      register: "पंजीकरण/लॉगिन",
      admin: "प्रशासन दृश्य",
      skip: "मुख्य सामग्री पर जाएं",
      screenReader: "स्क्रीन रीडर एक्सेस",
      title: "राष्ट्रीय उद्योग वायु गुणवत्ता पोर्टल",
      subtitle: "पर्यावरण, वन और जलवायु परिवर्तन मंत्रालय, भारत सरकार"
    },
    TE: {
      home: "హోమ్",
      dashboard: "కంపెనీ డాష్బోర్డ్",
      register: "నమోదు/లాగిన్",
      admin: "అడ్మిన్ వీక్షణ",
      skip: "ప్రధాన కంటెంట్‌కు దాటవేయి",
      screenReader: "స్క్రీన్ రీడర్ యాక్సెస్",
      title: "జాతీయ పరిశ్రమ వాయు నాణ్యత పోర్టల్",
      subtitle: "పర్యావరణ, అటవీ మరియు వాతావరణ మార్పుల మంత్రిత్వ శాఖ, భారత ప్రభుత్వం"
    }
  };

  const t = text[language] || text.EN;

  return (
    <header className="gov-header">
      <div className="gov-header-top">
        <div className="container d-flex justify-content-between align-items-center">
          <div>
            <a href="#main-content">{t.skip}</a>
            <span className="me-3 ms-3">{t.screenReader}</span>
          </div>
          <div>
            <span className="me-3">A- | A | A+</span>
            <span 
              className={`me-2 ${language === 'EN' ? 'fw-bold' : ''}`} 
              style={{cursor: 'pointer'}} 
              onClick={() => changeLanguage('EN')}
            >English</span> | 
            <span 
              className={`mx-2 ${language === 'HI' ? 'fw-bold' : ''}`} 
              style={{cursor: 'pointer'}} 
              onClick={() => changeLanguage('HI')}
            >हिन्दी</span> | 
            <span 
              className={`ms-2 ${language === 'TE' ? 'fw-bold' : ''}`} 
              style={{cursor: 'pointer'}} 
              onClick={() => changeLanguage('TE')}
            >తెలుగు</span>
          </div>
        </div>
      </div>
      
      <div className="container py-3 d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <div style={{ width: '50px', height: '60px', backgroundColor: '#e9ecef', border: '1px solid #ccc', marginRight: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <small>Emblem</small>
          </div>
          <div>
            <h1 className="portal-title">{t.title}</h1>
            <p className="portal-subtitle">{t.subtitle}</p>
          </div>
        </div>
        <div>
           <div style={{ width: '100px', height: '40px', backgroundColor: '#e9ecef', border: '1px solid #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <small>Logo</small>
          </div>
        </div>
      </div>

      <nav className="navbar navbar-expand-lg gov-navbar bg-light border-top">
        <div className="container">
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#govNavbar">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="govNavbar">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/">{t.home}</Link>
              </li>
              {currentUser ? (
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">{t.dashboard}</Link>
                </li>
              ) : (
                <li className="nav-item">
                  <Link className="nav-link" to="/register">{t.register}</Link>
                </li>
              )}
              <li className="nav-item">
                <Link className="nav-link" to="/admin">{t.admin}</Link>
              </li>
            </ul>
            {currentUser && (
              <div className="d-flex align-items-center">
                <span className="me-3 fw-bold text-dark">Welcome, {currentUser.companyName}</span>
                <button className="btn btn-sm btn-outline-danger" onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
