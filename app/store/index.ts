import { nanoid } from "nanoid";
import { create } from "zustand";

export interface CopilotMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  ts: number;
}

export interface GeneratedCode {
  html: string;
  css: string;
  js: string;
}

export interface CopilotState {
  messages: CopilotMessage[];
  code: GeneratedCode; // latest AI output (or merged)
  edited: GeneratedCode; // user-edited working copy
  isStreaming: boolean;
  error?: string;
  showCode: boolean;
}

export interface CopilotAction {
  addMessage: (m: Omit<CopilotMessage, "id" | "ts">) => void;
  setCode: (c: Partial<GeneratedCode>) => void;
  setEdited: (c: Partial<GeneratedCode>) => void;
  reset: () => void;
  setIsStreaming: (b: boolean) => void;
  setError: (e?: string) => void;
  toggleShowCode: () => void;
}

const baseSystemPrompt = () => {
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
  ].join("\n");
};

export const useCopilotStore = create<CopilotState & CopilotAction>(set => ({
  messages: [
    {
      id: nanoid(),
      role: "system",
      content: baseSystemPrompt(),
      ts: Date.now(),
    },
  ],
  code: { html: "", css: "", js: "" },
  edited: { html: "", css: "", js: "" },
  isStreaming: false,
  showCode: true,
  addMessage: m => {
    set(s => ({
      messages: [...s.messages, { ...m, id: nanoid(), ts: Date.now() }],
    }));
  },
  setCode: c => {
    set(s => ({ code: { ...s.code, ...c } }));
  },
  setEdited: c => {
    set(s => ({ edited: { ...s.edited, ...c } }));
  },
  reset: () => {
    set({
      messages: [
        {
          id: nanoid(),
          role: "system",
          content: baseSystemPrompt(),
          ts: Date.now(),
        },
      ],
      code: { html: "", css: "", js: "" },
      edited: { html: "", css: "", js: "" },
      isStreaming: false,
      error: undefined,
    });
  },
  setIsStreaming: b => {
    set({ isStreaming: b });
  },
  setError: e => {
    set({ error: e });
  },
  toggleShowCode: () => {
    set(s => ({ showCode: !s.showCode }));
  },
}));
