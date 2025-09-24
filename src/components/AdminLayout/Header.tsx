"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, User } from "lucide-react";
import Navigation from "@/components/ui/Navigation";
import { logout, removeAuthToken } from "@/lib/auth";
import { AdminProfile } from '../../services/admin.service'

const Header = () => {
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [id, setId] = useState(0);
  const [name, setName] = useState(null);

  const profileRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    AdminProfile()
      .then((res) => {
        setId(res.data.result.id);
        setName(res.data.result.name);
      })
      .catch((err) => {
        if (err?.response?.data?.status === false) {
          logout();
        }
      });
  }, [router]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="bg-[#293042] text-xs p-4 border-b">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img
              src="/assest/image/logo_white.jpg"
              className="h-12"
              alt="Logo"
            />
          </div>
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 text-blue-600"
            >
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <span className="text-white outline-none hover:underline hover:decoration-white">
                {name}
              </span>
              <ChevronDown size={16} className="text-white" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
                <div className="py-2">
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm hover:bg-blue-500 text-gray-900"
                    onClick={(e) => {
                      e.preventDefault(); // ✅ stop the # navigation
                      router.push(`/admin/myaccount/edit?id=${id}`);
                      setIsProfileOpen(false);
                    }}
                  >
                    My Account
                  </a>

                  <a
                    href="#"
                    onClick={logout}
                    className="block px-4 py-2 text-sm hover:bg-blue-500 text-gray-900"
                  >
                    Logout
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      <Navigation />
    </>
  );
};

export default Header;
