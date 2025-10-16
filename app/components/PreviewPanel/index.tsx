import { buildSrcDoc } from "@/app/utils";
import { GeneratedCode } from "@/app/store";
import { useEffect, useMemo, useRef } from "react";
import styles from "./index.module.scss";

export const PreviewPanel: React.FC<{ code: GeneratedCode }> = props => {
  const { code } = props;
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const srcDoc = useMemo(() => buildSrcDoc(code), [code]);
  useEffect(() => {
    if (!iframeRef.current) {
      return;
    }
    iframeRef.current.srcdoc = srcDoc;
  }, [srcDoc]);
  return (
    <div className={styles.previewPanel}>
      <iframe ref={iframeRef} title="preview" sandbox="allow-scripts" className={styles.iframe} />
    </div>
  );
};
