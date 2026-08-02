"use client";

import { useState } from "react";
import { Job, JobStatus } from "../types";

interface AddJobModalProps {
  defaultStatus: JobStatus;
  onClose: () => void;
  onAdd: (job: Job) => void;
}

export default function AddJobModal({
  defaultStatus,
  onClose,
  onAdd,
}: AddJobModalProps) {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [link, setLink] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !role.trim()) return;

    onAdd({
      id: crypto.randomUUID(),
      company: company.trim(),
      role: role.trim(),
      link: link.trim() || undefined,
      notes: notes.trim() || undefined,
      status: defaultStatus,
      dateAdded: new Date().toISOString(),
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-surface-raised rounded-lg shadow-xl p-6 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-semibold text-text-primary mb-4">
          Add job to {defaultStatus}
        </h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            autoFocus
            type="text"
            placeholder="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="border border-border-input bg-surface-raised text-text-primary placeholder:text-text-muted rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring-focus"
          />
          <input
            type="text"
            placeholder="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border border-border-input bg-surface-raised text-text-primary placeholder:text-text-muted rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring-focus"
          />
          <input
            type="url"
            placeholder="Job posting link (optional)"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="border border-border-input bg-surface-raised text-text-primary placeholder:text-text-muted rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring-focus"
          />
          <textarea
            placeholder="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="border border-border-input bg-surface-raised text-text-primary placeholder:text-text-muted rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring-focus resize-none"
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-sm text-text-tertiary hover:text-text-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 text-sm bg-accent-primary text-text-on-accent rounded hover:bg-accent-primary-hover"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
