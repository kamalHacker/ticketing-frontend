"use client";

import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";

export default function AgentDashboard() {
  const [assigned, setAssigned] = useState([]);
  const [unassigned, setUnassigned] = useState([]);
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
      const a = await api.get("/tickets/assigned");
      const u = await api.get("/tickets/unassigned");
      setAssigned(a.data);
      setUnassigned(u.data);
    }
    fetchData();
  }, []);

  const claim = async (id) => {
    await api.post(`/tickets/${id}/claim`);
    const a = await api.get("/tickets/assigned");
    const u = await api.get("/tickets/unassigned");
    setAssigned(a.data);
    setUnassigned(u.data);
  };

  return (
    <div>
      <Navbar role={role} />

      <div className="max-w-4xl p-6 mx-auto space-y-8">
        <h1 className="text-3xl font-semibold">Agent Dashboard</h1>

        {/* Assigned Tickets */}
        <div>
          <h2 className="mb-4 text-xl font-medium">Your Tickets</h2>
          <div className="space-y-4">

            {assigned.map((t) => (
              <Link key={t.id} href={`/agent/ticket/${t.id}`}>
                <div className="p-5 transition m-[10px] bg-gray-800 border border-gray-700 shadow cursor-pointer rounded-xl hover:border-indigo-500">
                  <h3 className="text-lg font-semibold hover:text-indigo-400">
                    {t.title}
                  </h3>
                </div>
              </Link>
            ))}

            {assigned.length === 0 && (
              <p className="italic text-gray-400">No assigned tickets.</p>
            )}
          </div>
        </div>

        {/* Unassigned Tickets */}
        <div>
          <h2 className="mb-4 text-xl font-medium">Unassigned Tickets</h2>
          <div className="space-y-4">
            {unassigned.map((t) => (
              <div
                key={t.id}
                className="p-5 space-y-3 bg-gray-800 border border-gray-700 shadow rounded-xl"
              >
                <h3 className="text-lg font-semibold hover:text-indigo-400">
                  <Link href={`/agent/ticket/${t.id}`}>{t.title}</Link>
                </h3>

                <button
                  onClick={() => claim(t.id)}
                  className="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-500"
                >
                  Claim
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
