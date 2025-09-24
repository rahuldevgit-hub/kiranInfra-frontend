"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { LayoutDashboard, SlidersHorizontal, Cog, Search, Slack, Quote, MessageCircleQuestion } from "lucide-react";

const Navigation = () => {
  const pathname = usePathname();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Detect click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setActiveDropdown(null);
  }, [pathname]);

  // Get active menu for highlighting
  const getActiveMenuFromPath = () => {
    // if (pathname.includes("/dashboard")) return "dashboard";
    if (pathname.includes("/enquiry")) return "enquiry";
    if (pathname.includes("/seo")) return "seo";
    if (pathname.includes("/slider")) return "slider";
    if (pathname.includes("/static")) return "static";
    if (pathname.includes("/testimonials")) return "testimonials";
    if (pathname.includes("/clientlogo")) return "clientlogo";

    return null;
  };

  const activeMenu = getActiveMenuFromPath();

  const baseClasses =
    "flex items-center space-x-1 px-2 text-xs py-1 rounded-md transition-all";
  const getMenuClasses = (menu: string) =>
    `${baseClasses} ${activeMenu === menu
      ? "bg-blue-500 text-white !rounded-[8px]"
      : "text-blue-500 hover:underline"
    }`;

  const toggleDropdown = (menu: string) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="flex flex-wrap items-center p-4">
        <div
          className="flex flex-wrap items-center text-xs gap-2 hello"
          ref={dropdownRef}
        >
          {/* <Link
            href="/admin/dashboard"
            className={`${getMenuClasses("dashboard")}`}
          >
            <LayoutDashboard size={16}  strokeWidth={2.5} className="text-inherit" />
            <span>Dashboard</span>
            </Link> */}

          <Link href="/admin/enquiry" className={getMenuClasses("enquiry")} >
            <MessageCircleQuestion size={16} strokeWidth={3} className="text-inherit" />
            <span>Enquiry</span>
          </Link>

          <Link href="/admin/seo" className={getMenuClasses("seo")}>
            <Search size={16} strokeWidth={3} className="text-inherit" />
            <span>SEO</span>
          </Link>

          <Link href="/admin/static" className={getMenuClasses("static")}>
            <Cog size={16} strokeWidth={2.5} className="text-inherit" />
            <span>Static</span>
          </Link>

          <Link href="/admin/slider" className={getMenuClasses("slider")}>
            <SlidersHorizontal size={16} strokeWidth={2.5} className="text-inherit" />
            <span>Slider</span>
          </Link>

          <Link href="/admin/testimonials" className={getMenuClasses("testimonials")} >
            <Quote size={16} strokeWidth={2.5} className="text-inherit" />
            <span>Testimonials</span>
          </Link>

          <Link href="/admin/clientlogo" className={getMenuClasses("clientlogo")}>
            <Slack size={16} className="text-inherit" />
            <span>Client Logo</span>
          </Link>

        </div>
      </div>
    </nav>
  );
};

export default Navigation;
