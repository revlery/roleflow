"use client";

import SyncStatus from "./SyncStatus";

import { Job } from "../types";

interface HeaderProps {
  jobs: Job[];
  synced: boolean;
  onSettingsClick?: () => void;
}

export default function Header({ jobs, synced, onSettingsClick }: HeaderProps) {
  return (
    <header className="px-8 pt-8 pb-4 flex justify-between items-center">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Roleflow</h1>
        <p className="text-sm text-text-tertiary">
          {jobs.length} job{jobs.length === 1 ? "" : "s"} tracked
        </p>
      </div>
      <div className="flex items-center gap-2">
        <SyncStatus />
      </div>
    </header>
  );
}
