import { User } from "@prisma/client";
import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const userState = atom<User | null>({
  key: "userstate",
  default: null,
  effects_UNSTABLE: [persistAtom],
});
