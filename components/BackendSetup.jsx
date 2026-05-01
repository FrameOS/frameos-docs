"use client";

import { useMemo, useState } from "react";
import { Copy, PlugZap, ShieldCheck, Trash2 } from "lucide-react";

export function BackendSetup({ initialInstances, cloudUrl }) {
  const [instances, setInstances] = useState(initialInstances);
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");

  const command = useMemo(() => {
    if (!token) {
      return "";
    }
    return `FRAMEOS_CLOUD_URL="${cloudUrl}" FRAMEOS_CLOUD_TOKEN="${token}" frameos backend cloud-login`;
  }, [cloudUrl, token]);

  async function register(event) {
    event.preventDefault();
    setMessage("");
    setToken("");

    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/cloud/backend/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        endpoint: form.get("endpoint"),
      }),
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      setMessage(data.error || "Could not connect backend.");
      return;
    }

    setInstances((items) => [data.instance, ...items]);
    setToken(data.token);
    event.currentTarget.reset();
  }

  async function revoke(id) {
    const response = await fetch(`/api/cloud/backend/instances/${id}`, { method: "DELETE" });
    if (response.ok) {
      setInstances((items) => items.filter((item) => item.id !== id));
    }
  }

  return (
    <div className="workspaceGrid">
      <aside className="railPanel">
        <div className="railInfo">
          <ShieldCheck size={20} />
          <p>Backend tokens can save templates and call cloud APIs for the signed-in FrameOS user.</p>
        </div>
        {instances.map((instance) => (
          <div className="instanceRow" key={instance.id}>
            <strong>{instance.name}</strong>
            <span>{instance.lastSeenAt ? `Last seen ${new Date(instance.lastSeenAt).toLocaleString()}` : "Never seen"}</span>
            <button className="iconButton" onClick={() => revoke(instance.id)} title="Revoke backend token" type="button">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </aside>

      <section className="editorPanel">
        <div className="sectionHeader">
          <div>
            <p className="eyebrow">Cloud login</p>
            <h1>Connect a FrameOS backend</h1>
          </div>
        </div>

        {message ? <p className="notice danger">{message}</p> : null}

        <form className="stackForm" onSubmit={register}>
          <label>
            <span>Backend name</span>
            <input name="name" placeholder="Home Assistant backend" required />
          </label>
          <label>
            <span>Backend URL</span>
            <input name="endpoint" placeholder="http://frameos.local:8989" />
          </label>
          <button className="button primary" type="submit">
            <PlugZap size={17} />
            Create cloud login token
          </button>
        </form>

        {token ? (
          <div className="tokenPanel">
            <p className="eyebrow">One-time token</p>
            <pre>{command}</pre>
            <button className="button secondary small" onClick={() => navigator.clipboard?.writeText(command)} type="button">
              <Copy size={16} />
              Copy command
            </button>
          </div>
        ) : null}

        <div className="apiPanel">
          <p className="eyebrow">Backend API</p>
          <code>POST /api/cloud/backend/login</code>
          <p>FrameOS backend setup can exchange email/password credentials for a backend bearer token, then save templates with that token.</p>
        </div>
      </section>
    </div>
  );
}
