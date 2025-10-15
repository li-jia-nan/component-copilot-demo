import { CopilotMessage, GeneratedCode } from "@/store";

export const fetcher = (...args: Parameters<typeof fetch>) => {
  return fetch(...args).then(res => res.json());
};

export const buildUserPrompt = (
  input: string,
  history: CopilotMessage[],
  current: GeneratedCode,
) => {
  // Provide the last assistant code to guide stable edits
  const lastAssistant = history
    .filter(m => m.role === "assistant")
    .map(m => m.content)
    .slice(-1)[0];

  const previous = lastAssistant ? `Previous code JSON (for reference):\n${lastAssistant}` : "";

  return [
    `User intent: ${input}`,
    previous,
    `Current edited code (user may have modified):`,
    JSON.stringify(current),
    "Return ONLY the JSON object.",
  ].join("\n\n");
};

export const buildSrcDoc = (code: GeneratedCode) => {
  const { html, css, js } = code;
  const csp = [
    "default-src 'none'",
    "style-src 'unsafe-inline'",
    "script-src 'unsafe-inline'",
    "img-src data:",
    "font-src data:",
    "connect-src 'none'",
  ].join("; ");

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="Content-Security-Policy" content="${csp}" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      *{box-sizing:border-box}
      :root{font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial}
      body{margin:16px;background:#0b0f14;color:#e5e7eb}
      ${css}
      #__err{position:fixed;left:12px;right:12px;bottom:12px;background:#1f2937;color:#fca5a5;padding:8px 10px;border-radius:8px;font-size:12px}
    </style>
  </head>
  <body>
    ${html || '<div style="opacity:.6">(预览区还没有内容，试着在左侧输入需求)</div>'}
    <div id="__err"></div>
    <script>${js}</script>
  </body>
</html>`;
};
