import API from './api'
import { EnquiryAttributes } from '../types/enquiry'

export const viewEnquiry = async (id: string): Promise<EnquiryAttributes[]> => {
    const response = await API.post(`/admin/enquiry/view/${id}`);
    return response.data;
}

export const getEnquiries = async (
    page = 1,
    limit = 10,
): Promise<EnquiryAttributes[]> => {
    const response = await API.get("/admin/enquiry/view-all", {
        params: { page, limit },
    });
    return response.data;
};

export const createEnquiry = async (payload: EnquiryAttributes): Promise<EnquiryAttributes> => {
    const response = await API.post("/admin/enquiry/add", payload);
    return response.data;
};

export const updateEnquiry = async (
    id: string | number,
    payload: EnquiryAttributes,
): Promise<{ status: boolean; message?: string }> => {
    const response = await API.put(`/admin/enquiry/update/${id}`, payload);
    return response.data;
};

export const deleteEnquiry = async (id: number): Promise<void> => {
    await API.delete(`/admin/enquiry/delete/${id}`);
};

export const deleteMultipleEnquiry = async (ids: string[]): Promise<EnquiryAttributes[]> => {
    const response = await API.delete(`/admin/enquiry/delete-multiple`, { data: { ids } });
    return response.data;
};

export const updateEnquiryStatus = async (
    id: number,
    data: { status: string },
): Promise<EnquiryAttributes> => {
    const response = await API.put(`/admin/enquiry/update-status/${id}`, data);
    return response.data;
};

export const getAllCountries = async () => {
    const response = await API.get("/admin/country/find-all");
    return response;
};
