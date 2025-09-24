import API from "./api";
import { ClientLogo } from "@/types/clientlogo";

export const getClientLogoById = async (id: string): Promise<ClientLogo[]> => {
  const response = await API.post(`/admin/clientlogo/view/${id}`);
  return response.data;
};
export interface PaginatedCustomerResult {
  result: {
    data: ClientLogo[];
    limit: number;
    page: number;
    total: number;
    totalPages: number;
  };
}

export const getAllClientLogos = async (
  page = 1,
  limit = 10,
): Promise<PaginatedCustomerResult> => {
  const response = await API.get("/admin/clientlogo/view-all", {
    params: { page, limit },
  });
  return response.data;
};

export const createClientLogo = async (data: FormData): Promise<ClientLogo> => {
  const response = await API.post("/admin/clientlogo/add", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateClientLogo = async (
  id: string,
  data: FormData,
): Promise<{ status: boolean; message?: string }> => {
  const response = await API.put(`/admin/clientlogo/update/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteClientLogo = async (id: number): Promise<void> => {
  await API.delete(`/admin/clientlogo/delete/${id}`);
};

export const updateClientLogoStatus = async (
  id: number,
  data: { status: string },
): Promise<ClientLogo> => {
  const response = await API.put(`/admin/clientlogo/status-update/${id}`, data);
  return response.data;
};
