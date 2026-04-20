import axios from 'axios';

const EXCHANGE_API = 'https://api.exchangerate-api.com/v4/latest';

export const getExchangeRates = async (baseCurrency = 'INR') => {
  try {
    const response = await axios.get(`${EXCHANGE_API}/${baseCurrency}`);
    return response.data.rates;
  } catch (error) {
    console.error('Failed to fetch exchange rates:', error);
    return null;
  }
};

export const convertCurrency = async (amount, from = 'INR', to = 'USD') => {
  const rates = await getExchangeRates(from);
  if (rates && rates[to]) {
    return (amount * rates[to]).toFixed(2);
  }
  return null;
};
