import { api } from "@/lib/axios";

type AddDriverBody = { email: string; name: string; password: string };
export const addDriver = async ({ email, name, password }: AddDriverBody) => {
  const data = await api.post("api/driver", { email, password, name });
  return data.data;
};

export const deleteDriver = async (id: number | string) => {
  const data = await api.delete(`api/driver/${id}`);
  return data.data;
};

export const getDriver = async ({
  search,
  size,
  page,
}): Promise<{
  data: { id: number; email: string; name: string }[];
}> => {
  const data = await api.get(
    `/api/driver?search=${search}&size=${size}&page=${page}`
  );
  return data.data;
};
