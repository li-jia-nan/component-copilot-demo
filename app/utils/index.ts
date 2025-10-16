import type { GeneratedCode } from "@/app/store";
import type { MutationFetcher } from "swr/mutation";
import type { API } from "../interface";

interface SendPostArgs {
  prompt: string;
}

export const sendPost: MutationFetcher<API.LLM_Response, string, SendPostArgs> = async (
  url,
  options,
) => {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(options.arg),
  });
  const data = await res.json();
  return data;
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
      body{margin:16px;background-color:#0b0f14;color:#e5e7eb}
      ${css}
    </style>
  </head>
  <body>
    ${html || '<div style="opacity:.6">预览区还没有内容，试着在上面输入需求☝️</div>'}
    <script>${js}</script>
  </body>
</html>`;
};
