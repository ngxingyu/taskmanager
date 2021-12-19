import React from "react";
import { DragLayerMonitorProps } from "@minoru/react-dnd-treeview";
import styles from "./CustomDragPreview.module.css";
import { TaskProps } from "core/entities";

type Props = {
  monitorProps: DragLayerMonitorProps<TaskProps>;
};

export const CustomDragPreview: React.FC<Props> = (props) => {
  const item = props.monitorProps.item;

  return (
    <div className={styles.root}>
      <div className={styles.label}>{item.text}</div>
    </div>
  );
};