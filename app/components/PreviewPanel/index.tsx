import { buildSrcDoc } from "@/app/utils";
import { GeneratedCode } from "@/store";
import { useEffect, useMemo, useRef } from "react";

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
    <div className="h-full w-full border rounded-2xl overflow-hidden bg-[#030712]">
      <iframe ref={iframeRef} title="preview" sandbox="allow-scripts" className="w-full h-full" />
    </div>
  );
};
