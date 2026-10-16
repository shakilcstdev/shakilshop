
"use client";

import { Menu } from "lucide-react";
import { useState } from "react";
import Sidebar from "./Sidebar";

const MobileMenu = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={toggleSidebar}
        aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
        aria-expanded={isSidebarOpen}
        className="inline-flex h-10 w-10 items-center justify-center rounded-md text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 md:hidden"
      >
        <Menu className="h-6 w-6" />
      </button>

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
      />
    </>
  );
};

export default MobileMenu;