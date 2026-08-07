"use client";

import { Job, STATUSES } from "../types";

interface JobCardProps {
  job: Job;
  onMove: (id: string, direction: "prev" | "next") => void;
  onDelete: (id: string) => void;
}

export default function JobCard({ job, onMove, onDelete }: JobCardProps) {
  const statusIndex = STATUSES.indexOf(job.status);
  const canMoveBack = statusIndex > 0;
  const canMoveForward = statusIndex < STATUSES.length - 1;

  return (
    <div className="bg-surface-sunken border border-border-default rounded-md p-3 mb-3 shadow-sm hover:shadow transition-shadow @container">
      <div className="flex justify-between items-start gap-2">
        <div className="min-w-0">
          <p className="font-medium text-text-primary truncate">{job.company}</p>
          <p className="text-sm text-text-tertiary truncate">{job.role}</p>
        </div>
        <button
          onClick={() => onDelete(job.id)}
          aria-label="Delete job"
          className="hidden @[140px]:block text-text-faint hover:text-accent-danger text-sm leading-none shrink-0"
        >
          ✕
        </button>
      </div>

      {job.link && (
        <a
          href={job.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-accent-link hover:underline block mt-1 truncate"
        >
          {job.link}
        </a>
      )}

      {job.notes && (
        <p className="text-xs text-text-tertiary mt-1 line-clamp-2">{job.notes}</p>
      )}

      <div className="flex justify-between items-center mt-2">
        <span className="text-[11px] text-text-muted">
          {new Date(job.dateAdded).toLocaleDateString()}
        </span>
        <div className="hidden @[160px]:flex gap-1">
          <button
            onClick={() => onMove(job.id, "prev")}
            disabled={!canMoveBack}
            className="text-xs px-2 py-0.5 rounded border border-border-default text-text-tertiary disabled:opacity-30 hover:bg-surface-hover"
          >
            ←
          </button>
          <button
            onClick={() => onMove(job.id, "next")}
            disabled={!canMoveForward}
            className="text-xs px-2 py-0.5 rounded border border-border-default text-text-tertiary disabled:opacity-30 hover:bg-surface-hover"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
