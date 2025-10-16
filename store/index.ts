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
  isMutating: boolean;
  error?: string;
  showCode: boolean;
}

export interface CopilotAction {
  addMessage: (m: Omit<CopilotMessage, "id" | "ts">) => void;
  setCode: (c: Partial<GeneratedCode>) => void;
  reset: () => void;
  setIsMutating: (b: boolean) => void;
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
  isMutating: false,
  showCode: true,
  addMessage: m => {
    set(s => ({
      messages: [...s.messages, { ...m, id: nanoid(), ts: Date.now() }],
    }));
  },
  setCode: c => {
    set(s => ({ code: { ...s.code, ...c } }));
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
      isMutating: false,
      error: undefined,
    });
  },
  setIsMutating: b => {
    set({ isMutating: b });
  },
  setError: e => {
    set({ error: e });
  },
  toggleShowCode: () => {
    set(s => ({ showCode: !s.showCode }));
  },
}));
