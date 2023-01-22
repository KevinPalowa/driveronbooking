import { api } from "@/lib/axios";

type AddEmployeeBody = { email: string; name: string; password: string };
export const addEmployee = async ({
  email,
  name,
  password,
}: AddEmployeeBody) => {
  const data = await api.post("api/employee", { email, password, name });
  return data.data;
};

export const deleteEmployee = async (id: number | string) => {
  const data = await api.delete(`api/driver/${id}`);
  return data.data;
};

export const getEmployees = async ({ search = "", size = 5, page = 1 }) => {
  const data = await api.get(
    `/api/employee?search=${search}&size=${size}&page=${page}`
  );

  return data.data;
};
