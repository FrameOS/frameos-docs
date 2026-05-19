"use client";

import { useEffect, useState } from "react";
import { Download, KeyRound, Lock, RefreshCw, Trash2, Upload } from "lucide-react";

const encoder = new TextEncoder();
const decoder = new TextDecoder();
const KDF_ITERATIONS = 250000;

function bytesToBase64Url(bytes) {
  let binary = "";
  for (let index = 0; index < bytes.length; index += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlToBytes(value) {
  const base64 = String(value || "").replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

async function deriveKey(passphrase, salt) {
  const material = await crypto.subtle.importKey("raw", encoder.encode(passphrase), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: KDF_ITERATIONS, hash: "SHA-256" },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

async function encryptPayload(payload, passphrase) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(passphrase, salt);
  const ciphertext = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoder.encode(JSON.stringify(payload))));

  return {
    version: 1,
    algorithm: "AES-256-GCM",
    kdf: "PBKDF2-SHA-256",
    iterations: KDF_ITERATIONS,
    encoding: "base64url",
    salt: bytesToBase64Url(salt),
    iv: bytesToBase64Url(iv),
    ciphertext: bytesToBase64Url(ciphertext),
  };
}

async function decryptPayload(envelope, passphrase) {
  const salt = base64UrlToBytes(envelope.salt);
  const iv = base64UrlToBytes(envelope.iv);
  const key = await deriveKey(passphrase, salt);
  const plaintext = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, base64UrlToBytes(envelope.ciphertext));
  return JSON.parse(decoder.decode(plaintext));
}

function parseBackupText(value) {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function formatDate(value) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function CloudBackupsClient() {
  const [backups, setBackups] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [passphrase, setPassphrase] = useState("");
  const [backupName, setBackupName] = useState("");
  const [backupText, setBackupText] = useState("{\n  \"frames\": []\n}");
  const [decrypted, setDecrypted] = useState("");
  const [status, setStatus] = useState("");
  const [pending, setPending] = useState(false);

  async function refreshBackups() {
    const response = await fetch("/api/cloud/backups");
    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload.error || "Could not load backups.");
    }
    setBackups(payload.backups || []);
    setSelectedId((current) => current || payload.backups?.[0]?.id || "");
  }

  useEffect(() => {
    refreshBackups().catch((error) => setStatus(error.message));
  }, []);

  async function uploadBackup(event) {
    event.preventDefault();
    setPending(true);
    setStatus("");

    try {
      if (!passphrase) {
        throw new Error("Enter a passphrase.");
      }

      const envelope = await encryptPayload(
        {
          schema: "frameos.cloud.backup.payload.v1",
          label: backupName.trim() || "FrameOS backup",
          exportedAt: new Date().toISOString(),
          data: parseBackupText(backupText),
        },
        passphrase,
      );

      const response = await fetch("/api/cloud/backups", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ encryptedManifest: envelope }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Could not upload backup.");
      }

      setSelectedId(payload.backup.id);
      setStatus("Encrypted backup uploaded.");
      await refreshBackups();
    } catch (error) {
      setStatus(error.message);
    } finally {
      setPending(false);
    }
  }

  async function decryptSelected() {
    setPending(true);
    setStatus("");
    setDecrypted("");

    try {
      if (!selectedId) {
        throw new Error("Select a backup.");
      }
      if (!passphrase) {
        throw new Error("Enter the backup passphrase.");
      }

      const response = await fetch(`/api/cloud/backups/${encodeURIComponent(selectedId)}`);
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Could not download backup.");
      }

      const plaintext = await decryptPayload(payload.backup.encryptedManifest, passphrase);
      setDecrypted(JSON.stringify(plaintext, null, 2));
      setStatus("Backup decrypted in this browser.");
    } catch (error) {
      setStatus(error.message);
    } finally {
      setPending(false);
    }
  }

  async function deleteSelected() {
    if (!selectedId) {
      return;
    }

    setPending(true);
    setStatus("");
    try {
      const response = await fetch(`/api/cloud/backups/${encodeURIComponent(selectedId)}`, { method: "DELETE" });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error || "Could not delete backup.");
      }
      setSelectedId("");
      setDecrypted("");
      setStatus("Backup deleted.");
      await refreshBackups();
    } catch (error) {
      setStatus(error.message);
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="backupGrid">
      <form className="panel backupComposer" onSubmit={uploadBackup}>
        <div className="sectionHeader">
          <div>
            <p className="eyebrow">Encrypt</p>
            <h2>New backup</h2>
          </div>
          <Lock size={22} />
        </div>
        <label>
          <span>Passphrase</span>
          <input autoComplete="new-password" onChange={(event) => setPassphrase(event.target.value)} type="password" value={passphrase} />
        </label>
        <label>
          <span>Backup name</span>
          <input onChange={(event) => setBackupName(event.target.value)} placeholder="Kitchen frames" value={backupName} />
        </label>
        <label>
          <span>Backend export JSON</span>
          <textarea onChange={(event) => setBackupText(event.target.value)} rows={12} spellCheck={false} value={backupText} />
        </label>
        <button className="button primary" disabled={pending} type="submit">
          <Upload size={17} />
          {pending ? "Working..." : "Encrypt and upload"}
        </button>
      </form>

      <div className="panel backupVault">
        <div className="sectionHeader">
          <div>
            <p className="eyebrow">Vault</p>
            <h2>Cloud backups</h2>
          </div>
          <button className="iconButton" disabled={pending} onClick={() => refreshBackups().catch((error) => setStatus(error.message))} type="button">
            <RefreshCw size={17} />
          </button>
        </div>

        <div className="backupRows">
          {backups.length === 0 ? <p className="emptyState">No encrypted backups stored.</p> : null}
          {backups.map((backup) => (
            <button className={selectedId === backup.id ? "backupRow active" : "backupRow"} key={backup.id} onClick={() => setSelectedId(backup.id)} type="button">
              <strong>{backup.id}</strong>
              <span>{formatDate(backup.updatedAt)}</span>
              <small>{backup.objectCount} encrypted objects</small>
            </button>
          ))}
        </div>

        <div className="backupActions">
          <button className="button secondary" disabled={pending || !selectedId} onClick={decryptSelected} type="button">
            <KeyRound size={17} />
            Decrypt
          </button>
          <button className="button danger" disabled={pending || !selectedId} onClick={deleteSelected} type="button">
            <Trash2 size={17} />
            Delete
          </button>
        </div>

        {status ? <p className="notice">{status}</p> : null}
        {decrypted ? (
          <div className="decryptedBackup">
            <div className="sectionHeader compact">
              <p className="eyebrow">Plaintext</p>
              <Download size={17} />
            </div>
            <pre>{decrypted}</pre>
          </div>
        ) : null}
      </div>
    </section>
  );
}
