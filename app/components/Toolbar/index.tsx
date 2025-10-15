import { useCopilotStore } from "@/store";
import { Button } from "antd";
import { Copy, PanelLeftOpen, PanelRightOpen, Shield, Trash2 } from "lucide-react";
import { useState } from "react";
import styles from "./index.module.scss";

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
    <div className={styles.toolbar}>
      <Button onClick={copyAll} className={styles.button}>
        <Copy className={styles.icon} />
        {copied ? "已复制" : "复制JSON"}
      </Button>
      <Button onClick={toggleShowCode} className={styles.button}>
        {showCode ? (
          <PanelRightOpen className={styles.icon} />
        ) : (
          <PanelLeftOpen className={styles.icon} />
        )}
        {showCode ? "隐藏代码" : "显示代码"}
      </Button>
      <Button onClick={reset} className={styles.button}>
        <Trash2 className={styles.icon} />
        重置会话
      </Button>
      <div className={styles.status}>
        <Shield className={styles.icon} /> 预览已沙箱隔离
      </div>
    </div>
  );
};
