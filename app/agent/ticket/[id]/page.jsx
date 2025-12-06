"use client";

import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import CommentList from "@/components/CommentList";
import CommentForm from "@/components/CommentForm";

export default function AgentTicketDetails() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
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
      setTicket(res.data);
      setLoading(false);
    }
    load();
  }, [id, refreshKey]);

  const updateStatus = async (status) => {
    await api.put(`/tickets/${id}/status`, { status });
    setRefreshKey(Date.now());
  };

  const updatePriority = async (priority) => {
    await api.put(`/tickets/${id}/priority`, { priority });
    setRefreshKey(Date.now());
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!ticket) return <div className="p-6">Ticket not found.</div>;

  return (
    <div>
      <Navbar role={role} />
      <div className="max-w-3xl p-6 mx-auto space-y-6">
        <Link href="/agent" className="text-indigo-400 hover:underline">
          ← Back to Tickets
        </Link>

        <div className="p-6 space-y-4 bg-gray-800 border border-gray-700 rounded-xl">
          <h1 className="text-3xl font-semibold">{ticket.title}</h1>
          <p className="text-gray-300">{ticket.description}</p>

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
        </div>

        <hr className="border-gray-700" />

        <h2 className="text-xl font-semibold">Comments</h2>
        <CommentList key={refreshKey} ticketId={id} />

        <CommentForm
          ticketId={id}
          onSuccess={() => setRefreshKey(Date.now())}
        />
      </div>
    </div>
  );
}
