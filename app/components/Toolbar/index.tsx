import { useCopilotStore } from "@/store";
import { Button } from "antd";
import { Copy, PanelLeftOpen, PanelRightOpen, Shield, Trash2 } from "lucide-react";
import styles from "./index.module.scss";

export const Toolbar: React.FC = () => {
  const { code, reset, toggleShowCode, showCode } = useCopilotStore();

  const copyAll = () => {
    const bundle = JSON.stringify({ html: code.html, css: code.css, js: code.js }, null, 2);
    navigator.clipboard
      .writeText(bundle)
      .then(() => {
        alert("已复制到剪贴板");
      })
      .catch(() => {
        alert("复制失败");
      });
  };

  return (
    <div className={styles.toolbar}>
      <Button onClick={copyAll} className={styles.button}>
        <Copy className={styles.icon} />
        复制JSON
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
    </div>
  );
};
