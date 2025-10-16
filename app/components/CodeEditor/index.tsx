"use client";

import { Code } from "lucide-react";
import styles from "./index.module.scss";
import { clsx } from "clsx";
import React, { useCallback } from "react";
import dynamic from "next/dynamic";
import type { EditorProps } from "@monaco-editor/react";

const MonacoEditor = dynamic<EditorProps>(() => import("@monaco-editor/react"), {
  ssr: false,
});

interface CodeEditorProps {
  language: "html" | "css" | "javascript";
  value: string;
  onChange: (v?: string) => void;
  monospace?: boolean;
}

export const CodeEditor: React.FC<Readonly<CodeEditorProps>> = props => {
  const { language, value, onChange, monospace = true } = props;

  const handleChange = useCallback((value?: string) => onChange(value), [onChange]);

  return (
    <div className={styles.codeEditor}>
      <div className={styles.header}>
        <Code className={styles.icon} />
        {language}
      </div>
      <MonacoEditor
        className={clsx(styles.editor, { "font-mono text-sm": monospace })}
        defaultValue={`// ${language}`}
        value={value}
        defaultLanguage={language}
        language={language}
        onChange={handleChange}
        theme="vs-dark"
        loading={<div className={styles.loading}>Loading Editor...</div>}
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
        }}
      />
    </div>
  );
};
