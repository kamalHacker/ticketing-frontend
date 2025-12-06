"use client";

import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { useToast } from "@/components/Toast";
import Link from "next/link";
import api from "@/lib/api";

export default function AdminDashboard() {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [agents, setAgents] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  const toast = useToast();

  const [agentForm, setAgentForm] = useState({
    name: "",
    email: "",
    password: "",
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
    async function load() {
      const t = await api.get("/admin/tickets");
      const u = await api.get("/admin/users");
      const a = await api.get("/admin/agents");

      setTickets(t.data);
      setUsers(u.data);
      setAgents(a.data);
    }
    load();
  }, []);

  const createAgent = async () => {
    await api.post("/auth/admin/create-agent", agentForm);
    alert("Support Agent Created!");

    setAgentForm({ name: "", email: "", password: "" });

    const a = await api.get("/admin/agents");
    setAgents(a.data);
  };

  const deleteUser = async (id) => {
    try {
      await api.delete(`/admin/users/${id}`);
      toast.show("✔ User deleted", "success");
      
      const u = await api.get("/admin/users");
      setUsers(u.data);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const updateRole = async (id, role) => {
    await api.post(`/admin/users/${id}/role`, { role });
    const updated = await api.get("/admin/users");
    setUsers(updated.data);
  };

  const assign = async (ticketId, agentId) => {
    await api.post(`/tickets/${ticketId}/assign`, { agentId });
    const updated = await api.get("/admin/tickets");
    setTickets(updated.data);

    alert("Ticket Assigned / Reassigned!");
  };

  return (
    <div>
      <Navbar role={role} />

      <div className="max-w-5xl p-6 mx-auto space-y-10">
        <h1 className="text-3xl font-semibold">Admin Dashboard</h1>

        {/* Create Agent */}
        <div className="p-6 space-y-3 bg-gray-800 border border-gray-700 rounded-xl">
          <h2 className="text-xl font-medium">Create Support Agent</h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <input
              className="p-3 bg-gray-900 border border-gray-700 rounded"
              placeholder="Name"
              value={agentForm.name}
              onChange={(e) =>
                setAgentForm({ ...agentForm, name: e.target.value })
              }
            />

            <input
              className="p-3 bg-gray-900 border border-gray-700 rounded"
              placeholder="Email"
              value={agentForm.email}
              onChange={(e) =>
                setAgentForm({ ...agentForm, email: e.target.value })
              }
            />

            <div className="relative">
              <input
                className="p-3 bg-gray-900 border border-gray-700 rounded"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={agentForm.password}
                onChange={(e) =>
                  setAgentForm({ ...agentForm, password: e.target.value })
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute text-gray-400 -translate-y-1/2 right-3 top-1/2 hover:text-gray-200"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button
            onClick={createAgent}
            className="px-4 py-2 mt-2 bg-indigo-600 rounded hover:bg-indigo-500"
          >
            Create Agent
          </button>
        </div>

        {/* Users Section */}
        <div className="space-y-3">
          <h2 className="text-xl font-medium">All Users</h2>

          {users.map((u) => (
            <div
              key={u.id}
              className="flex items-center justify-between p-4 bg-gray-800 border border-gray-700 rounded-xl"
            >
              <p>
                {u.name} – {u.email} ({u.role})
              </p>

              <div className="flex items-center gap-3">
                {/* Role Dropdown */}
                <select
                  value={u.role}
                  onChange={(e) => updateRole(u.id, e.target.value)}
                  className="p-2 bg-gray-900 border border-gray-700 rounded"
                >
                  <option value="USER">USER</option>
                  <option value="SUPPORT_AGENT">SUPPORT_AGENT</option>
                  <option value="ADMIN">ADMIN</option>
                </select>

                {/* Delete Button */}
                <button
                  onClick={() => deleteUser(u.id)}
                  className="px-3 py-1 bg-red-600 rounded hover:bg-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Tickets Section */}
        <div>
          <h2 className="mb-4 text-xl font-medium">All Tickets</h2>

          <div className="space-y-4">
            {tickets.map((t) => (
              <div
                key={t.id}
                className="p-5 space-y-2 bg-gray-800 border border-gray-700 rounded-xl"
              >
                <Link
                  href={`/admin/ticket/${t.id}`}
                  className="text-lg font-semibold text-indigo-400 hover:underline"
                >
                  {t.title}
                </Link>

                <p>Status: {t.status}</p>
                <p>Created By: {t.createdBy.name}</p>

                <p>
                  Assigned To:{" "}
                  {t.assignedTo ? (
                    <b>
                      {t.assignedTo.name} ({t.assignedTo.email})
                    </b>
                  ) : (
                    <i className="text-gray-400">Unassigned</i>
                  )}
                </p>

                {/* ALWAYS SHOW DROPDOWN — supports assign & reassign */}
                <select
                  onChange={(e) => assign(t.id, e.target.value)}
                  defaultValue={t.assignedTo?.id || ""}
                  className="p-2 bg-gray-900 border border-gray-700 rounded"
                >
                  <option value="">Assign / Reassign Agent</option>

                  {agents.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.email})
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
