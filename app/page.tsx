"use client";

import React, { useState } from "react";
import { Play, Sparkles } from "lucide-react";
import { useCopilotStore } from "@/store";
import { CodeEditor } from "./components/CodeEditor";
import { PreviewPanel } from "./components/PreviewPanel";
import { ChatBar } from "./components/ChatBar";
import { Toolbar } from "./components/Toolbar";
import styles from "./page.module.scss";
import { clsx } from "clsx";

const ComponentCopilotApp: React.FC = () => {
  const { code, setCode, isMutating, error, showCode } = useCopilotStore();

  const setHtml = (value?: string) => {
    setCode({ html: value });
  };
  const setCss = (value?: string) => {
    setCode({ css: value });
  };
  const setJs = (value?: string) => {
    setCode({ js: value });
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
              <PreviewPanel code={code} />
            </div>
          </div>
        </div>
        <div className={clsx(styles.codeColumn, { [styles.hidden]: !showCode })}>
          <CodeEditor language="html" value={code.html} onChange={setHtml} />
          <CodeEditor language="css" value={code.css} onChange={setCss} />
          <CodeEditor language="javascript" value={code.js} onChange={setJs} />
        </div>
      </main>
    </div>
  );
};

export default ComponentCopilotApp;
