"use client";

import SyncStatus from "./SyncStatus";
import SettingsIcon from "./icons/SettingsIcon";

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
        <SyncStatus synced={synced} />
        <button
          onClick={() => onSettingsClick?.()}
          aria-label="Settings"
          className="w-9 h-9 flex items-center justify-center rounded-md border border-border hover:bg-surface-2 text-text-tertiary"
        >
          <SettingsIcon size={18} />
        </button>
      </div>
    </header>
  );
}
