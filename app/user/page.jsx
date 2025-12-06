"use client";

import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";

export default function UserDashboard() {
  const [tickets, setTickets] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
  });

  const [role, setRole] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    Promise.resolve().then(() => {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setRole(payload.role);
    });
  }, []);

  useEffect(() => {
    async function fetchData() {
      const res = await api.get("/tickets/my");
      setTickets(res.data);
    }
    fetchData();
  }, []);

  const createTicket = async () => {
    await api.post("/tickets", {
      title: form.title,
      description: form.description,
      priority: form.priority,
    });
    const updated = await api.get("/tickets/my");
    setTickets(updated.data);
    setForm({ title: "", description: "" });
  };

  return (
    <div>
      <Navbar role={role} />
      <div className="max-w-3xl p-6 mx-auto space-y-8">
        <h1 className="text-3xl font-semibold">User Dashboard</h1>

        {/* Create Ticket */}
        <div className="p-6 space-y-4 bg-gray-800 border border-gray-700 shadow rounded-xl">
          <h2 className="text-xl font-medium">Create Ticket</h2>

          <input
            className="w-full p-3 bg-gray-900 border border-gray-700 rounded focus:ring focus:ring-indigo-500"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <textarea
            className="w-full p-3 bg-gray-900 border border-gray-700 rounded focus:ring focus:ring-indigo-500"
            placeholder="Description"
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <select
            className="w-full p-3 bg-gray-900 border border-gray-700 rounded focus:ring focus:ring-indigo-500"
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
          >
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
          </select>

          <button
            className="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-500"
            onClick={createTicket}
          >
            Create
          </button>
        </div>

        {/* Ticket List */}
        <div className="space-y-4">
          <h2 className="text-xl font-medium">Your Tickets</h2>

          {tickets.map((t) => (
            <div
              key={t.id}
              className="p-5 transition bg-gray-800 border border-gray-700 shadow rounded-xl hover:border-indigo-500"
            >
              <h3 className="text-lg font-semibold">
                <Link
                  href={`/user/ticket/${t.id}`}
                  className="hover:text-indigo-400"
                >
                  {t.title}
                </Link>
              </h3>
              <p className="text-gray-300">{t.description}</p>
              <p className="mt-2 text-sm text-gray-400">Status: {t.status}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
