"use client";

import { useEffect, useState } from "react";
import { Job, JobStatus, STATUSES } from "./types";
import JobCard from "./components/JobCard";
import AddJobModal from "./components/AddJobModal";

const STORAGE_KEY = "roleflow.jobs";

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [modalStatus, setModalStatus] = useState<JobStatus | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setJobs(JSON.parse(raw));
    } catch {
      // ignore corrupted storage
    } finally {
      setLoaded(true);
    }
  }, []);

  // Persist on every change (skip the initial empty write before load completes)
  useEffect(() => {
    if (!loaded) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
  }, [jobs, loaded]);

  const handleAdd = (job: Job) => {
    setJobs((prev) => [...prev, job]);
  };

  const handleDelete = (id: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== id));
  };

  const handleMove = (id: string, direction: "prev" | "next") => {
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id !== id) return j;
        const idx = STATUSES.indexOf(j.status);
        const newIdx = direction === "next" ? idx + 1 : idx - 1;
        if (newIdx < 0 || newIdx >= STATUSES.length) return j;
        return { ...j, status: STATUSES[newIdx] };
      })
    );
  };

  return (
    <main className="flex-1 bg-surface-page">
      <header className="px-8 pt-8 pb-4">
        <h1 className="text-xl font-semibold text-text-primary">Roleflow</h1>
        <p className="text-sm text-text-tertiary">
          {jobs.length} job{jobs.length === 1 ? "" : "s"} tracked
        </p>
      </header>

      <div className="flex gap-4 px-8 pb-8 items-start">
        {STATUSES.map((status) => {
          const columnJobs = jobs.filter((j) => j.status === status);
          return (
            <div
              key={status}
              className="flex-1 bg-surface-raised rounded-lg shadow p-4 min-w-0"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-text-secondary">{status}</h2>
                <span className="text-xs text-text-muted">
                  {columnJobs.length}
                </span>
              </div>

              {columnJobs.length === 0 && (
                <div className="text-sm text-text-muted mb-3">No cards yet</div>
              )}

              {columnJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onMove={handleMove}
                  onDelete={handleDelete}
                />
              ))}

              <button
                onClick={() => setModalStatus(status)}
                className="w-full text-sm text-text-muted hover:text-text-secondary border border-dashed border-border-input rounded-md py-2 mt-1 hover:border-text-muted transition-colors"
              >
                + Add job
              </button>
            </div>
          );
        })}
      </div>

      {modalStatus && (
        <AddJobModal
          defaultStatus={modalStatus}
          onClose={() => setModalStatus(null)}
          onAdd={handleAdd}
        />
      )}
    </main>
  );
}
