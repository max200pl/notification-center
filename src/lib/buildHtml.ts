import type { NotificationModel } from "./types";
import { HtmlTemplateBuilder, buildHtmlTemplate } from "./htmlTemplateBuilder";

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function buildHtml(model: NotificationModel) {
  const title = escapeHtml(model.title);
  const message = escapeHtml(model.message);
  const buttonText = escapeHtml(model.buttonText);
  const isDark = model.theme === "dark";

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial;
      background: ${isDark ? "#0b1220" : "#f6f7fb"};
      color: ${isDark ? "rgba(255,255,255,.92)" : "#101828"};
      display: grid;
      place-items: center;
      height: 100vh;
      padding: 20px;
    }
    .card {
      width: min(640px, 100%);
      border-radius: 16px;
      padding: 18px;
      border: 1px solid ${
        isDark ? "rgba(255,255,255,.14)" : "rgba(16,24,40,.12)"
      };
      background: ${isDark ? "rgba(255,255,255,.08)" : "#ffffff"};
      box-shadow: 0 18px 50px rgba(0,0,0,.15);
    }
    h3 { margin: 0 0 8px; font-size: 18px; }
    p  { margin: 0 0 14px; line-height: 1.45; opacity: .9; }
    button {
      border: 1px solid ${
        isDark ? "rgba(255,255,255,.18)" : "rgba(16,24,40,.14)"
      };
      background: ${isDark ? "rgba(74,163,255,.18)" : "#eef6ff"};
      color: inherit;
      padding: 10px 12px;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <div class="card">
    <h3>${title}</h3>
    <p>${message}</p>
    ${
      buttonText
        ? `<button onclick="alert('CTA clicked')">${buttonText}</button>`
        : ""
    }
  </div>
</body>
</html>`;
}

// Export default template (can be regenerated with custom config)
export const templateHtml = new HtmlTemplateBuilder().build();

// Export builder and utility functions
export { HtmlTemplateBuilder, buildHtmlTemplate };
