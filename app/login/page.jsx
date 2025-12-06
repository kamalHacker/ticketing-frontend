"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/Toast";


export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const toast = useToast();

  // Prevent logged-in users from seeing login page
  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const role = payload.role;
      const exp = payload.exp * 1000; // convert sec → ms

      // Token expired → force logout
      if (Date.now() > exp) {
        localStorage.removeItem("token");
        document.cookie = "token=; Max-Age=0; path=/";
        return;
      }

      // Valid token → redirect by role
      if (role === "ADMIN") router.push("/admin");
      else if (role === "SUPPORT_AGENT") router.push("/agent");
      else router.push("/user");
    } catch (e) {
      // corrupted token → remove & stay on login
      localStorage.removeItem("token");
      document.cookie = "token=; Max-Age=3600; path=/";
      console.error("Corrupted token:", e);
    }
  }, [router]);

  const submit = async () => {
    try {
    const res = await api.post("/auth/login", { email, password });
    const token = res.data.token;
    document.cookie = `token=${token}; path=/; SameSite=Lax`;

    localStorage.setItem("token", res.data.token);

    toast.show("✔ Login successful!", "success");

    const payload = JSON.parse(atob(res.data.token.split(".")[1]));
    const role = payload.role;

    if (role === "ADMIN") router.push("/admin");
    else if (role === "SUPPORT_AGENT") router.push("/agent");
    else router.push("/user");
  } catch (e){
    console.error("Login failed:", e);
  }
  };

return (
  <form
    className="flex flex-col max-w-md p-6 mx-auto my-10 space-y-6 bg-gray-800 border border-gray-700 rounded-xl"
    onSubmit={(e) => {
      e.preventDefault(); // prevent page reload
      submit();
    }}
  >
    <h1 className="text-2xl font-semibold">Login</h1>

    {/* EMAIL */}
    <input
      className="w-full p-3 bg-gray-900 border border-gray-700 rounded"
      placeholder="Email"
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      required
    />

    {/* PASSWORD */}
    <div className="relative">
      <input
        className="w-full p-3 pr-12 bg-gray-900 border border-gray-700 rounded"
        placeholder="Password"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute text-gray-400 -translate-y-1/2 right-3 top-1/2 hover:text-gray-200"
      >
        {showPassword ? "🙈" : "👁️"}
      </button>
    </div>

    <button
      type="submit"
      className="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-500"
    >
      Login
    </button>

    {/* Register Link */}
    <p className="text-center text-gray-400">
      Don’t have an account?{" "}
      <a href="/register" className="text-indigo-400 hover:underline">
        Register
      </a>
    </p>
  </form>
);
}