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
    <main className="flex-1 bg-gray-50">
      <header className="px-8 pt-8 pb-4">
        <h1 className="text-xl font-semibold text-gray-900">Roleflow</h1>
        <p className="text-sm text-gray-500">
          {jobs.length} job{jobs.length === 1 ? "" : "s"} tracked
        </p>
      </header>

      <div className="flex gap-4 px-8 pb-8 items-start">
        {STATUSES.map((status) => {
          const columnJobs = jobs.filter((j) => j.status === status);
          return (
            <div
              key={status}
              className="flex-1 bg-white rounded-lg shadow p-4 min-w-0"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-gray-700">{status}</h2>
                <span className="text-xs text-gray-400">
                  {columnJobs.length}
                </span>
              </div>

              {columnJobs.length === 0 && (
                <div className="text-sm text-gray-400 mb-3">No cards yet</div>
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
                className="w-full text-sm text-gray-400 hover:text-gray-700 border border-dashed border-gray-300 rounded-md py-2 mt-1 hover:border-gray-400 transition-colors"
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
