export interface LoginResponse {
  id: number;
  email: string;
  name: string;
  role: "admin" | "employee" | "driver";
  token: string;
}
