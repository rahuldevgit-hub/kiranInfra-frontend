"use client";

import { createContext, useState, useEffect, ReactNode } from "react";
import { AdminProfile } from "@/services/admin.service";
import { logout } from "@/lib/auth";

interface AdminContextType {
  id: number | null;
  name: string | null;
  setAdmin: (id: number, name: string) => void;
  loading: boolean;
}

export const AdminContext = createContext<AdminContextType>({
  id: null,
  name: null,
  setAdmin: () => {},
  loading: true,
});

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [id, setId] = useState<number | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true; // prevent state update after unmount
    AdminProfile()
      .then((res) => {
        if (!mounted) return;
        setId(res.data.result.id);
        setName(res.data.result.name);
      })
      .catch((err) => {
        if (err?.response?.data?.status === false) {
          logout();
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []); // empty dependency -> runs only once

  const setAdmin = (id: number, name: string) => {
    setId(id);
    setName(name);
  };

  return (
    <AdminContext.Provider value={{ id, name, setAdmin, loading }}>
      {children}
    </AdminContext.Provider>
  );
};
