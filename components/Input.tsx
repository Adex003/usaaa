import React from "react";
import { UseFormRegister, FieldValues } from "react-hook-form";
import ReactInputMask from "react-input-mask";

interface InputProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label: string;
  name: string;
  placeholder?: string;
  error?: string;
  register?: UseFormRegister<any>;
  registerOptions?: any;
  mask?: string;
  subLabel?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  subLabel,
  name,
  placeholder,
  error,
  register = () =>
  ({} as {
    ref: any;
  }),
  registerOptions,
  mask,
  ...props
}) => {
  return (
    <div className="usaa-form-v5-10-1-textInput usaa-form-v5-10-1-fieldWrapper">
      <div className="usaa-form-v5-10-1-block col-1-1">
        <div>
          <div>
            <label
              htmlFor="usaa-form-v5-10-1-input-c03k07s2xl9g"
              className="usaa-form-v5-10-1-fieldLabel usaa-form-v5-10-1-fieldWrapper-label"
            >
              <span
                aria-hidden="false"
                className="usaa-form-v5-10-1-fieldLabel-text"
              >
                {label}
              </span>
            </label>
          </div>
          {subLabel ? (
            <div
              className="usaa-form-v5-10-1-fieldWrapper-helpText"
              id="usaa-form-v5-10-1-input-xdrej1k74rc-helpText"
            >
              {subLabel}
            </div>
          ) : null}
          <div>
            <div
              id="usaa-form-v5-10-1-input-c03k07s2xl9g-errorMessage"
              className="usaa-form-v5-10-1-fieldWrapper-errorMessage usaa-form-v5-10-1-fieldWrapper-errorMessage--active"
              data-error-message=""
            >
              {error ? (
                <span>
                  <span className="fieldWrapper-errorArrow" />
                  <span className="screenReader">error: </span>
                  {error}
                </span>
              ) : null}
            </div>

            <div className="screenReader" role="alert" />
          </div>
          <span className="usaa-input">
            {mask ? (
              // @ts-ignore
              <ReactInputMask mask={mask} {...register(name)} {...props}>
                {
                  // @ts-ignore
                  () => (
                    <input
                      aria-invalid="false"
                      autoComplete="off"
                      id="usaa-form-v5-10-1-input-c03k07s2xl9g"
                      type="text"
                      aria-describedby="usaa-form-v5-10-1-input-c03k07s2xl9g-errorMessage undefined"
                      {...register(name)}
                      {...props}
                    />
                  )
                }
              </ReactInputMask>
            ) : (
              <input
                aria-invalid="false"
                autoComplete="off"
                id="usaa-form-v5-10-1-input-c03k07s2xl9g"
                type="text"
                aria-describedby="usaa-form-v5-10-1-input-c03k07s2xl9g-errorMessage undefined"
                {...register(name)}
                {...props}
              />
            )}

            <span className="keyboardFocusRing" aria-hidden="true" />
          </span>
        </div>
        <div className="keyboardFocusRing" />
      </div>
    </div>
  );
};
