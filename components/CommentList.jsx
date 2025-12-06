"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function CommentList({ ticketId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ticketId) return;

    async function loadComments() {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const res = await api.get(`/tickets/${ticketId}/comments`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setComments(res.data);
      } catch (err) {
        console.error("Failed loading comments", err);
      } finally {
        setLoading(false);
      }
    }

    loadComments();
  }, [ticketId]);

  if (loading) return <div>Loading comments…</div>;
  if (comments.length === 0)
    return <div className="italic text-gray-400">No comments yet.</div>;

  return (
    <div className="space-y-4">
      {comments.map((c) => (
        <div key={c.id} className="p-4 bg-gray-800 border border-gray-700 shadow rounded-xl">
          <div className="mb-2 text-sm">
            <strong>{c.user?.name || c.user?.email || "Unknown"}</strong>
            <span className="ml-2 text-gray-400">
              {new Date(c.createdAt).toLocaleString()}
            </span>
          </div>
          <div className="text-gray-200 whitespace-pre-wrap">{c.text}</div>
        </div>
      ))}
    </div>
  );
}
