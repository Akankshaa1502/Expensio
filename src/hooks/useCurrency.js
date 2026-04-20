import { useState, useEffect } from 'react';
import { getExchangeRates } from '../services/api';
import { formatCurrency } from '../utils/currencyFormatter';

export function useCurrency() {
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRates = async () => {
      setLoading(true);
      const data = await getExchangeRates('INR');
      setRates(data);
      setLoading(false);
    };
    fetchRates();
  }, []);

  const convert = (amount, to = 'USD') => {
    if (!rates || !rates[to]) return null;
    return (amount * rates[to]).toFixed(2);
  };

  return { rates, loading, convert, formatCurrency };
}
