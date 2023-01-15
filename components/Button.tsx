import { ButtonHTMLAttributes } from "react";

export default function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`bg-blue-400 rounded-lg py-3 text-white mt-10 ${props.className}`}
    />
  );
}
