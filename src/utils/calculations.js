export const calculateAQI = (chemicals) => {
  // Sub-index calculation (simplified based on EPA/CPCB breakpoints for mock logic)
  const calculateSubIndex = (conc, type) => {
    if (conc <= 0) return 0;
    // Dummy linear interpolation logic for sub-indices
    if (type === 'PM25') return conc * 1.6;
    if (type === 'PM10') return conc * 0.9;
    if (type === 'SO2') return conc * 1.25;
    if (type === 'NO2') return conc * 1.1;
    if (type === 'CO2') return conc * 0.05; // CO2 doesn't technically have a strict AQI index, but kept for tax
    if (type === 'O3') return conc * 1.3;
    if (type === 'NH3') return conc * 0.8;
    return 0;
  };

  const subIndices = [];
  let pmCount = 0;
  let totalPollutantsCount = 0;

  for (const [chem, conc] of Object.entries(chemicals)) {
    if (conc > 0) {
      if (chem !== 'CO2') { // Exclude CO2 from the mandatory 3-pollutant rule as per standard
        totalPollutantsCount++;
        if (chem === 'PM25' || chem === 'PM10') {
          pmCount++;
        }
      }
      subIndices.push(calculateSubIndex(conc, chem));
    }
  }

  // Official AQI Rule 1 & 2: Minimum 3 pollutants, at least one must be PM2.5 or PM10.
  if (totalPollutantsCount < 3 || pmCount === 0) {
    return { error: 'AQI Calculation Rejected: Minimum three criteria pollutants required, and one must be PM10 or PM2.5.' };
  }

  // Official AQI Rule 3: Overall AQI is the maximum of the sub-indices
  const aqi = Math.max(...subIndices);

  return { value: Math.min(Math.round(aqi), 500) };
};

export const getAQICategory = (aqi) => {
  if (aqi <= 50) return { label: 'Good', color: '#009966' };
  if (aqi <= 100) return { label: 'Satisfactory', color: '#FFDE33' };
  if (aqi <= 200) return { label: 'Moderate', color: '#FF9933' };
  if (aqi <= 300) return { label: 'Poor', color: '#CC0033' };
  if (aqi <= 400) return { label: 'Very Poor', color: '#660099' };
  return { label: 'Severe', color: '#7E0023' };
};

export const calculateTax = (chemicals, hasPurifier, aqi) => {
  // Tax calculation in INR (₹)
  const rates = {
    SO2: 150,  
    NO2: 120,  
    PM25: 100, 
    PM10: 80,  
    O3: 70,
    NH3: 60,
    CO2: 10    
  };

  let totalTax = 0;

  for (const [chem, conc] of Object.entries(chemicals)) {
    if (rates[chem] && conc > 0) {
      totalTax += conc * rates[chem];
    }
  }

  // Purifier Tax Rebate Logic
  if (hasPurifier) {
    if (aqi <= 100) {
      // Good or Satisfactory AQI with purifiers = 0 Tax!
      totalTax = 0;
    }
  }

  return Math.round(totalTax);
};
