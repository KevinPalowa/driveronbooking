import { userState } from "@/global/user";
import { User } from "@prisma/client";
import { useRecoilState } from "recoil";

export function useUser() {
  const [user, setUser] = useRecoilState(userState);
  function login(data: User) {
    setUser(data);
  }

  function logout() {
    setUser(null);
  }

  return { user, login, logout };
}
