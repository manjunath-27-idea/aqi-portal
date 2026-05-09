import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

const initialAuthoritiesData = {
  central: [
    { id: 'c1', name: 'Shri Piyush Goyal', role: "Hon'ble Minister", department: 'Ministry of Commerce & Industry', bg: '0D8ABC', imageUrl: '' },
    { id: 'c2', name: 'Shri Bhupender Yadav', role: "Hon'ble Minister", department: 'Ministry of Environment & Forests', bg: '0D8ABC', imageUrl: '' },
    { id: 'c3', name: 'Shri Tanmay Kumar', role: 'Chairman', department: 'Central Pollution Control Board', bg: '0D8ABC', imageUrl: '' }
  ],
  state: [
    { id: 's1', name: 'Shri D. Sridhar Babu', role: "Hon'ble Minister", department: 'Industries & Commerce, IT', bg: '198754', imageUrl: '' },
    { id: 's2', name: 'Smt. Konda Surekha', role: "Hon'ble Minister", department: 'Environment & Forests', bg: '198754', imageUrl: '' }
  ]
};

// Helper function to get ISO date string safely
const getISODateString = (offsetMs = 0) => {
  const date = new Date(Date.now() + offsetMs);
  return date.toISOString();
};

const initialSeedData = [
  {
    id: "seed-1",
    companyName: "Tata Steel Facility",
    industryType: "Iron and Steel",
    companyCategory: "Heavy",
    region: "East",
    stateLocation: "Jharkhand",
    contactEmail: "compliance@tatasteel.com",
    regNumber: "TATA1001",
    stationId: "CEMS-JHR-001",
    gpsCoordinates: "23.8004° N, 86.4312° E",
    declaredChemicals: ["PM25", "PM10", "CO2", "SO2"],
    hasAcceptedRules: true,
    submissions: [
      {
        id: "sub-1-1",
        date: getISODateString(-86400000), // Yesterday
        chemicals: { PM25: 15, PM10: 20, SO2: 10, NO2: 0, CO2: 80, O3: 0, NH3: 0 },
        temperature: 150,
        flowRate: 1200,
        hasPurifier: true,
        aqi: 24,
        tax: 0, 
        discrepancies: [],
        bypassDetected: false
      }
    ]
  },
  {
    id: "seed-2",
    companyName: "Vapi Chemical Works",
    industryType: "Petrochemicals",
    companyCategory: "Heavy",
    region: "West",
    stateLocation: "Gujarat",
    contactEmail: "admin@vapichem.in",
    regNumber: "VAPI9922",
    stationId: "CEMS-GUJ-842",
    gpsCoordinates: "20.3667° N, 72.9167° E",
    declaredChemicals: ["PM10", "CO2", "NO2"],
    hasAcceptedRules: true,
    submissions: [
      {
        id: "sub-2-1",
        date: getISODateString(),
        chemicals: { PM25: 0, PM10: 120, SO2: 80, NO2: 60, CO2: 40, O3: 10, NH3: 0 },
        temperature: 140,
        flowRate: 900,
        hasPurifier: false,
        aqi: 322,
        tax: 19600, 
        discrepancies: ["SO2", "O3"],
        bypassDetected: false
      }
    ]
  },
  {
    id: "seed-3",
    companyName: "Delhi North Power",
    industryType: "Thermal Power Plants",
    companyCategory: "Medium",
    region: "North",
    stateLocation: "Delhi",
    contactEmail: "reports@delhipower.gov.in",
    regNumber: "DNP4455",
    stationId: "CEMS-DEL-101",
    gpsCoordinates: "28.7041° N, 77.1025° E",
    declaredChemicals: ["PM25", "PM10", "SO2", "NO2", "CO2"],
    hasAcceptedRules: true,
    submissions: [
      {
        id: "sub-3-1",
        date: getISODateString(),
        chemicals: { PM25: 40, PM10: 50, SO2: 20, NO2: 30, CO2: 200, O3: 0, NH3: 0 },
        temperature: 45,
        flowRate: 300,
        hasPurifier: true,
        aqi: 226, 
        tax: 12400, 
        discrepancies: [],
        bypassDetected: true
      }
    ]
  }
];

export const AppProvider = ({ children }) => {
  const [companies, setCompanies] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [language, setLanguage] = useState('EN'); 
  const [authorities, setAuthorities] = useState(initialAuthoritiesData);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedCompanies = localStorage.getItem('aqi_companies');
      if (storedCompanies && JSON.parse(storedCompanies).length > 0) {
        setCompanies(JSON.parse(storedCompanies));
      } else {
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

      const storedAuth = localStorage.getItem('aqi_authorities');
      if (storedAuth) {
        setAuthorities(JSON.parse(storedAuth));
      } else {
        localStorage.setItem('aqi_authorities', JSON.stringify(initialAuthoritiesData));
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      setCompanies(initialSeedData);
      setLanguage('EN');
      setAuthorities(initialAuthoritiesData);
    }
  }, []);

  const updateAuthority = (type, id, updatedData) => {
    const updated = { ...authorities };
    updated[type] = updated[type].map(auth => auth.id === id ? { ...auth, ...updatedData } : auth);
    setAuthorities(updated);
    localStorage.setItem('aqi_authorities', JSON.stringify(updated));
  };

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
      date: getISODateString(),
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
      authorities,
      changeLanguage,
      updateAuthority,
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
