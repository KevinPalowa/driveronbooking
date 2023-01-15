import React, { InputHTMLAttributes, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const baseStyle = "border border-gray-300 rounded py-2 px-2 w-full";
  return props.type === "password" ? (
    <div className="relative">
      <input
        className={`${baseStyle} pr-9`}
        {...props}
        type={isShowPassword ? "text" : "password"}
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
    <input className={baseStyle} {...props} />
  );
}

export default Input;
