"use client";

import { createContext, useState, useEffect, ReactNode } from "react";
import { AdminProfile } from "@/services/admin.service";
import { logout } from "@/lib/auth";

interface AdminContextType {
  id: number | null;
  name: string | null;
  loading: boolean;
  error: string | null;
  setAdmin: (id: number, name: string) => void;
}

export const AdminContext = createContext<AdminContextType>({
  id: null,
  name: null,
  loading: true,
  error: null,
  setAdmin: () => {},
});

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [id, setId] = useState<number | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    AdminProfile()
      .then((res) => {
        setId(res.data.result.id);
        setName(res.data.result.name);
      })
      .catch((err) => {
        if (err?.response?.data?.status === false) {
          logout(); // session expired or unauthorized
        } else {
          setError("Failed to load admin profile");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const setAdmin = (id: number, name: string) => {
    setId(id);
    setName(name);
  };

  return (
    <AdminContext.Provider value={{ id, name, loading, error, setAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};
