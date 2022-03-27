import { useEffect, useState } from "react";
const { REACT_APP_EXCHANGE_RATES_ENDPOINT } = process.env;

function ExchangeRates({ amount }) {
  const [fiatExhangeRates, setFiatExhangeRates] = useState({});

  let queryAmount = Number(amount);

  let returnExchangeRates = async () => {
    let response = await fetch(REACT_APP_EXCHANGE_RATES_ENDPOINT);
    let {
      data: {
        rates: { GBP, USD, EUR },
      },
    } = await response.json();
    setFiatExhangeRates({ GBP, USD, EUR });
  };

  useEffect(() => {
    returnExchangeRates();
  }, [queryAmount]);

  return (
    <div>
      {fiatExhangeRates && queryAmount >= 0 ? (
        <details>
          <summary>See the exchange rate to Fiat currencies</summary>
          <div>
            This amount is approximately equivalent to...
            {Object.keys(fiatExhangeRates).map((currency) => (
              <div key={currency}>
                {currency}:{" "}
                {(queryAmount * fiatExhangeRates[currency]).toFixed(2)}{" "}
              </div>
            ))}
          </div>
        </details>
      ) : (
        <p>Please enter a valid amount of ETH to begin 🤷💸</p>
      )}
    </div>
  );
}

export default ExchangeRates;
