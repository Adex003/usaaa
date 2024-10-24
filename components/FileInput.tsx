/* eslint-disable @next/next/no-img-element */
import React, { useRef } from "react";
import {
  UseFormRegister,
  FieldValues,
  UseFormWatch,
  UseFormResetField,
} from "react-hook-form";
import { Input } from "./Input";

interface FileInputProps {
  register: UseFormRegister<any>;
  watch: UseFormWatch<any>;
  error?: string;
  name: string;
  label: string;
  placeholder?: string;
}

export const FileInput: React.FC<FileInputProps> = ({
  register,
  watch,
  name,
  label,
  error,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { ref, ...rest } = register(name);

  return (
    <div>
      {watch(name) && watch(name).length ? (
        <img
          alt={name}
          src={URL.createObjectURL(watch(name)[0])}
          style={{
            height: `100px`,
            width: `100px`,
            objectFit: `contain`,
            marginTop: `16px`,
          }}
        />
      ) : null}
      <div
        style={{
          position: `relative`,
          width: `100%`,
          height: `fit-content`,
        }}
      >
        <input
          type={`file`}
          accept={`image/*`}
          {...rest}
          ref={(e) => {
            ref(e);
            inputRef.current = e;
          }}
          style={{
            position: `absolute`,
            width: `100%`,
            minHeight: `100%`,
            zIndex: 9998,
            opacity: 0,
          }}
        />
        <Input
          name={name}
          label={label}
          defaultValue={
            watch(name) && watch(name).length ? watch(name)[0].name : ``
          }
          error={error}
        />
      </div>
    </div>
  );
};
