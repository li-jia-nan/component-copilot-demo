import { useCopilotStore } from "@/store";
import { Button } from "antd";
import { Copy, PanelLeftOpen, PanelRightOpen, Shield, Trash2 } from "lucide-react";
import { useState } from "react";

export const Toolbar: React.FC = () => {
  const { edited, reset, toggleShowCode, showCode } = useCopilotStore();
  const [copied, setCopied] = useState(false);

  const copyAll = async () => {
    const bundle = JSON.stringify({ html: edited.html, css: edited.css, js: edited.js }, null, 2);
    await navigator.clipboard.writeText(bundle);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button onClick={copyAll} className="gap-2">
        <Copy className="w-4 h-4" />
        {copied ? "已复制" : "复制JSON"}
      </Button>
      <Button onClick={toggleShowCode} className="gap-2">
        {showCode ? <PanelRightOpen className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
        {showCode ? "隐藏代码" : "显示代码"}
      </Button>
      <Button onClick={reset} className="gap-2">
        <Trash2 className="w-4 h-4" />
        重置会话
      </Button>
      <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
        <Shield className="w-4 h-4" /> 预览已沙箱隔离
      </div>
    </div>
  );
};
