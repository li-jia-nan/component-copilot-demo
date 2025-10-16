"use client";

import { Code } from "lucide-react";
import styles from "./index.module.scss";
import { clsx } from "clsx";
import React, { useCallback, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { EditorProps, OnMount } from "@monaco-editor/react";
import useTypedEffect from "@/app/hooks";
import { Skeleton } from "antd";
import Loading from "../Loading";

const MonacoEditor = dynamic<EditorProps>(() => import("@monaco-editor/react"), {
  ssr: false,
});

interface CodeEditorProps {
  language: "html" | "css" | "javascript";
  value: string;
  onChange: (v?: string) => void;
  monospace?: boolean;
}

type Mode = "typing" | "free";

export const CodeEditor: React.FC<Readonly<CodeEditorProps>> = props => {
  const { language, value, onChange, monospace = true } = props;

  const [mode, setMode] = useState<Mode>("typing");

  const [typedContent, isTyping] = useTypedEffect(value, mode === "typing", 1, 50);

  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);

  // ---------------- 用户输入探测：任意按键即退出打字机 ----------------
  const onMount: OnMount = editor => {
    editorRef.current = editor;
    const keydownDispose = editor.onKeyDown(() => {
      if (mode === "typing") {
        setMode("free");
      }
    });
    return () => {
      keydownDispose.dispose();
    };
  };

  const handleChange = useCallback(
    (next?: string) => {
      onChange(next);
    },
    [onChange],
  );

  return (
    <div className={styles.codeEditor}>
      <div className={styles.header}>
        <Code className={styles.icon} />
        {language}
      </div>
      <MonacoEditor
        className={clsx(styles.editor, { "font-mono text-sm": monospace })}
        defaultValue={`// ${language}`}
        value={mode === "typing" ? typedContent : value}
        defaultLanguage={language}
        language={language}
        onChange={handleChange}
        theme="vs-dark"
        loading={<Loading />}
        onMount={onMount}
        options={{
          minimap: { enabled: false },
          smoothScrolling: false,
          scrollbar: { vertical: "auto", horizontal: "auto" as const },
          mouseWheelZoom: false,
          renderWhitespace: "none" as const,
          selectionHighlight: false,
          inlineSuggest: { enabled: false },
          quickSuggestions: false,
          automaticLayout: true,
          wordWrap: "on" as const,
          readOnly: false,
        }}
      />
    </div>
  );
};
