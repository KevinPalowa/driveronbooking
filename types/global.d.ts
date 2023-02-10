export type TResponseData<T> = {
  meta: {
    status: number;
    message: string;
  };
  data?: T;
};

export type TBrowseData<T> = {
  meta: {
    totalData: number;
    totalPage: number;
  };
  data: T;
};

export type Role = "admin" | "employee" | "driver";

export type ErrorResponse = {
  message: string;
};
