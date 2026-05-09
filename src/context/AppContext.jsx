import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

const initialSeedData = [
  {
    id: "seed-1",
    companyName: "Tata Steel Facility",
    industryType: "Manufacturing",
    companyCategory: "Heavy",
    region: "East",
    stateLocation: "Jharkhand",
    contactEmail: "compliance@tatasteel.com",
    regNumber: "TATA1001",
    declaredChemicals: ["PM25", "PM10", "CO2"],
    hasAcceptedRules: true,
    submissions: [
      {
        id: "sub-1-1",
        date: new Date(Date.now() - 86400000).toISOString(),
        chemicals: { PM25: 15, PM10: 20, SO2: 0, NO2: 0, CO2: 80 },
        hasPurifier: true,
        aqi: 55, // Good
        tax: 0, // Purifier + Good AQI = 0 Tax
        discrepancies: []
      }
    ]
  },
  {
    id: "seed-2",
    companyName: "Vapi Chemical Works",
    industryType: "Chemical",
    companyCategory: "Heavy",
    region: "West",
    stateLocation: "Gujarat",
    contactEmail: "admin@vapichem.in",
    regNumber: "VAPI9922",
    declaredChemicals: ["CO2", "NO2"],
    hasAcceptedRules: true,
    submissions: [
      {
        id: "sub-2-1",
        date: new Date().toISOString(),
        chemicals: { PM25: 0, PM10: 0, SO2: 80, NO2: 60, CO2: 40 },
        hasPurifier: false,
        aqi: 322, // Severe
        tax: 19600, // 80*150 + 60*120 + 40*10
        discrepancies: ["SO2"] // They didn't declare SO2
      }
    ]
  },
  {
    id: "seed-3",
    companyName: "Delhi North Power",
    industryType: "Power Plant",
    companyCategory: "Medium",
    region: "North",
    stateLocation: "Delhi",
    contactEmail: "reports@delhipower.gov.in",
    regNumber: "DNP4455",
    declaredChemicals: ["PM25", "PM10", "SO2", "NO2", "CO2"],
    hasAcceptedRules: true,
    submissions: [
      {
        id: "sub-3-1",
        date: new Date().toISOString(),
        chemicals: { PM25: 40, PM10: 50, SO2: 20, NO2: 30, CO2: 200 },
        hasPurifier: true,
        aqi: 226, // Poor (Purifier rebate lost because > 100)
        tax: 12400, // No tax discount because AQI is poor despite purifier
        discrepancies: []
      }
    ]
  }
];

export const AppProvider = ({ children }) => {
  const [companies, setCompanies] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [language, setLanguage] = useState('EN'); // EN, HI, TE

  // Load from localStorage on mount
  useEffect(() => {
    const storedCompanies = localStorage.getItem('aqi_companies');
    if (storedCompanies && JSON.parse(storedCompanies).length > 0) {
      setCompanies(JSON.parse(storedCompanies));
    } else {
      // Inject Seed Data if empty
      setCompanies(initialSeedData);
      localStorage.setItem('aqi_companies', JSON.stringify(initialSeedData));
    }
    
    const loggedIn = localStorage.getItem('aqi_currentUser');
    if (loggedIn) {
      setCurrentUser(JSON.parse(loggedIn));
    }

    const storedLang = localStorage.getItem('aqi_lang');
    if (storedLang) {
      setLanguage(storedLang);
    }
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('aqi_lang', lang);
  };

  const registerCompany = (companyData) => {
    const newCompany = {
      ...companyData,
      id: Date.now().toString(),
      submissions: [],
      hasAcceptedRules: false
    };
    const updated = [...companies, newCompany];
    setCompanies(updated);
    localStorage.setItem('aqi_companies', JSON.stringify(updated));
  };

  const loginCompany = (regNumber) => {
    const company = companies.find(c => c.regNumber === regNumber);
    if (company) {
      setCurrentUser(company);
      localStorage.setItem('aqi_currentUser', JSON.stringify(company));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('aqi_currentUser');
  };

  const acceptRules = () => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, hasAcceptedRules: true };
    setCurrentUser(updatedUser);
    localStorage.setItem('aqi_currentUser', JSON.stringify(updatedUser));

    const updatedCompanies = companies.map(c => 
      c.id === updatedUser.id ? updatedUser : c
    );
    setCompanies(updatedCompanies);
    localStorage.setItem('aqi_companies', JSON.stringify(updatedCompanies));
  };

  const submitData = (data) => {
    if (!currentUser) return;
    
    const submission = {
      ...data,
      date: new Date().toISOString(),
      id: Date.now().toString()
    };

    const updatedCompanies = companies.map(c => {
      if (c.id === currentUser.id) {
        const updatedCompany = {
          ...c,
          submissions: [...(c.submissions || []), submission]
        };
        setCurrentUser(updatedCompany);
        localStorage.setItem('aqi_currentUser', JSON.stringify(updatedCompany));
        return updatedCompany;
      }
      return c;
    });

    setCompanies(updatedCompanies);
    localStorage.setItem('aqi_companies', JSON.stringify(updatedCompanies));
  };

  return (
    <AppContext.Provider value={{
      companies,
      currentUser,
      language,
      changeLanguage,
      registerCompany,
      loginCompany,
      logout,
      acceptRules,
      submitData
    }}>
      {children}
    </AppContext.Provider>
  );
};
