import { api } from "@/lib/axios";
import { TBrowseData } from "@/types/global";
import { RouteResponse } from "@/types/route";

type AddRouteBody = { email: string; name: string; password: string };
type Props = { search?: string; size?: number; page?: number };
export const addRoute = async ({ email, name, password }: AddRouteBody) => {
  const data = await api.post("api/route", { email, password, name });
  return data.data;
};

export const deleteRoute = async (id: number | string) => {
  const data = await api.delete(`api/route/${id}`);
  return data.data;
};

export const getRoutes = async ({
  search = "",
  size = 5,
  page = 1,
}: Props): Promise<TBrowseData<RouteResponse[]>> => {
  const data = await api.get(
    `/api/route?search=${search}&size=${size}&page=${page}`
  );
  console.log(data);

  return data.data;
};
