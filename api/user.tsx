import { api } from "@/lib/axios";
import { Role, TBrowseData } from "@/types/global";
import { UserResponse } from "@/types/user";

type AddUserBody = {
  email: string;
  name: string;
  password: string;
  role: Role;
};

type Params = {
  search: string;
  size: number;
  page: number;
  role: Role;
};
export const addUser = async ({ email, name, password, role }: AddUserBody) => {
  const data = await api.post("api/user", { email, password, name, role });
  return data.data;
};

export const deleteUser = async (id: number | string) => {
  const data = await api.delete(`api/user/${id}`);
  return data.data;
};

export const getUser = async ({
  search,
  size,
  page,
  role,
}: Params): Promise<TBrowseData<UserResponse[]>> => {
  const data = await api.get(
    `/api/user?search=${search}&size=${size}&page=${page}&role=${role}`
  );
  return data.data;
};
