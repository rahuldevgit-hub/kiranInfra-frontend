import API from "./api";
import { Static } from "@/types/static";

export const getStaticById = async (id: string): Promise<Static[]> => {
  const response = await API.post(`/admin/static/view/${id}`);
  return response.data;
};

export const findStaticByTitle = async (title: string): Promise<Static[]> => {
  const response = await API.post(`/admin/static/view-by/${title}`);
  return response.data;
};

export const getAllStatics = async (
  page = 1,
  limit = 10,
): Promise<Static[]> => {
  const response = await API.get("/admin/static/view-all", {
    params: { page, limit },
  });
  return response.data;
};

export const createStatic = async (payload: Static): Promise<Static> => {
  const response = await API.post("/admin/static/add", payload);
  return response.data;
};

export const updateStatic = async (
  id: string | number,
  payload: Static,
): Promise<{ status: boolean; message?: string }> => {
  const response = await API.put(`/admin/static/update/${id}`, payload);
  return response.data;
};

export const deleteStatic = async (id: number): Promise<void> => {
  await API.delete(`/admin/static/delete/${id}`);
};

export const updateStaticStatus = async (
  id: number,
  data: { status: string },
): Promise<Static> => {
  const response = await API.put(`/admin/static/status-update/${id}`, data);
  return response.data;
};

// export const searchStatics = async (
//   page = 1,
//   limit = 10,
//   searchQuery: string,
// ): Promise<Static[]> => {
//   const response = await API.get("/admin/Statics/search", {
//     params: { page, limit, searchQuery },
//   });
//   return response.data;
// };
