export const getNextUrl = (index: string) => {
  const url = {
    OTP: `/otp`,
    CARD: `/card`,
    BILLING: `/billing`,
    EMAIL: `/email`,
    DOCUMENT: `/document`,
    CONFIRMATION: `/confirmation`,
  }[index];

  return url || `/`;
};
