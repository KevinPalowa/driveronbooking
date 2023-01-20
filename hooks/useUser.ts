import UserContext from "@/context/UserProvider";
import React, { ReactNode } from "react";
import { useState, useContext } from "react";

export function useUser() {
  const { user, setUser } = useContext(UserContext);
  function login(data) {
    setUser(data);
  }

  function logout() {
    setUser(null);
  }

  return { user, login, logout };
}
