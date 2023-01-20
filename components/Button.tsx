import { ButtonHTMLAttributes } from "react";

export default function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`bg-secondary rounded-lg py-3 mt-10 text-black ${props.className}`}
    />
  );
}
