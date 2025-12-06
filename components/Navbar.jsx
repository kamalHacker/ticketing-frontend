"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar({ role }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  function logout() {
    localStorage.removeItem("token");
    document.cookie = "token=; Max-Age=0; path=/";
    router.push("/login");
  }

  return (
    <nav className="flex items-center justify-between w-full px-6 py-4 bg-gray-900 border-b border-gray-700">
      {/* App Name */}
      <div className="text-2xl font-semibold text-white">
        Ticketing System
      </div>

      {/* Right Section */}
      <div className="relative">
        {/* Profile Button */}
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center px-3 py-2 space-x-2 transition rounded-lg hover:bg-gray-800"
        >
          <span className="text-sm text-gray-300">{role}</span>

          {/* Profile Icon */}
          <div className="flex items-center justify-center w-8 h-8 text-white bg-gray-600 rounded-full">
            {role?.[0] || "U"}
          </div>
        </button>

        {/* Dropdown Menu */}
        {open && (
          <div className="absolute right-0 z-50 w-40 p-2 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl">

            <button
              onClick={logout}
              className="w-full px-3 py-2 text-left text-red-400 rounded hover:bg-gray-700"
            >
              Logout
            </button>

          </div>
        )}
      </div>
    </nav>
  );
}
