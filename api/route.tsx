import { api } from "@/lib/axios";
import { TBrowseData } from "@/types/global";
import { AddRouteBody, RouteDetail, RouteResponse } from "@/types/route";

type Props = { search?: string; size?: number; page?: number };
export const addRoute = async (params: AddRouteBody) => {
  const data = await api.post("api/route", { ...params });
  return data.data;
};

export const editRoute = async (id: number, params: AddRouteBody) => {
  const data = await api.patch(`api/route/${id}`, { ...params });
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

  return data.data;
};

export const getMyRoutes = async ({
  search = "",
  size = 5,
  page = 1,
  id = Number(),
}): Promise<TBrowseData<RouteResponse[]>> => {
  const data = await api.get(
    `/api/route/${id}?search=${search}&size=${size}&page=${page}`
  );

  return data.data;
};

export const getRouteById = async ({
  search = "",
  size = 5,
  page = 1,
  id = Number(),
}): Promise<TBrowseData<RouteDetail>> => {
  const data = await api.get(
    `/api/route/${id}?search=${search}&size=${size}&page=${page}`
  );

  return data.data;
};
