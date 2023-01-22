import axios from "axios";
import { getCookie } from "cookies-next";

const api = axios.create();

api.interceptors.request.use(
  async (config) => {
    const token = getCookie("token");
    config.headers = {
      Authorization: `${token}`,
    };
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);
export { api };
