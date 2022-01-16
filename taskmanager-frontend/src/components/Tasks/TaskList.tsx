import { TaskProps } from 'core/entities';
import { FC, useRef, useEffect, useState } from 'react';
import { theme } from 'theme';
import { StylesProvider } from '@mui/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@emotion/react';
import { Tree, NodeModel, DragLayerMonitorProps, TreeMethods } from "@minoru/react-dnd-treeview";
import { TaskItem } from './TaskItem';
import { CustomDragPreview } from './CustomDragPreview';
import { useDispatch } from 'react-redux';
import { updateTask } from 'store/tasks/thunks';
import styles from "./TaskList.module.css";

const updateTaskParent = (x: NodeModel<TaskProps>, targetId: number | string) => {
    return { ...x, data: { ...x.data, parent_id: targetId === -1 ? null : targetId } } as NodeModel<TaskProps>
}
const TaskList: FC<{ tasks: { [key: number]: TaskProps } }> = ({ tasks }) => {
    const [treeData, setTreeData] = useState<NodeModel<TaskProps>[]>([]);
    const dispatch = useDispatch();
    const handleDrop = (newTree: NodeModel<TaskProps>[], { dragSourceId, dropTargetId }: { dragSourceId: number | string, dropTargetId: number | string }) => {
        newTree = newTree.map(x => x.id === dragSourceId ? updateTaskParent(x, dropTargetId) : x)
        dispatch(updateTask(newTree.find(x => x.id === dragSourceId)?.data || {}));
        setTreeData(newTree);
    }
    useEffect(() => {
        setTreeData(Object.values(tasks).map(task => {
            return { id: task.id, parent: task.parent_id || -1, text: task.title, droppable: true, data: task } as NodeModel<TaskProps>
        }));
    }, [tasks]);

    const ref = useRef<TreeMethods>(null);
    const handleValueChange = (id: NodeModel<TaskProps>["id"], value: TaskProps | undefined) => {
        const newTree = treeData.map((node) => {
            if (node.id === id) {
                return {
                    ...node,
                    text: value?.title || "",
                    data: value
                } as NodeModel<TaskProps>;
            }
            return node;
        });
        setTreeData(newTree);
    };

    return (
        <StylesProvider injectFirst>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <div className={styles.app}>
                    <Tree
                        tree={treeData}
                        rootId={-1}
                        ref={ref}
                        render={(node: NodeModel<TaskProps>, { depth, isOpen, onToggle }) => (
                            <TaskItem node={node} depth={depth} isOpen={isOpen} onToggle={onToggle} onValueChange={handleValueChange} />
                        )}
                        dragPreviewRender={(
                            monitorProps: DragLayerMonitorProps<TaskProps>
                        ) => <CustomDragPreview monitorProps={monitorProps} />}
                        onDrop={handleDrop}
                        classes={{
                            root: styles.treeRoot,
                            draggingSource: styles.draggingSource,
                            dropTarget: styles.dropTarget,
                        }}
                        initialOpen
                        sort={false}
                    />
                </div>
            </ThemeProvider>
        </StylesProvider>
    );
}

export default TaskList;