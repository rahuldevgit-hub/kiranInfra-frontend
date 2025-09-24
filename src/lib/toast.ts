// src/lib/toast.ts
import toast from 'react-hot-toast';

export const showSuccess = (msg: string) => toast.success(msg);
export const showError = (msg: string) => toast.error(msg);
export const showLoading = (msg: string) => toast.loading(msg);
