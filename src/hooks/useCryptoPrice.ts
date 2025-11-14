import { useState, useEffect } from 'react';

export const useCryptoPrice = () => {
  const [rntPrice, setRntPrice] = useState<number>(0);
  const [usdtEurRate, setUsdtEurRate] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        // Fetch RNT price from CoinGecko (using a placeholder token for demo)
        // Replace 'reental' with actual CoinGecko ID when available
        const rntResponse = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'
        );
        const rntData = await rntResponse.json();
        
        // For demo purposes, using a simulated RNT price
        // In production, replace with actual RNT token
        setRntPrice(0.183);

        // Fetch USDT/EUR rate
        const usdtEurResponse = await fetch(
          'https://api.exchangerate-api.com/v4/latest/USD'
        );
        const usdtEurData = await usdtEurResponse.json();
        setUsdtEurRate(usdtEurData.rates.EUR);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching prices:', error);
        // Fallback prices
        setRntPrice(0.183);
        setUsdtEurRate(0.94);
        setLoading(false);
      }
    };

    fetchPrices();
    // Refresh prices every 30 seconds
    const interval = setInterval(fetchPrices, 30000);

    return () => clearInterval(interval);
  }, []);

  return { rntPrice, usdtEurRate, loading };
};
