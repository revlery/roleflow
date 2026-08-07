"use client";

interface SyncStatusProps {
	synced: boolean;
}

export default function SyncStatus({ synced }: SyncStatusProps) {
	return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ${
        synced
          ? "bg-accent-success/10 text-accent-success border-accent-success/30"
          : "bg-accent-warning/10 text-accent-warning border-accent-warning/30"
      } font-semibold`}
    >
      {synced ? "Synced" : "Not synced"}
    </span>
  );
}