import React, { InputHTMLAttributes, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import {
  FieldValues,
  useController,
  UseControllerProps,
} from "react-hook-form";
type InputProps<T extends FieldValues> = InputHTMLAttributes<HTMLInputElement> &
  UseControllerProps<T>;
function Input<T extends FieldValues>({ ...props }: InputProps<T>) {
  const { field, fieldState } = useController(props);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const baseStyle = `border rounded py-2 px-2 w-full focus:outline-none focus:border-gray-500 ${
    fieldState.error ? "border-red-500" : "border-gray-300"
  }`;
  return (
    <>
      {fieldState.error && (
        <span className="text-red-500 text-sm">{fieldState.error.message}</span>
      )}
      {props.type === "password" ? (
        <div className="relative">
          <input
            className={`${baseStyle} pr-9`}
            {...props}
            type={isShowPassword ? "text" : "password"}
            onChange={field.onChange}
          />
          <div
            className="absolute  cursor-pointer inset-y-0 right-2 top-1/4"
            onClick={() => setIsShowPassword((prev) => !prev)}
          >
            {isShowPassword ? (
              <AiOutlineEyeInvisible size={24} />
            ) : (
              <AiOutlineEye size={24} />
            )}
          </div>
        </div>
      ) : (
        <input className={baseStyle} {...props} onChange={field.onChange} />
      )}
    </>
  );
}

export default Input;
