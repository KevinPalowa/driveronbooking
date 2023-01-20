import Link from "next/link";
import { useRouter } from "next/router";
import React, { ReactNode, useMemo, useState } from "react";
import Image from "next/image";
import { BsPeople } from "react-icons/bs";
import { MdOutlineAltRoute } from "react-icons/md";
import Logo from "../public/img/logo.png";
import Head from "next/head";
import { deleteCookie } from "cookies-next";
import { useUser } from "@/hooks/useUser";
type Props = {
  children: ReactNode;
};
export default function Layout({ children }: Props) {
  const { user, logout } = useUser();
  console.log(user);
  const router = useRouter();
  const current_module = useMemo(
    () => router.pathname.split("/")[2],
    [router.pathname]
  );
  const [show_sidebar, setShowSidebar] = useState(false);
  return (
    <div className="flex h-screen w-screen overflow-x-hidden text-[#292727]">
      <Head>
        <title>Driver On Booking CMS</title>
      </Head>
      <div
        className={`group absolute top-0 left-0 z-10 block h-screen w-screen bg-white p-6 transition-all lg:relative lg:top-auto lg:left-auto lg:block lg:h-full lg:w-64 lg:flex-shrink ${
          !show_sidebar && "-translate-x-full lg:translate-x-0"
        }`}
      >
        <Image
          src={Logo}
          alt=""
          height={56}
          width={100}
          className="mb-8 h-14 w-auto"
        />
        <button
          className="absolute top-4 right-6 block text-lg font-semibold text-black lg:hidden"
          onClick={() => setShowSidebar(false)}
        >
          x
        </button>
        <ul>
          <li className="mb-4">
            <Link legacyBehavior href="/admin">
              <a
                className={`flex items-center rounded-lg py-2 px-6 transition hover:font-semibold hover:opacity-100 ${
                  current_module === "overview"
                    ? "bg-farmatek-purple-200 text-white"
                    : "bg-white"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-4 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Dashboard
              </a>
            </Link>
          </li>
          <li className="mb-4">
            <Link legacyBehavior href="/dashboard/order">
              <a
                className={`flex items-center rounded-lg py-2 px-6 transition hover:font-semibold hover:opacity-100 ${
                  current_module === "order"
                    ? "bg-farmatek-purple-200 text-white"
                    : "bg-white"
                }`}
              >
                <MdOutlineAltRoute size={24} className="mr-4" />
                Destination
              </a>
            </Link>
          </li>
          <li className="mb-4">
            <Link legacyBehavior href="/driver">
              <a
                className={`flex items-center rounded-lg py-2 px-6 transition hover:font-semibold hover:opacity-100 ${
                  current_module === "product"
                    ? "bg-farmatek-purple-200 text-white"
                    : "bg-white"
                }`}
              >
                <BsPeople size={24} className="mr-4" />
                Driver
              </a>
            </Link>
          </li>
        </ul>
      </div>
      <div className="flex flex-grow flex-col overflow-hidden">
        <div className="flex w-full items-center justify-between bg-white py-5 px-9">
          <div className="">
            <h3 className="mb-1 text-xl font-bold">Hello {user.name}!</h3>
            {/* <p>{member.member_level.name}</p> */}
          </div>
          <div className="flex items-center">
            <span className="group relative cursor-pointer">
              <Image
                src={`https://ui-avatars.com/api/?name=${user.name}&background=random&rounded=true`}
                width={32}
                height={32}
                alt="Profile"
                className="ml-2 rounded-full"
              />
              <ul className="absolute bottom-0 right-0 z-10 hidden translate-y-full transform flex-col text-center shadow-md group-hover:flex">
                <button
                  className="whitespace-nowrap border bg-white py-2 px-4 text-sm"
                  onClick={() => {
                    deleteCookie("token");
                    router.push("/");
                    logout();
                  }}
                >
                  Keluar
                </button>
              </ul>
            </span>
            <button onClick={() => setShowSidebar(true)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="ml-2 block h-6 w-6 lg:hidden"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="relative w-full flex-grow overflow-hidden overflow-y-scroll bg-slate-100 p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
