"use client";

import {
  BadgeInfo, Landmark, FileText, HomeIcon, SettingsIcon, TrophyIcon,
  MenuIcon, XIcon, ChevronDownIcon, PhoneIcon, MailIcon,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import formatPhoneNumber from "@/components/formatNumber";
import { getAllAdmins } from "@/services/userService";
import { usePathname } from "next/navigation";
const navItems = [
  {
    type: "link",
    label: "HOME",
    to: "/",
    icon: <HomeIcon className="w-4 h-4" />,
  },
  {
    type: "dropdown",
    label: "ABOUT US",
    items: [
      { to: "/company-profile", text: "Company Profile" },
      { to: "/mission-vision-value", text: "Mission, Vision, Value" },
      { to: "/important-landmarks", text: "Important Landmark" },
    ],
    icon: <BadgeInfo className="w-4 h-4" />,
  },
  {
    type: "dropdown",
    label: "OPERATION AREAS",
    icon: <SettingsIcon className="w-4 h-4" />,
    items: [
      { to: "/signaling", text: "Trunkey Project" },
      { to: "/our-manufacturing", text: "Our Manufacturing" },
      { to: "/approvals", text: "Approvals" },
    ],
  },
  {
    type: "link",
    label: "AWARDS & CREDITS",
    to: "/award-credits",
    icon: <TrophyIcon className="w-4 h-4" />,
  },
  {
    type: "link",
    label: "FINANCIALS",
    to: "/financials",
    icon: <Landmark className="w-4 h-4" />,
  },
  {
    type: "dropdown",
    label: "WORK EXECUTED",
    items: [
      { to: "/work-in-hand", text: "Work in Hand" },
      { to: "/completed-projects", text: "Completed Projects" },
      { to: "/our-associates", text: "Our Associates" },
      { to: "/kcpl", text: "KCPL" },
      { to: "/tppl", text: "TPPL" },
    ],
    icon: <FileText className="w-4 h-4" />,
  },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const [allData, setAllData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [savedPhone, setSavedPhone] = useState("+91-141-2331030");
  const [savedEmail, setSavedEmail] = useState("kapil.g@kiraninfra.com");

  // Fetch data once on mount
  const fetchData = async () => {
    if (allData.length > 0) return; // skip if already fetched

    setLoading(true);
    try {
      const res = await getAllAdmins();
      const result = res?.result;
      const data: any[] = Array.isArray(result?.data) ? result.data : [];
      setAllData(data);

      // Save phone/email to localStorage if data exists
      if (data.length > 0 && typeof window !== "undefined") {
        const phone = data[0]?.phone || "";
        const email = data[0]?.email || "";
        localStorage.setItem("contact", phone);
        localStorage.setItem("email", email);
        setSavedPhone(phone);
        setSavedEmail(email);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
     if (typeof window !== "undefined") {
      setSavedPhone(localStorage.getItem("contact") || "");
      setSavedEmail(localStorage.getItem("email") || "");
    }
  }, []);

  const toggleDropdown = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest(".dropdown-wrapper")) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const Dropdown = ({
    label,
    icon,
    items,
  }: {
    label: string;
    icon?: any;
    items: { to: string; text: string }[];
  }) => (
    <div className="relative dropdown-wrapper">
      <Button
        onClick={() => toggleDropdown(label)}
        aria-expanded={openDropdown === label}
        className="relative flex items-center gap-2 font-medium text-xs py-3 px-3
    bg-[#373d4b] text-white
    after:content-[''] after:absolute after:left-0 after:bottom-0 
    after:h-[3px] after:bg-red-500 
    after:transition-all after:duration-300 
    after:w-full  hover:after:bg-black hover:bg-red-700"
      >
        {icon}
        {label}
        <ChevronDownIcon
          className={`w-4 h-4 transform transition-transform ${openDropdown === label ? "rotate-180" : ""
            }`}
        />
      </Button>
      {openDropdown === label && (
        <div className="absolute top-full mt-2 bg-[#373d4b] shadow-lg min-w-[200px] z-50">
          <ul className="py-2">
            {items.map((item) => (
              <li key={item.to}>
                <Link
                  href={item.to}
                  className={`block px-4 py-2 text-xs transition-colors ${pathname === item.to ? "bg-red-600 text-white" : "text-white"
                    } hover:bg-red-700`}
                >
                  {item.text}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  const MobileDropdown = ({
    label,
    items,
  }: {
    label: string;
    items: { to: string; text: string }[];
  }) => (
    <div className="border-b border-white dropdown-wrapper">
      <Button
        onClick={() => toggleDropdown(label)}
        aria-expanded={openDropdown === label}
        className="flex justify-between items-center bg-[#373d4b] w-full text-left text-white font-medium py-2"
      >
        {label}
        <ChevronDownIcon
          className={`w-4 h-4 transform transition-transform ${openDropdown === label ? "rotate-180" : ""
            }`}
        />
      </Button>
      {openDropdown === label && (
        <div className="pl-4 pb-2">
          {items.map((item) => (
            <Link
              key={item.to}
              href={item.to}
              className={`block py-1 text-sm ${pathname === item.to ? "text-red-400 font-semibold" : "text-white"
                }`}
            >
              {item.text}
            </Link>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <header className="w-full shadow-md bg-white fixed top-0 z-50">
      {/* Top bar with logo & contact */}
      <div className="max-w-7xl mx-auto flex items-center justify-between py-3 px-4">
        <Link href="/" className="flex items-center">
          <img
            src="https://c.animaapp.com/mfi46rftm3XGAO/img/kiran-infra-1-9.png"
            alt="Kiran infra"
            className="h-12 w-auto object-contain"
          />
        </Link>

        {/* Contact info (desktop only) */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-800">
          <div className="flex items-center gap-2">
            <PhoneIcon className="w-4 h-4 text-red-600" />
            <Link href={`tel:${savedPhone}`} className="hover:text-red-600">
              {formatPhoneNumber(savedPhone)}
            </Link>
            {/* <Link href={`tel:+91-141-2331030`} className="hover:text-red-600">
              +91-141-2331030
            </Link> */}
          </div>
          <div className="flex items-center gap-2">
            <MailIcon className="w-4 h-4 text-red-600" />
            <Link href={`mailto:${savedEmail}`} className="hover:text-red-600">
              {savedEmail}
            </Link>
            {/* <Link href={`mailto:kapil.g@kiraninfra.com`} className="hover:text-red-600">
              kapil.g@kiraninfra.com
            </Link> */}
          </div>
        </div>

        {/* Mobile menu Button */}
        <Button
          className="md:hidden text-black"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? (
            <XIcon className="w-6 h-6" />
          ) : (
            <MenuIcon className="w-6 h-6" />
          )}
        </Button>
      </div>

      {/* Desktop nav */}
      <nav className="hidden md:flex justify-center gap-6 py-2">
        {navItems.map((item) =>
          item.type === "link" ? (
            <Link
              key={item.label}
              href={item.to!}
              className={`relative flex items-center gap-2 font-medium text-xs py-3 px-3
    bg-[#373d4b] text-white
    after:content-[''] after:absolute after:left-0 after:bottom-0 
    after:h-[3px] after:bg-red-500 
    after:transition-all after:duration-300 
    after:w-full  hover:after:bg-black hover:bg-red-700
    ${pathname === item.to ? "bg-red-600" : "bg-[#373d4b]"}
  `}
            >
              {item.icon}
              {item.label}
            </Link>
          ) : (
            <Dropdown
              key={item.label}
              label={item.label}
              icon={item.icon}
              items={item.items!}
            />
          )
        )}
      </nav>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden bg-[#373d4b] px-4 py-3 space-y-3 text-white">
          <div className="space-y-2 border-b border-white pb-3">
            <div className="flex items-center gap-2">
              <PhoneIcon className="w-4 h-4 text-red-500" />
              <Link href="tel:+919876543210" className="hover:text-red-400 text-sm">
                +91-141-2331030
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <MailIcon className="w-4 h-4 text-red-500" />
              <Link
                href="mailto:info@example.com"
                className="hover:text-red-400 text-sm"
              >
                info@example.com
              </Link>
            </div>
          </div>

          {navItems.map((item) =>
            item.type === "link" ? (
              <Link
                key={item.label}
                href={item.to!}
                className={`block py-2 ${pathname === item.to
                  ? "text-red-400 font-semibold"
                  : "text-white"
                  }`}
              >
                {item.label}
              </Link>
            ) : (
              <MobileDropdown
                key={item.label}
                label={item.label}
                items={item.items!}
              />
            )
          )}
        </div>
      )}
    </header>
  );
};