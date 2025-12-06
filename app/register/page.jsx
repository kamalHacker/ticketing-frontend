"use client";

import { useState } from "react";
import { useToast } from "@/components/Toast";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import Link from "next/link";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const toast = useToast();
  const router = useRouter();


  const submit = async () => {
    try {
      await api.post("/auth/register", form);
    toast.show("✔ User registered! Please log in.", "success");
    setTimeout(() => {
      router.push("/login");
    }, 1200);

  } catch (e) {
    console.error("Registration failed:", e);
  }
  };

  return (
    <form className="flex flex-col max-w-md p-6 mx-auto space-y-6 bg-gray-800 border border-gray-700 justify-content my-[5vh] rounded-xl"
    onSubmit={(e) => {
      e.preventDefault();
      submit();
    }}
    >
      <h1 className="text-2xl font-semibold">Register User</h1>

      <input
        className="w-full p-3 bg-gray-900 border border-gray-700 rounded focus:ring focus:ring-indigo-500"
        placeholder="Name"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />

      <input
        className="w-full p-3 bg-gray-900 border border-gray-700 rounded focus:ring focus:ring-indigo-500"
        placeholder="Email"
        type="email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />

      <input
        className="w-full p-3 bg-gray-900 border border-gray-700 rounded focus:ring focus:ring-indigo-500"
        placeholder="Password"
        type="password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        required
      />

      <button
        className="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-500"
        type="submit"
      >
        Register
      </button>

      <p className="mt-2 text-center text-gray-400">
        Already have an account?{" "}
        <Link href="/login" className="text-indigo-400 hover:underline">
          Login
        </Link>
      </p>
    </form>
  );
}
