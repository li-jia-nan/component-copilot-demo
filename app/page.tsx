"use client";

import React from "react";
import { Play, Sparkles } from "lucide-react";
import { useCopilotStore } from "@/store";
import { CodeEditor } from "./components/CodeEditor";
import { PreviewPanel } from "./components/PreviewPanel";
import { ChatBar } from "./components/ChatBar";
import { Toolbar } from "./components/Toolbar";

const ComponentCopilotApp: React.FC = () => {
  const { edited, setEdited, code, isStreaming, error, showCode } = useCopilotStore();

  const setHtml = (value: string) => setEdited({ html: value });
  const setCss = (value: string) => setEdited({ css: value });
  const setJs = (value: string) => setEdited({ js: value });

  return (
    <div className="h-screen w-full grid grid-rows-[auto_auto_1fr] gap-3 p-4 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <header className="flex items-center gap-3">
        <Sparkles className="w-5 h-5" />
        <h1 className="text-lg font-semibold">Component Copilot</h1>
        <span className="text-xs text-slate-400">AI 驱动的 UI 组件原型工具</span>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 items-center">
        <ChatBar />
        <Toolbar />
      </section>

      <main className="grid grid-rows-1 md:grid-cols-2 gap-3 min-h-0">
        {/* Preview */}
        <div className="min-h-0 flex flex-col">
          <div className="py-3">
            <div className="text-sm font-medium flex items-center gap-2">
              <Play className="w-4 h-4" />
              预览
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <div className="h-[60vh] md:h-[calc(100vh-220px)]">
              <PreviewPanel code={edited.html || edited.css || edited.js ? edited : code} />
            </div>
            {isStreaming && (
              <div className="mt-2 text-xs text-slate-400 animate-pulse">
                AI 正在生成（支持流式）…
              </div>
            )}
            {error && <div className="mt-2 text-xs text-rose-400">{error}</div>}
          </div>
        </div>
        {/* Code Panel */}
        {showCode && (
          <div className="grid grid-rows-3 gap-3">
            <CodeEditor language="html" value={edited.html} onChange={setHtml} />
            <CodeEditor language="css" value={edited.css} onChange={setCss} />
            <CodeEditor language="javascript" value={edited.js} onChange={setJs} />
          </div>
        )}
      </main>
    </div>
  );
};

export default ComponentCopilotApp;
