import React, { useEffect, useState } from "react";

import { NodeModel, useDragOver } from "@minoru/react-dnd-treeview";
import styles from "./TaskItem.module.css";
import { TaskProps } from "core/entities";
import CheckIcon from "@mui/icons-material/Check"
import CloseIcon from "@mui/icons-material/Close"
import ArrowRightIcon from "@mui/icons-material/ArrowRight"
import { TextField, IconButton } from "@mui/material";
import { TaskDetails } from "./TaskDetails";

type TaskItemProps = {
    node: NodeModel<TaskProps>;
    depth: number;
    isOpen: boolean;
    onToggle: (id: NodeModel["id"]) => void;
    onValueChange: (id: NodeModel["id"], value: TaskProps | undefined) => void;
};

export const TaskItem: React.FC<TaskItemProps> = (props) => {
    const [visibleInput, setVisibleInput] = useState(false);
    const [value, setValue] = useState(props.node.data);
    const indent = props.depth * 24;
    useEffect(() => { setValue(props.node.data) }, [props.node.data]);

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        props.onToggle(props.node.id);
    };

    const handleCancel = () => {
        setValue(props.node.data);
        setVisibleInput(false);
    };

    const handleChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue({ ...props.node.data, title: e.target.value });
    };

    const handleSubmit = () => {
        setVisibleInput(false);
        props.onValueChange(props.node.id, value);
    };

    const dragOverProps = useDragOver(props.node.id, props.isOpen, props.onToggle);

    return (
        <div
            className={`tree-node ${styles.root}`}
            style={{ paddingInlineStart: indent }}
            {...dragOverProps}
        >
            <div
                className={`${styles.expandIconWrapper} ${props.isOpen ? styles.isOpen : ""}`}
            >
                {props.node.droppable && (
                    <div onClick={handleToggle}>
                        <ArrowRightIcon />
                    </div>
                )}
            </div>
            <div className={styles.labelGridItem}>
                {visibleInput ?
                    <div className={styles.inputWrapper}>
                        <TextField
                            className={`${styles.textField} ${styles.nodeInput}`}
                            value={value?.title}
                            onChange={handleChangeText}
                        />
                        <IconButton
                            className={styles.editButton}
                            onClick={handleSubmit}
                            disabled={value?.title === ""}
                        >
                            <CheckIcon className={styles.editIcon} />
                        </IconButton>
                        <IconButton className={styles.editButton} onClick={handleCancel}>
                            <CloseIcon className={styles.editIcon} />
                        </IconButton>
                    </div> :
                    (value !== undefined && <TaskDetails task={value} />)
                }
            </div>

        </div>
    );
};
