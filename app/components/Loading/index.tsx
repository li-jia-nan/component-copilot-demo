import React from "react";
import styles from "./index.module.scss";
import clsx from "clsx";

interface LoadingProps {
  className?: string;
  style?: React.CSSProperties;
}

const Loading: React.FC<Readonly<LoadingProps>> = props => {
  const { className, style } = props;
  return (
    <div draggable={false} style={style} className={clsx(styles.loadingWrap, className)}>
      <div draggable={false} className={clsx(styles.loader)} />
    </div>
  );
};

export default Loading;
