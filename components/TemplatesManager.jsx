"use client";

import { useMemo, useState } from "react";
import { Eye, EyeOff, Plus, Save, Trash2 } from "lucide-react";

const DEFAULT_TEMPLATE = JSON.stringify(
  {
    version: 1,
    scene: {
      name: "Kitchen dashboard",
      nodes: [],
    },
  },
  null,
  2,
);

function tagsToString(tags) {
  return Array.isArray(tags) ? tags.join(", ") : "";
}

export function TemplatesManager({ initialTemplates }) {
  const [templates, setTemplates] = useState(initialTemplates);
  const [selectedId, setSelectedId] = useState(initialTemplates[0]?.id || "new");
  const [message, setMessage] = useState("");
  const selected = useMemo(() => templates.find((template) => template.id === selectedId), [templates, selectedId]);

  async function save(event) {
    event.preventDefault();
    setMessage("");
    const form = new FormData(event.currentTarget);
    let content;

    try {
      content = JSON.parse(String(form.get("content") || "{}"));
    } catch {
      setMessage("Template JSON is not valid.");
      return;
    }

    const payload = {
      name: form.get("name"),
      description: form.get("description"),
      tags: form.get("tags"),
      visibility: form.get("visibility"),
      content,
    };

    const response = await fetch(selected ? `/api/templates/${selected.id}` : "/api/templates", {
      method: selected ? "PATCH" : "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      setMessage(data.error || "Could not save template.");
      return;
    }

    if (selected) {
      setTemplates((items) => items.map((item) => (item.id === data.template.id ? data.template : item)));
    } else {
      setTemplates((items) => [data.template, ...items]);
      setSelectedId(data.template.id);
    }
    setMessage("Template saved.");
  }

  async function remove(id) {
    setMessage("");
    const response = await fetch(`/api/templates/${id}`, { method: "DELETE" });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setMessage(data.error || "Could not delete template.");
      return;
    }
    const next = templates.filter((template) => template.id !== id);
    setTemplates(next);
    setSelectedId(next[0]?.id || "new");
  }

  const formTemplate = selected || {
    name: "",
    description: "",
    tags: [],
    visibility: "private",
    content: JSON.parse(DEFAULT_TEMPLATE),
  };

  return (
    <div className="workspaceGrid">
      <aside className="railPanel">
        <button className={selectedId === "new" ? "railItem active" : "railItem"} onClick={() => setSelectedId("new")} type="button">
          <Plus size={17} />
          New template
        </button>
        {templates.map((template) => (
          <button className={selectedId === template.id ? "railItem active" : "railItem"} key={template.id} onClick={() => setSelectedId(template.id)} type="button">
            {template.visibility === "public" ? <Eye size={17} /> : <EyeOff size={17} />}
            <span>{template.name}</span>
          </button>
        ))}
      </aside>

      <section className="editorPanel">
        <div className="sectionHeader">
          <div>
            <p className="eyebrow">Saved templates</p>
            <h1>{selected ? "Manage template" : "Save a new template"}</h1>
          </div>
          {selected ? (
            <button className="button danger small" onClick={() => remove(selected.id)} type="button">
              <Trash2 size={16} />
              Delete
            </button>
          ) : null}
        </div>

        {message ? <p className="notice">{message}</p> : null}

        <form className="templateForm" key={selected?.id || "new"} onSubmit={save}>
          <div className="formGrid">
            <label>
              <span>Name</span>
              <input defaultValue={formTemplate.name} name="name" placeholder="Kitchen dashboard" required />
            </label>
            <label>
              <span>Visibility</span>
              <select defaultValue={formTemplate.visibility} name="visibility">
                <option value="private">Private</option>
                <option value="public">Public</option>
              </select>
            </label>
          </div>
          <label>
            <span>Description</span>
            <textarea defaultValue={formTemplate.description} name="description" placeholder="What this template is for" rows={3} />
          </label>
          <label>
            <span>Tags</span>
            <input defaultValue={tagsToString(formTemplate.tags)} name="tags" placeholder="eink, calendar, kitchen" />
          </label>
          <label>
            <span>Template JSON</span>
            <textarea className="codeInput" defaultValue={JSON.stringify(formTemplate.content, null, 2)} name="content" rows={16} />
          </label>
          <button className="button primary" type="submit">
            <Save size={17} />
            Save template
          </button>
        </form>
      </section>
    </div>
  );
}
