"use client";

import { useState } from "react";
import api from "@/lib/api";

export default function CommentForm({ ticketId, onSuccess }) {
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e?.preventDefault();
    if (!text.trim()) {
      setError("Please enter a comment.");
      return;
    }
    setSubmitting(true);
    setError("");

    try {
      await api.post(`/tickets/${ticketId}/comment`, { text });
      setText("");
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Failed to post comment", err);
      setError(err?.response?.data?.message || "Failed to post comment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="mt-4 space-y-3">
      
      {/* Textarea */}
      <textarea
        className="w-full p-3 placeholder-gray-500 bg-gray-900 border border-gray-700 rounded-lg focus:ring focus:ring-indigo-500"
        placeholder="Write a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
      />

      {/* Error message */}
      {error && (
        <div className="text-sm text-red-400">{error}</div>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={submitting}
        className={`px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 
                    disabled:opacity-50 disabled:cursor-not-allowed transition`}
      >
        {submitting ? "Posting…" : "Post Comment"}
      </button>
    </form>
  );
}
