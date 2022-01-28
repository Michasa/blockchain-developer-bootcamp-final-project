import React, { useEffect, useState } from "react";
import { as2DecimalPlace } from "../utils/functions";

function ExchangeRates({ amount }) {
  const [fiatExhangeRates, setFiatExhangeRates] = useState();
  let queryAmount = Number(amount);

  useEffect(() => {
    async function fetchExchangeRate() {
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
            <div>GBP(£):{as2DecimalPlace(amount * fiatExhangeRates.GBP)} </div>
            <div>USD($):{as2DecimalPlace(amount * fiatExhangeRates.USD)} </div>
            <div>EUR(€): {as2DecimalPlace(amount * fiatExhangeRates.EUR)}</div>
          </div>
        </details>
      ) : (
        <p>Please enter a valid amount of ETH to begin 🤷💸</p>
      )}
    </div>
  );
}

export default ExchangeRates;
