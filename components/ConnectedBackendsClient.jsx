"use client";

import { useEffect, useState } from "react";
import { ExternalLink, RefreshCw, Server, Trash2 } from "lucide-react";

function formatDate(value) {
  if (!value) {
    return "Never";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function safeBackendUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : "";
  } catch {
    return "";
  }
}

export function ConnectedBackendsClient() {
  const [backends, setBackends] = useState([]);
  const [pendingId, setPendingId] = useState("");
  const [status, setStatus] = useState("");

  async function refreshBackends() {
    const response = await fetch("/api/account/backends");
    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload.error || "Could not load connected backends.");
    }
    setBackends(payload.backends || []);
  }

  useEffect(() => {
    refreshBackends().catch((error) => setStatus(error.message));
  }, []);

  async function revokeBackend(id) {
    setPendingId(id);
    setStatus("");

    try {
      const response = await fetch(`/api/account/backends/${encodeURIComponent(id)}`, { method: "DELETE" });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error || "Could not revoke backend.");
      }
      setStatus("Backend disconnected.");
      await refreshBackends();
    } catch (error) {
      setStatus(error.message);
    } finally {
      setPendingId("");
    }
  }

  return (
    <section className="accountList">
      <div className="sectionHeader">
        <div>
          <p className="eyebrow">Sync access</p>
          <h2>Connected backends</h2>
        </div>
        <button className="iconButton" disabled={Boolean(pendingId)} onClick={() => refreshBackends().catch((error) => setStatus(error.message))} type="button">
          <RefreshCw size={17} />
        </button>
      </div>

      {status ? <p className="notice">{status}</p> : null}
      {backends.length === 0 ? (
        <div className="emptyPanel">
          <Server size={24} />
          <strong>No connected backends</strong>
          <p>Self-hosted FrameOS backends appear here after authenticating via FrameOS Cloud during backend setup.</p>
        </div>
      ) : null}

      {backends.map((backend) => (
        <article className="backendCard" key={backend.id}>
          <div>
            <h3>{backend.backendName || "FrameOS backend"}</h3>
            <p>{backend.backendUrl || "No backend URL recorded"}</p>
          </div>
          <dl>
            <div>
              <dt>Connected</dt>
              <dd>{formatDate(backend.createdAt)}</dd>
            </div>
            <div>
              <dt>Last seen</dt>
              <dd>{formatDate(backend.lastSeenAt)}</dd>
            </div>
          </dl>
          <div className="backendActions">
            {safeBackendUrl(backend.backendUrl) ? (
              <a className="button secondary small" href={safeBackendUrl(backend.backendUrl)}>
                <ExternalLink size={15} />
                Open
              </a>
            ) : null}
            <button className="button danger small" disabled={pendingId === backend.id} onClick={() => revokeBackend(backend.id)} type="button">
              <Trash2 size={15} />
              {pendingId === backend.id ? "Disconnecting..." : "Disconnect"}
            </button>
          </div>
        </article>
      ))}
    </section>
  );
}
