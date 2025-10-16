import { nanoid } from "nanoid";
import { create } from "zustand";
import { baseSystemPrompt } from "../app/utils";

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
