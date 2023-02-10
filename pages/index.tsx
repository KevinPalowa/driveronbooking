import Button from "@/components/Button";
import Input from "@/components/Input";
import Image from "next/image";
import { setCookie } from "cookies-next";
import { useRouter } from "next/router";
import React from "react";
import Logo from "../public/img/logo.png";
import { useForm } from "react-hook-form";
import Head from "next/head";
import axios, { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { useUser } from "@/hooks/useUser";
import { Spinner } from "@chakra-ui/react";
export type LoginBody = { email: string; password: string };

async function doLogin({ email, password }: LoginBody) {
  const data = await axios.post("api/auth/login", { email, password });
  return data.data;
}
export default function Login() {
  const { handleSubmit: submit, control } = useForm<LoginBody>();
  const { login, user } = useUser();
  const router = useRouter();
  const { mutate, error, isLoading, data } = useMutation<
    any,
    AxiosError<any>,
    LoginBody
  >(doLogin);
  async function handleSubmit({ email, password }: LoginBody) {
    mutate(
      { email, password },
      {
        onSuccess: (res) => {
          setCookie("token", res.data.token);
          login(res.data);
          router.push("/dashboard");
        },
      }
    );
  }
  return (
    <div className="bg-gray-900 w-full min-h-screen grid place-items-center">
      <Head>
        <title>Login Page</title>
      </Head>
      <Image src={Logo} alt="logo" className="w-64 mx-auto" />
      <div className="p-10 bg-white rounded-lg w-10/12 lg:w-5/12 space-y-5 shadow-lg">
        {error && (
          <div className="text-red-500 bg-red-200 p-3 w-full">
            {error?.response?.data.meta.message}
          </div>
        )}
        <h1 className="font-bold text-xl text-center">
          Sign in to your account
        </h1>
        <p className="text-center">Please sign in to continue</p>
        <form onSubmit={submit(handleSubmit)}>
          <div className="space-y-1">
            <label className="block">Email</label>
            <Input
              control={control}
              name="email"
              rules={{
                required: "Email cannot be empty",
                pattern: {
                  value:
                    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                  message: "Please input a valid email",
                },
              }}
            />
          </div>
          <div className="space-y-1 mt-3">
            <label className="block">Password</label>
            <Input
              type="password"
              control={control}
              name="password"
              rules={{ required: "Password cannot be empty" }}
            />
          </div>
          <Button className="w-full" disabled={isLoading}>
            {isLoading ? <Spinner size="sm" color="white" /> : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
}
