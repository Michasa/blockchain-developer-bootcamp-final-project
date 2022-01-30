import Web3 from "web3";
let web3 = new Web3(Web3.givenProvider);
let { isAddress, toBN, asciiToHex, hexToUtf8 } = web3.utils;

export const as2DecimalPlace = (amount) => {
  return (Math.round(amount * 100) / 100).toFixed(2);
};

export const isValidNonEmptyAddress = (address) => {
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
