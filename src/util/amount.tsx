const exchangeRate = 10;

export const amountReceived = (amount: number) => {
  const serviceFee = Number(process.env.SERVICE_FEE);
  return ((100 - serviceFee) * amount) / 100;
};
export const amountWithServiceFee = (amount: number) => {
  const serviceFee = Number(process.env.SERVICE_FEE);
  return Number((serviceFee * amount) / 100 + amount).toFixed(2);
};

export const amountDollarWithServiceFee = (amount: number) => {
  const serviceFee = Number(process.env.SERVICE_FEE);
  return Number(((serviceFee * amount) / 100 + amount) * exchangeRate).toFixed(2);
};
export const amountReceivedDollar = (amount: number) => {
  const serviceFee = Number(process.env.SERVICE_FEE);
  return ((100 - serviceFee) * amount * exchangeRate) / 100;
};

export const amountDollar = (amount: number) => {
  return amount * exchangeRate;
};
