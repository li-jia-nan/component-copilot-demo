"use client";

import React, { useMemo } from "react";
import { createCache, extractStyle, StyleProvider } from "@ant-design/cssinjs";
import { useServerInsertedHTML } from "next/navigation";

export const StyleRegistry: React.FC<React.PropsWithChildren> = props => {
  const { children } = props;
  const cache = useMemo(() => createCache(), []);
  useServerInsertedHTML(() => {
    const styleText = extractStyle(cache, { plain: true, once: true });
    if (styleText.includes('.data-ant-cssinjs-cache-path{content:"";}')) {
      return null;
    }
    return (
      <style
        id="antd-cssinjs"
        data-rc-order="prepend"
        data-rc-priority="-1000"
        dangerouslySetInnerHTML={{ __html: styleText }}
      />
    );
  });
  if (typeof window !== "undefined") {
    return children;
  }
  return <StyleProvider cache={cache}>{children}</StyleProvider>;
};
