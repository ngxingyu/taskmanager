import React, { useState } from "react";

import { NodeModel, useDragOver } from "@minoru/react-dnd-treeview";
import styles from "./CustomNode.module.css";
import { TaskProps } from "core/entities";
import CheckIcon from "@mui/icons-material/Check"
import CloseIcon from "@mui/icons-material/Close"
import EditIcon from "@mui/icons-material/Edit"
import ArrowRightIcon from "@mui/icons-material/ArrowRight"
import { TextField, IconButton, Typography, Accordion } from "@mui/material";
import { TaskDetails } from "./TaskItem";

type Props = {
    node: NodeModel<TaskProps>;
    depth: number;
    isOpen: boolean;
    onToggle: (id: NodeModel["id"]) => void;
    onValueChange: (id: NodeModel["id"], value: TaskProps | undefined) => void;
};

export const CustomNode: React.FC<Props> = (props) => {
    const { id, data } = props.node;
    const [visibleInput, setVisibleInput] = useState(false);
    const [value, setValue] = useState(data);
    const indent = props.depth * 24;

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        props.onToggle(props.node.id);
    };

    const handleShowInput = () => {
        setVisibleInput(true);
    };

    const handleCancel = () => {
        setValue(data);
        setVisibleInput(false);
    };

    const handleChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue({ ...data, title: e.target.value });
    };

    const handleSubmit = () => {
        setVisibleInput(false);
        props.onValueChange(id, value);
    };

    const dragOverProps = useDragOver(id, props.isOpen, props.onToggle);

    return (
        <div
            className={`tree-node ${styles.root}`}
            style={{ paddingInlineStart: indent }}
            {...dragOverProps}
        >
            <div
                className={`${styles.expandIconWrapper} ${props.isOpen ? styles.isOpen : ""
                    }`}
            >
                {props.node.droppable && (
                    <div onClick={handleToggle}>
                        <ArrowRightIcon />
                    </div>
                )}
            </div>
            <div className={styles.labelGridItem}>
                {visibleInput ? (
                    <div className={styles.inputWrapper}>
                        <TextField
                            className={`${styles.textField}
              ${styles.nodeInput}`}
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
                    </div>
                ) : (
                    value !== undefined && <TaskDetails task={value} />
                    // <div className={styles.inputWrapper}>
                    //     <Typography variant="body2" className={styles.nodeLabel}>
                    //         {props.node.text}
                    //     </Typography>
                    //     <IconButton className={styles.editButton} onClick={handleShowInput}>
                    //         <EditIcon className={styles.editIcon} />
                    //     </IconButton>
                    // </div>
                )}
            </div>

        </div>
    );
};
