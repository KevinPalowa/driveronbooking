export type TResponseData<T> = {
  meta: {
    status: number;
    message: string;
  };
  data?: T;
};
