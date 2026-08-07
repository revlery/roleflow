"use client";
import { useEffect, useState } from "react";
import { Job, JobStatus, STATUSES } from "./types";
import JobCard from "./components/JobCard";
import AddJobModal from "./components/AddJobModal";
import Header from "./components/Header";
import { encryptBoard, decryptBoard } from "@/lib/crypto";

const STORAGE_KEY = "roleflow.jobs";

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [modalStatus, setModalStatus] = useState<JobStatus | null>(null);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [syncCode, setSyncCode] = useState<string | null>(null);
  const synced = !!accountId;

  // Load on mount, and reload whenever sync state changes (connect/disconnect)
  useEffect(() => {
    async function loadBoard() {
      const aid = window.localStorage.getItem("roleflow_account_id");
      const code = window.localStorage.getItem("roleflow_sync_code");
      setAccountId(aid);
      setSyncCode(code);

      if (aid && code) {
        try {
          const res = await fetch(`/api/boards?accountId=${aid}`);
          const data = await res.json();
          if (data.ciphertext) {
            const decrypted = await decryptBoard(data.ciphertext, code);
            setJobs(decrypted as Job[]);
            return;
          }
        } catch {
          // fall through to local
        }
      }

      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        setJobs(raw ? JSON.parse(raw) : []);
      } catch {
        // ignore corrupted storage
      }
    }

    loadBoard().finally(() => setLoaded(true));

    window.addEventListener("roleflow:sync-changed", loadBoard);
    return () => window.removeEventListener("roleflow:sync-changed", loadBoard);
  }, []);

  // Persist on every change: always local, and push encrypted copy when synced
  useEffect(() => {
    if (!loaded) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));

    if (!accountId || !syncCode) return;
    const timeout = setTimeout(async () => {
      try {
        const ciphertext = await encryptBoard(jobs, syncCode);
        await fetch("/api/boards", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accountId, ciphertext }),
        });
      } catch {
        // TODO: surface sync error to user
      }
    }, 800);
    return () => clearTimeout(timeout);
  }, [jobs, loaded, accountId, syncCode]);

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

  if (!loaded) {
    return (
      <main className="flex-1 bg-surface-page">
        <header className="px-8 pt-8 pb-4">
          <h1 className="text-xl font-semibold text-text-primary">Roleflow</h1>
        </header>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-surface-page">
      <Header jobs={jobs} synced={synced} onSettingsClick={() => {}} />
      <div className="flex gap-4 px-8 pb-8 items-start">
        {STATUSES.map((status) => {
          const columnJobs = jobs.filter((j) => j.status === status);
          return (
            <div
              key={status}
              className="flex-1 bg-surface-raised rounded-lg shadow p-4 min-w-0 @container"
            >
              <div className="flex justify-between items-center gap-2 mb-4">
                <h2 className="font-semibold text-text-secondary truncate min-w-0">
                  {status}
                </h2>
                <span className="hidden @[140px]:inline shrink-0 text-xs text-text-muted">
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