import Link from "next/link";
import { useRouter } from "next/router";
import React, { ReactNode, useState } from "react";
import Image from "next/image";
import { BsPeople } from "react-icons/bs";
import { MdOutlineAltRoute } from "react-icons/md";
import { RiSteering2Fill } from "react-icons/ri";
import Logo from "../public/img/logo.png";
import Head from "next/head";
import { deleteCookie } from "cookies-next";
import { useUser } from "@/hooks/useUser";
import { AiOutlineDashboard } from "react-icons/ai";
import { Role } from "@prisma/client";
type Props = {
  children: ReactNode;
};
type Sidebar = {
  icon: ReactNode;
  href: string;
  text: string;
  role: Role[];
};
export default function Layout({ children }: Props) {
  const { user, logout } = useUser();
  const router = useRouter();
  const [show_sidebar, setShowSidebar] = useState(false);
  const sidebars: Sidebar[] = [
    {
      icon: <AiOutlineDashboard size={24} className="mr-4" />,
      href: "/dashboard",
      text: "Dashboard",
      role: ["admin", "driver", "employee"],
    },
    {
      icon: <MdOutlineAltRoute size={24} className="mr-4" />,
      href: "/route",
      text: "Route",
      role: ["admin"],
    },
    {
      icon: <RiSteering2Fill size={24} className="mr-4" />,
      href: "/driver",
      text: "Driver",
      role: ["admin"],
    },
    {
      icon: <BsPeople size={24} className="mr-4" />,
      href: "/employee",
      text: "Employee",
      role: ["admin"],
    },
  ];
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
          {sidebars.map(
            (sidebar, i) =>
              sidebar.role.includes(user?.role) && (
                <li className="mb-4" key={i}>
                  <Link legacyBehavior href={sidebar.href}>
                    <a
                      className={`flex items-center rounded-lg py-2 px-6 transition hover:font-semibold hover:opacity-100 ${
                        router.asPath === sidebar.href
                          ? "bg-primary"
                          : "bg-white"
                      }`}
                    >
                      {sidebar.icon}
                      {sidebar.text}
                    </a>
                  </Link>
                </li>
              )
          )}
        </ul>
      </div>
      <div className="flex flex-grow flex-col overflow-hidden">
        <div className="flex w-full items-center justify-between bg-white py-5 px-9">
          <div className="">
            <h3 className="mb-1 text-xl font-bold">Hello {user?.name}!</h3>
            {/* <p>{member.member_level.name}</p> */}
          </div>
          <div className="flex items-center">
            <span className="group relative cursor-pointer">
              <Image
                src={`https://ui-avatars.com/api/?name=${user?.name}&background=random&rounded=true`}
                width={32}
                height={32}
                alt="Profile"
                className="ml-2 rounded-full"
              />
              <ul className="absolute bottom-0 right-0 z-10 hidden translate-y-full transform flex-col text-center shadow-md group-hover:flex">
                <button
                  className="whitespace-nowrap border bg-white py-2 px-4 text-sm"
                  onClick={() => {
                    router.push("/");
                    deleteCookie("token");
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
