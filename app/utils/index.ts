import type { GeneratedCode } from "@/store";
import type { MutationFetcher } from "swr/mutation";
import type { LLM_Response } from "../interface";

interface SendPostArgs {
  prompt: string;
}

export const sendPost: MutationFetcher<LLM_Response, string, SendPostArgs> = async (
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

export const buildUserPrompt = (userIntent: string) => {
  return `用户意图: ${userIntent}`;
};

export const baseSystemPrompt = () => {
  return [
    "你是 Component Copilot，一位专业的前端代码生成器。",
    '始终仅使用严格的 JSON 对象进行响应：{"html": string, "css": string, "js": string}',
    "约束条件：",
    "- 输出有效、精简、符合生产质量的代码。",
    "- 不使用外部资源，比如字体、图片、CDN 等。",
    "- 避免使用框架，而是使用原生 HTML/CSS/JS。",
    "- 除了初始化组件外，保持 JS 无副作用。",
    "- 如果要求修改，请重新输出完整更新的 { html, css, js }",
    "- 不要包含 markdown、反引号、特殊符号或解释。",
    "- 请注意返回的代码风格，不要包含多余的缩进或换行符，也不要挤在一行，确保它是紧凑且易于复制粘贴的。",
  ].join("\n");
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
