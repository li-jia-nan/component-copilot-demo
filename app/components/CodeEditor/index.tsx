import { Input } from "antd";
import { Code } from "lucide-react";
import dynamic from "next/dynamic";

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
    <div className="h-full">
      <div className="py-3">
        <div className="text-sm font-medium flex items-center gap-2">
          <Code className="w-4 h-4" />
          {language}
        </div>
      </div>
      <MonacoEditor
        className="min-h-[180px] h-[260px] resize-vertical"
        defaultValue={`// ${language}`}
        value={value}
        defaultLanguage={language}
        language={language}
        onChange={value => onChange(value || "")}
      />
    </div>
  );
};
