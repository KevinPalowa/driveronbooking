import Button from "@/components/Button";
import Input from "@/components/Input";
import axios from "axios";
import { setCookie } from "cookies-next";
import { useRouter } from "next/router";
import React, { FormEvent, useState } from "react";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const loginData = await axios.post("/api/login", { email, password });
    if (loginData.status === 200) {
      setCookie("authToken", loginData.data.data.token);
      router.push("/admin");
    }
    console.log(loginData);
  }
  return (
    <div className="bg-blue-400 w-full h-screen grid place-items-center">
      <div className="p-10 bg-white rounded-lg w-5/12 space-y-5">
        <h1 className="font-bold text-xl text-center">
          Sign in to your account
        </h1>
        <p className="text-center">Please sign in to continue</p>
        <form onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="block">Email</label>
            <Input onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-1 mt-3">
            <label className="block">Password</label>
            <Input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
            />
          </div>
          <Button className="w-full">Login</Button>
        </form>
      </div>
    </div>
  );
}
