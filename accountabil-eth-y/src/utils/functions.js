export const as2DecimalPlace = (amount) => {
  return (Math.round(amount * 100) / 100).toFixed(2);
};
