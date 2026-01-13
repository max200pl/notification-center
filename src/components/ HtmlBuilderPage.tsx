export type NotificationModel = {
  title: string;
  message: string;
  buttonText: string;
  theme: "light" | "dark";
};

import React, { useMemo, useState } from "react";
import { buildHtml } from "../lib/buildHtml";

function downloadHtml(filename: string, html: string) {
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}

export function HtmlBuilderPage() {
  const [model, setModel] = useState<NotificationModel>({
    title: "License expiring",
    message: "Your license will expire in 3 days.",
    buttonText: "Renew",
    theme: "dark",
  });

  const html = useMemo(() => buildHtml(model), [model]);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "360px 1fr",
        gap: 16,
        height: "100vh",
        padding: 16,
      }}
    >
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: 12,
          padding: 12,
          display: "grid",
          gap: 10,
        }}
      >
        <label>
          Title
          <input
            value={model.title}
            onChange={(e) => setModel({ ...model, title: e.target.value })}
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 10,
              border: "1px solid #ccc",
              marginTop: 6,
            }}
          />
        </label>

        <label>
          Message
          <textarea
            value={model.message}
            onChange={(e) => setModel({ ...model, message: e.target.value })}
            rows={5}
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 10,
              border: "1px solid #ccc",
              marginTop: 6,
            }}
          />
        </label>

        <label>
          Button text
          <input
            value={model.buttonText}
            onChange={(e) => setModel({ ...model, buttonText: e.target.value })}
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 10,
              border: "1px solid #ccc",
              marginTop: 6,
            }}
          />
        </label>

        <label>
          Theme
          <select
            value={model.theme}
            onChange={(e) =>
              setModel({
                ...model,
                theme: e.target.value as NotificationModel["theme"],
              })
            }
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 10,
              border: "1px solid #ccc",
              marginTop: 6,
            }}
          >
            <option value="dark">dark</option>
            <option value="light">light</option>
          </select>
        </label>

        <button
          onClick={() => downloadHtml("notification.html", html)}
          style={{
            padding: 12,
            borderRadius: 12,
            border: "1px solid #aaa",
            cursor: "pointer",
          }}
        >
          Save as .html
        </button>

        <details>
          <summary>Show HTML</summary>
          <pre style={{ whiteSpace: "pre-wrap", fontSize: 12 }}>{html}</pre>
        </details>
      </div>

      <iframe
        title="preview"
        srcDoc={html}
        style={{
          width: "100%",
          height: "100%",
          border: "1px solid #ddd",
          borderRadius: 12,
          background: "#fff",
        }}
        sandbox="allow-scripts"
      />
    </div>
  );
}
