import { buildUserPrompt, fetcher } from "@/app/utils";
import { useCopilotStore } from "@/store";
import { Button, Input } from "antd";
import { Loader2, Send } from "lucide-react";
import { useCallback, useState } from "react";
import useSWRMutation from "swr/mutation";
import styles from "./index.module.scss";
import clsx from "clsx";

const sendRequest = (url: string, { arg }: { arg: { username: string } }) => {
  return fetch(url, { method: "POST", body: JSON.stringify(arg) }).then(res => {
    return res.json();
  });
};

export const ChatBar: React.FC = () => {
  const [input, setInput] = useState("");
  const { messages, addMessage, setCode, setEdited, setIsStreaming, setError } = useCopilotStore();
  const edited = useCopilotStore(s => s.edited);

  const { trigger, isMutating } = useSWRMutation("", sendRequest);

  const onSend = useCallback(async () => {
    const text = input.trim();
    if (!text) {
      return;
    }
  }, [input]);

  return (
    <div className={styles.chatBar}>
      <Input
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={"例如：创建一个卡片，包含标题、描述、以及一个蓝色的‘了解更多’按钮"}
        onKeyDown={e => {
          if (e.key === "Enter") {
            e.preventDefault();
            onSend();
          }
        }}
      />
      <Button
        onClick={isMutating ? undefined : onSend}
        disabled={isMutating}
        className={styles.sendButton}
      >
        {isMutating ? (
          <Loader2 className={clsx(styles.icon, styles.spin)} />
        ) : (
          <Send className={styles.icon} />
        )}
        发送
      </Button>
    </div>
  );
};
