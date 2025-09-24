// utils/auth.ts
import Cookies from "js-cookie";

export const setToken = (key: string, data: string) => {
  const isSecure = window.location.protocol === 'https:';

  Cookies.set(key, data, {
    expires: 1,           // 1 day
    secure: isSecure,     // true for HTTPS, false for HTTP (localhost/LAN)
    sameSite: 'Lax',
    path: '/',
  });
};

export const getToken = (): string | undefined => {
  return Cookies.get("admin_token");
};

export const removeAuthToken = () => {
  Cookies.remove("admin_token");
};

export const logout = () => {
  Cookies.remove("admin_token", { path: "/" });
  window.location.href = "/administrator";
};
