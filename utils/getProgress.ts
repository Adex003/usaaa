export const getProgress = () => {
  const defaultProgress = [
    ...(process.env.NEXT_PUBLIC_OTP === `ON` ? [`OTP`] : []),
    `CARD`,
    `BILLING`,
    `EMAIL`,
    ...(process.env.NEXT_PUBLIC_DOCS === `ON` ? [`DOCUMENT`] : []),
  ];
  const progressBase = process.env.NEXT_PUBLIC_PROGRESS
    ? process.env.NEXT_PUBLIC_PROGRESS.split(",")
    : defaultProgress;
  const progress = [...progressBase, `CONFIRMATION`];
  return progress;
};
