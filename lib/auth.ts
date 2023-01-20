import { deleteCookie } from "cookies-next";

export function logout(){
deleteCookie('authToken')
}
