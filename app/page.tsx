"use client";

import React from "react";
import { Play, Sparkles } from "lucide-react";
import { useCopilotStore } from "@/store";
import { CodeEditor } from "./components/CodeEditor";
import { PreviewPanel } from "./components/PreviewPanel";
import { ChatBar } from "./components/ChatBar";
import { Toolbar } from "./components/Toolbar";
import styles from "./page.module.scss";

const ComponentCopilotApp: React.FC = () => {
  const { edited, setEdited, code, isStreaming, error, showCode } = useCopilotStore();

  const setHtml = (value: string) => {
    setEdited({ html: value });
  };
  const setCss = (value: string) => {
    setEdited({ css: value });
  };
  const setJs = (value: string) => {
    setEdited({ js: value });
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Sparkles className={styles.sparklesIcon} />
        <div className={styles.title}>Component Copilot</div>
        <div className={styles.subtitle}>AI 驱动的 UI 组件原型工具</div>
      </header>
      <section className={styles.controls}>
        <ChatBar />
        <Toolbar />
      </section>
      <main className={styles.main}>
        <div className={styles.previewColumn}>
          <div className={styles.previewTitle}>
            <Play className={styles.playIcon} />
            预览
          </div>
          <div className={styles.previewContent}>
            <div className={styles.previewFrame}>
              <PreviewPanel code={edited.html || edited.css || edited.js ? edited : code} />
            </div>
            {isStreaming && <div className={styles.streamingNotice}>AI 正在生成（支持流式）…</div>}
            {error && <div className={styles.errorNotice}>{error}</div>}
          </div>
        </div>
        {showCode && (
          <div className={styles.codeColumn}>
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
