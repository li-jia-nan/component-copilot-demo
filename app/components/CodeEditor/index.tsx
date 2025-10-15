import { Input } from "antd";
import { Code } from "lucide-react";
import dynamic from "next/dynamic";
import styles from "./index.module.scss";
import clsx from "clsx";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

interface CodeEditorProps {
  language: "html" | "css" | "javascript";
  value: string;
  onChange: (v: string) => void;
  monospace?: boolean;
}

export const CodeEditor: React.FC<Readonly<CodeEditorProps>> = props => {
  const { language, value, onChange, monospace = true } = props;
  return (
    <div className={styles.codeEditor}>
      <div className={styles.header}>
        <Code className={styles.icon} />
        {language}
      </div>
      <MonacoEditor
        className={clsx(styles.editor, {
          "font-mono text-sm": monospace,
        })}
        defaultValue={`// ${language}`}
        value={value}
        defaultLanguage={language}
        language={language}
        onChange={value => onChange(value || "")}
      />
    </div>
  );
};
