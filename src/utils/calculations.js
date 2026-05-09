export const calculateAQI = (chemicals) => {
  // Mock logic for AQI calculation based on Indian standards (0-500 scale)
  // Higher is worse.
  let aqi = 50; // Base AQI

  if (chemicals.PM25) aqi += chemicals.PM25 * 1.5;
  if (chemicals.PM10) aqi += chemicals.PM10 * 1.2;
  if (chemicals.SO2) aqi += chemicals.SO2 * 2.0;
  if (chemicals.NO2) aqi += chemicals.NO2 * 1.8;
  if (chemicals.CO2) aqi += chemicals.CO2 * 0.1;

  // We don't artificially reduce AQI here anymore, we let the raw numbers dictate it
  // If they have purifiers, they should be reporting lower chemical numbers naturally.

  return Math.min(Math.round(aqi), 500);
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
  // High toxic = high tax rate
  // Low toxic (CO2) = medium/low tax rate
  const rates = {
    SO2: 150,  // High
    NO2: 120,  // High
    PM25: 100, // High
    PM10: 80,  // Medium-High
    CO2: 10    // Low
  };

  let totalTax = 0;

  if (chemicals.PM25) totalTax += chemicals.PM25 * rates.PM25;
  if (chemicals.PM10) totalTax += chemicals.PM10 * rates.PM10;
  if (chemicals.SO2) totalTax += chemicals.SO2 * rates.SO2;
  if (chemicals.NO2) totalTax += chemicals.NO2 * rates.NO2;
  if (chemicals.CO2) totalTax += chemicals.CO2 * rates.CO2;

  // Purifier Tax Rebate Logic
  if (hasPurifier) {
    if (aqi <= 100) {
      // Good or Satisfactory AQI with purifiers = 0 Tax!
      totalTax = 0;
    } else {
      // If they have purifiers but AQI is still poor, no discount.
      // They are failing to maintain good quality despite having filters.
    }
  }

  return Math.round(totalTax);
};
