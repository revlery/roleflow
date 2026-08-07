"use client";

import { useState, useEffect, useRef } from "react";
// import GearIcon from "./icons/GearIcon"
import SettingsIcon from "./icons/SettingsIcon"

type SyncState = "synced" | "not-synced" | "loading";
type GoogleState = "connected" | "not-connected";

export default function SyncStatus() {
  const [syncState, setSyncState] = useState<SyncState>("not-synced");
  const [googleState, setGoogleState] = useState<GoogleState>("not-connected");
  const [showPanel, setShowPanel] = useState(false);
  const [view, setView] = useState<"menu" | "generate" | "connect">("menu");
  const [inputCode, setInputCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const accountId = localStorage.getItem("roleflow_account_id");
    if (accountId) setSyncState("synced");

    const googleConnected = localStorage.getItem("roleflow_google_connected");
    if (googleConnected === "true") setGoogleState("connected");
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowPanel(false);
        setView("menu");
        setError(null);
      }
    }
    if (showPanel) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showPanel]);

  async function generateSyncCode() {
    setError(null);
    setSyncState("loading");
    try {
      const res = await fetch("/api/accounts", { method: "POST" });
      if (!res.ok) throw new Error("Failed to generate sync code");
      const data = await res.json();

      localStorage.setItem("roleflow_account_id", data.accountId);
      localStorage.setItem("roleflow_sync_code", data.syncCode);
      setGeneratedCode(data.syncCode);
      setSyncState("synced");
      window.dispatchEvent(new Event("roleflow:sync-changed"));
    } catch (err) {
      setError("Couldn't generate a sync code. Try again.");
      setSyncState("not-synced");
    }
  }

  async function connectWithCode() {
    if (!inputCode.trim()) return;
    setError(null);
    setSyncState("loading");
    try {
      const res = await fetch("/api/accounts/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ syncCode: inputCode.trim() }),
      });

      if (!res.ok) {
        setError("That sync code wasn't found.");
        setSyncState("not-synced");
        return;
      }

      const data = await res.json();
      localStorage.setItem("roleflow_account_id", data.accountId);
      localStorage.setItem("roleflow_sync_code", inputCode.trim().toUpperCase());
      setSyncState("synced");
      setView("menu");
      setInputCode("");
      window.dispatchEvent(new Event("roleflow:sync-changed"));
    } catch (err) {
      setError("Something went wrong. Try again.");
      setSyncState("not-synced");
    }
  }

  function disconnectSync() {
    localStorage.removeItem("roleflow_account_id");
    localStorage.removeItem("roleflow_sync_code");
    setSyncState("not-synced");
    setGeneratedCode(null);
    setView("menu");
    window.dispatchEvent(new Event("roleflow:sync-changed"));
  }

  function connectGoogle() {
    // Requires the Google Identity Services script loaded, e.g. in your root layout:
    // <script src="https://accounts.google.com/gsi/client" async defer></script>
    const google = (window as any).google;
    if (!google?.accounts?.oauth2) {
        setError("Google sign-in isn't ready yet. Try again.");
        return;
    }
    const client = google.accounts.oauth2.initTokenClient({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      scope: "https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.compose",
      callback: (response: { access_token?: string; error?: string }) => {
        if (response.error || !response.access_token) {
          console.error("Google auth failed:", response.error);
          return;
        }
        sessionStorage.setItem("roleflow_google_token", response.access_token);
        localStorage.setItem("roleflow_google_connected", "true");
        setGoogleState("connected");
      },
    });
    client.requestAccessToken();
  }

  function disconnectGoogle() {
    sessionStorage.removeItem("roleflow_google_token");
    localStorage.removeItem("roleflow_google_connected");
    setGoogleState("not-connected");
  }

  return (
    <div ref={containerRef} className="relative z-50">
      <div className="flex items-center gap-2">
        <span
          className={`flex items-center gap-1.5 text-xs font-medium ${
            syncState === "synced" ? "text-text-primary" : "text-text-tertiary"
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              syncState === "synced"
                ? "bg-green-500"
                : syncState === "loading"
                ? "animate-pulse bg-amber-400"
                : "bg-text-muted"
            }`}
          />
          {syncState === "synced"
            ? "Synced"
            : syncState === "loading"
            ? "Syncing..."
            : "Not synced"}
        </span>

        <button
          onClick={() => setShowPanel((v) => !v)}
          className="flex h-8 w-8 items-center justify-center rounded border border-border-input text-text-tertiary hover:bg-surface-raised hover:text-text-secondary"
          aria-label="Sync settings"
        >
          <SettingsIcon size={16}/>
        </button>
      </div>

      {showPanel && (
        <div className="relative">
          <div className="absolute -top-1 right-3 h-2 w-2 rotate-45 border-t border-l border-border-input bg-surface-raised" />

          <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-lg border border-border-input bg-surface-raised py-1 shadow-xl">
            {view === "menu" && (
              <>
                <div className="px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-text-muted">
                  Sync
                </div>
                {syncState === "synced" ? (
                  <MenuItem onClick={disconnectSync} danger>
                    Disconnect this device
                  </MenuItem>
                ) : (
                  <>
                    <MenuItem
                      onClick={() => {
                        setError(null);
                        setView("generate");
                        generateSyncCode();
                      }}
                    >
                      Generate sync code
                    </MenuItem>
                    <MenuItem onClick={() => setView("connect")}>
                      I have a sync code
                    </MenuItem>
                  </>
                )}

                <div className="my-1 border-t border-border-input" />

                <div className="px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-text-muted">
                  Google
                </div>
                {googleState === "connected" ? (
                  <MenuItem onClick={disconnectGoogle} danger>
                    Disconnect Google
                  </MenuItem>
                ) : (
                  <MenuItem onClick={connectGoogle}>
                    Connect Google account
                  </MenuItem>
                )}
              </>
            )}

            {view === "generate" && (
              <div className="px-3 py-2">
                {generatedCode ? (
                  <>
                    <p className="mb-1 text-xs font-medium text-text-primary">Your sync code</p>
                    <p className="mb-2 text-[11px] leading-snug text-text-tertiary">
                      Save this — it can't be recovered if lost.
                    </p>
                    <div className="mb-2 rounded border border-border-input px-2 py-1.5 text-center font-mono text-sm tracking-wider text-text-primary">
                      {generatedCode}
                    </div>
                    <button
                      onClick={() => {
                        setView("menu");
                        setGeneratedCode(null);
                      }}
                      className="w-full rounded bg-blue-600 px-2 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                    >
                      Done
                    </button>
                  </>
                ) : error ? (
                  <>
                    <p className="mb-2 text-[11px] text-red-500">{error}</p>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => {
                          setView("menu");
                          setError(null);
                        }}
                        className="flex-1 rounded border border-border-input px-2 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary"
                      >
                        Back
                      </button>
                      <button
                        onClick={generateSyncCode}
                        className="flex-1 rounded bg-blue-600 px-2 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                      >
                        Retry
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="py-2 text-center text-xs text-text-muted">Generating...</p>
                )}
              </div>
            )}

            {view === "connect" && (
              <div className="px-3 py-2">
                <p className="mb-1.5 text-xs font-medium text-text-primary">Enter sync code</p>
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  placeholder="A1B2C3D4"
                  className="mb-1.5 w-full rounded border border-border-input bg-surface-raised px-2 py-1.5 text-sm uppercase text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-ring-focus"
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && connectWithCode()}
                />
                {error && <p className="mb-1.5 text-[11px] text-red-500">{error}</p>}
                <div className="flex gap-1.5">
                  <button
                    onClick={() => {
                      setView("menu");
                      setError(null);
                    }}
                    className="flex-1 rounded border border-border-input px-2 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary"
                  >
                    Back
                  </button>
                  <button
                    onClick={connectWithCode}
                    disabled={syncState === "loading"}
                    className="flex-1 rounded bg-blue-600 px-2 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    {syncState === "loading" ? "..." : "Connect"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function MenuItem({
  children,
  onClick,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full px-3 py-1.5 text-left text-sm hover:bg-surface-raised ${
        danger ? "text-red-500" : "text-text-secondary hover:text-text-primary"
      }`}
    >
      {children}
    </button>
  );
}