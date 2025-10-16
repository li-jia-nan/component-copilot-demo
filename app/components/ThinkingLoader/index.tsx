"use client";

import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";

interface ThinkingLoaderProps {
  message?: string;
}

export const ThinkingLoader: React.FC<ThinkingLoaderProps> = ({ message = "正在思考" }) => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.thinkingOverlay}>
      <div className={styles.container}>
        {/* Animated brain/thinking icon */}
        <div className={styles.iconWrapper}>
          <div className={styles.pulseCircle} />
          <div className={styles.spinnerOuter}>
            <div className={styles.spinner} />
          </div>
          <div className={styles.pingCircle}>
            <div className={styles.ping} />
          </div>
        </div>

        {/* Thinking text */}
        <div className={styles.textWrapper}>
          <p className={styles.mainText}>
            {message}
            <span className={styles.dotsContainer}>{dots}</span>
          </p>
          <p className={styles.subText}>AI正在为您生成回答</p>
        </div>

        {/* Animated bars */}
        <div className={styles.barsWrapper}>
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} className={styles.bar} />
          ))}
        </div>
      </div>
    </div>
  );
};
