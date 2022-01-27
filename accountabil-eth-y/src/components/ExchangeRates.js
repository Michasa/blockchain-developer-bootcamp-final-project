import React, { useEffect, useState } from "react";

function ExchangeRates({ amount }) {
  const [fiatExhangeRates, setFiatExhangeRates] = useState();
  let queryAmount = Number(amount);

  let thatExchangeFormula = (amount, fiat) => {
    return (Math.round(amount * fiat * 100) / 100).toFixed(2);
  };

  useEffect(() => {
    async function fetchExchangeRate(params) {
      let response = await fetch(
        "https://api.coinbase.com/v2/exchange-rates?currency=ETH"
      );
      let {
        data: {
          rates: { GBP, USD, EUR },
        },
      } = await response.json();
      setFiatExhangeRates({ GBP, USD, EUR });
    }
    fetchExchangeRate();
  });

  return (
    <div>
      {fiatExhangeRates && queryAmount >= 0 ? (
        <details>
          <summary>See the exchange rate to Fiat currencies</summary>
          <div>
            This amount is approximately equivalent to...
            <div>
              GBP(£):{thatExchangeFormula(amount, fiatExhangeRates.GBP)}{" "}
            </div>
            <div>
              USD($):{thatExchangeFormula(amount, fiatExhangeRates.USD)}{" "}
            </div>
            <div>
              EUR($): {thatExchangeFormula(amount, fiatExhangeRates.EUR)}
            </div>
          </div>
        </details>
      ) : (
        <p>Please enter a valid amount of ETH to begin 🤷💸</p>
      )}
    </div>
  );
}

export default ExchangeRates;
