const { isAddress, toBN, asciiToHex, hexToUtf8 } = require("web3-utils");

export const as2DecimalPlace = (amount) => {
  return (Math.round(amount)).toFixed(2);
};

export const isValidAddress = (address) => {
  return !!(isAddress(address) && !toBN(address).isZero());
};

export const returnHexArray = (array) => {
  return array.map((commitment) => {
    let hex = asciiToHex(commitment);
    return hex.padEnd(66, "0");
  });
};

export const returnUTF8Array = (array) => {
  return array.map((commitment) => {
    return hexToUtf8(commitment);
  });
};
