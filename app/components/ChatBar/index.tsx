import { useCopilotStore } from "@/store";
import { Button, Input } from "antd";
import { Loader2, Send } from "lucide-react";
import { clsx } from "clsx";
import { sendPost } from "@/app/utils";
import { useCallback, useEffect, useState } from "react";
import useSWRMutation from "swr/mutation";
import styles from "./index.module.scss";

export const ChatBar: React.FC = () => {
  const [input, setInput] = useState<string>();

  const { setCode, setIsMutating } = useCopilotStore();

  const { trigger, isMutating } = useSWRMutation("/api/generate-component", sendPost);

  useEffect(() => {
    setIsMutating(isMutating);
  }, [isMutating]);

  const onSend = useCallback(async () => {
    const prompt = input?.trim();
    if (!prompt) {
      alert("请输入内容");
      return;
    }
    trigger({ prompt: prompt })
      .then(res => {
        const data = JSON.parse(res.data);
        setCode({
          html: data.html,
          css: data.css,
          js: data.js,
        });
      })
      .catch(err => {
        console.error(err);
      });
  }, [input, trigger]);

  return (
    <div className={styles.chatBar}>
      <Input
        allowClear
        value={input}
        onChange={e => setInput(e.target.value)}
        className={styles.input}
        variant="outlined"
        placeholder={`例如：创建一个卡片，包含标题、描述、以及一个蓝色的"了解更多"按钮`}
        onKeyDown={e => {
          if (e.key === "Enter") {
            e.preventDefault();
            onSend();
          }
        }}
      />
      <Button
        onClick={isMutating ? undefined : onSend}
        loading={isMutating}
        className={styles.sendButton}
      >
        {isMutating ? null : <Send className={styles.icon} />}
        发送
      </Button>
    </div>
  );
};
