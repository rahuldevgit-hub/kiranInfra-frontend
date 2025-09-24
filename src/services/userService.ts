import API from './api';
import { User } from '@/types/user';

export const getAllUsers = async (page = 1, limit = 10): Promise<any> => {
  const response = await API.get('/admin/user/view-all', {
    params: { page, limit },
  });
  return response.data;
};

export const getAllAdmins = async (page = 1, limit = 10): Promise<any> => {
  const response = await API.get('/admin/user/view-all-admin', {
    params: { page, limit },
  });
  return response.data;
};

export const searchUsers = async (page = 1, limit = 10, searchQuery = ""): Promise<any> => {
  const response = await API.get('/admin/user/search', {
    params: { page, limit, searchQuery },
  });
  return response.data;
};

export const createUser = async (data: FormData): Promise<any> => {
  // All fields from UserFormData can be appended to FormData, including nullables
  const response = await API.post('/admin/user/add', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateUser = async (
  id: string,
  data: any
): Promise<{ status: boolean; message?: string }> => {
  // All fields from UserFormData can be appended to FormData, including nullables
  const response = await API.put(`/admin/user/update/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await API.delete(`/admin/user/delete/${id}`);
};

export const updateStatusUser = async (
  id: string,
  data: { status: string }
): Promise<User> => {
  const response = await API.put(`/admin/user/status/${id}`, data);
  return response.data;
};

export const getUserById = async (id: string): Promise<{ result: User }> => {
  const response = await API.get(`/admin/user/details/${id}`);
  return response.data;
};