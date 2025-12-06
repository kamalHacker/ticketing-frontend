"use client";

import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import CommentList from "@/components/CommentList";
import CommentForm from "@/components/CommentForm";

export default function AdminTicketDetails() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(() => Date.now());

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
      const res = await api.get(`/tickets/${id}`);
      const a = await api.get("/admin/agents");

      setTicket(res.data);
      setAgents(a.data);
      setLoading(false);
    }
    load();
  }, [id, refreshKey]);

  const assign = async (agentId) => {
    await api.post(`/tickets/${id}/assign`, { agentId });
    setRefreshKey(Date.now());
  };

  const closeTicket = async () => {
    await api.put(`/tickets/${id}/close`);
    setRefreshKey(Date.now());
  };

  const updateStatus = async (status) => {
    await api.put(`/tickets/${id}/status`, { status });
    setRefreshKey(Date.now());
  };

  const updatePriority = async (priority) => {
    await api.put(`/tickets/${id}/priority`, { priority });
    setRefreshKey(Date.now());
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!ticket) return <div className="p-6">Not found</div>;

  return (
    <div>
      <Navbar role={role} />
      <div className="max-w-3xl p-6 mx-auto space-y-8">
        <Link href="/admin" className="text-indigo-400 hover:underline">
          ← Back to Dashboard
        </Link>

        <div className="p-6 space-y-4 bg-gray-800 border border-gray-700 rounded-xl">
          <h1 className="text-3xl font-semibold">{ticket.title}</h1>
          <p>{ticket.description}</p>

          <div className="space-y-2">
            <h3 className="font-medium">Status</h3>
            <select
              className="p-2 bg-gray-900 border border-gray-700 rounded"
              value={ticket.status}
              onChange={(e) => updateStatus(e.target.value)}
            >
              <option value="OPEN">OPEN</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="RESOLVED">RESOLVED</option>
              <option value="CLOSED">CLOSED</option>
            </select>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Priority</h3>
            <select
              className="p-2 bg-gray-900 border border-gray-700 rounded"
              value={ticket.priority}
              onChange={(e) => updatePriority(e.target.value)}
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </select>
          </div>

          <h3 className="font-medium">Assigned To:</h3>
          {!ticket.assignedTo ? (
            <select
              onChange={(e) => assign(e.target.value)}
              defaultValue=""
              className="p-2 bg-gray-900 border border-gray-700 rounded"
            >
              <option value="">Assign to agent</option>
              {agents.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.email})
                </option>
              ))}
            </select>
          ) : (
            <p>
              {ticket.assignedTo.name} ({ticket.assignedTo.email})
            </p>
          )}

          <hr className="border-gray-700" />

          <h2 className="text-xl font-semibold">Comments</h2>
          <CommentList key={refreshKey} ticketId={id} />
          <CommentForm
            ticketId={id}
            onSuccess={() => setRefreshKey(Date.now())}
          />

          <hr className="border-gray-700" />

          {ticket.status !== "CLOSED" ? (
            <button
              onClick={closeTicket}
              className="px-4 py-2 bg-red-600 rounded hover:bg-red-500"
            >
              Close Ticket
            </button>
          ) : (
            <p className="font-medium text-green-400">This ticket is closed.</p>
          )}
        </div>
      </div>
    </div>
  );
}
