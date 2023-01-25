export type RouteResponse = {
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
};

export type AddRouteBody = {
  destination: string;
  departureTime: string;
  capacity: number;
  estimation: string;
  driverId: number;
};
