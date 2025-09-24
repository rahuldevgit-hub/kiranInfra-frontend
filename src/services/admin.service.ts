// services/adminService.ts
import API from "./api";
import { AdminLoginResponse } from "@/types/admin";

export const AdminLogin = async (data: {
  email: string;
  password: string;
}): Promise<AdminLoginResponse> => {
  const response = await API.post("/admin/login", data);
  return response.data;
};

export const AdminProfile = async () => {
  const response = await API.get("/admin/profile");
  return response;
};