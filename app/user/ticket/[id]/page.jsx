"use client";

import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import CommentList from "@/components/CommentList";
import CommentForm from "@/components/CommentForm";
import Link from "next/link";

export default function TicketDetailsPage() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentsKey, setCommentsKey] = useState(Date.now());
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
    if (!id) return;
    async function load() {
      try {
        setLoading(true);
        const res = await api.get(`/tickets/${id}`);
        setTicket(res.data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, commentsKey]);

  if (loading) return <div className="p-6">Loading ticket…</div>;
  if (!ticket) return <div className="p-6">Ticket not found.</div>;

  return (
    <div>
      <Navbar role={role} />
      <div className="max-w-3xl p-6 mx-auto space-y-6">
        <Link href="/user" className="text-indigo-400 hover:underline">
          ← Back to My Tickets
        </Link>

        <div className="p-6 space-y-4 bg-gray-800 border border-gray-700 rounded-xl">
          <h1 className="text-3xl font-semibold">{ticket.title}</h1>

          <p>
            <strong>Status:</strong> {ticket.status}
          </p>
          <p>
            <strong>Priority:</strong> {ticket.priority}
          </p>

          <p className="whitespace-pre-wrap">{ticket.description}</p>

          <div>
            <h3 className="text-lg font-medium">Created by</h3>
            <p className="text-gray-300">
              {ticket.createdBy?.name} — {ticket.createdBy?.email}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium">Assigned to</h3>
            {ticket.assignedTo ? (
              <p>
                {ticket.assignedTo.name} — {ticket.assignedTo.email}
              </p>
            ) : (
              <p className="italic text-gray-400">Unassigned</p>
            )}
          </div>
        </div>

        <hr className="border-gray-700" />

        <h2 className="text-xl font-semibold">Comments</h2>

        <CommentList key={commentsKey} ticketId={id} />

        <CommentForm
          ticketId={id}
          onSuccess={() => setCommentsKey(Date.now())}
        />
      </div>
    </div>
  );
}
