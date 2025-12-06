"use client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  function logout() {
    localStorage.removeItem("token");     // remove JWT
    document.cookie = "token=; Max-Age=0; path=/"; // remove cookie if used
    router.push("/login");                // go to login page
  }

  return (
    <button
      onClick={logout}
      className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-500"
    >
      Logout
    </button>
  );
}
