import type AddRouteBody from "./route.d.ts";
export type UserResponse = { id: number; email: string; name: string };
export type UserDetailResponse = UserResponse & {
  RouteRequested: {
    id: number;
    destination: string;
    estimation: string;
    capacity: number;
    departureTime: string;
    User: Omit<UserResponse, "email">;
    passenger: {
      approved: 0 | 1 | 2;
    }[];
    status: 0 | 1 | 2;
    Route: {
      id: number;
      destination: string;
      departureTime: string;
      capacity: number;
      estimation: string;
      driverId: number;
      User: { name: string };
    };
  }[];
  routes: {
    id: number;
    destination: string;
    departureTime: string;
    capacity: number;
    estimation: string;
    driverId: number;
  }[];
};
export type UserEditParams = {
  id: number;
  email: string;
  name: string;
};
