import { TaskProps } from 'core/entities';
import { FC, useEffect, useState } from 'react';
import { theme } from 'theme';
import { StylesProvider } from '@mui/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@emotion/react';
import { Tree, NodeModel, DragLayerMonitorProps } from "@minoru/react-dnd-treeview";
import { TaskItem } from './TaskItem';
import { CustomDragPreview } from './CustomDragPreview';
import { useDispatch } from 'react-redux';
import { updateTask } from 'store/tasks/thunks';
import styles from "./TaskList.module.css";

// const listToTree = (tasks: TaskProps[]) => {
//     const tmp = new Array<TaskProps>();
//     const hash: { [key: number]: number } = {};
//     const roots = [];

//     for (let i = 0; i < tasks.length; i += 1) {
//         if (tasks[i].id !== undefined) {
//             hash[(tasks[i].id) as number] = i;
//             tmp[i] = { subtasks: [], ...tasks[i] };
//         }
//     }
//     for (const task of tmp) {
//         const node: TaskProps = task;
//         if (node.parent_id !== null) {
//             tmp[hash[node.parent_id as number]] = {
//                 ...tmp[hash[node.parent_id as number]],
//                 subtasks: [...(tmp[hash[node.parent_id as number]].subtasks || []), node]
//             };
//         } else {
//             roots.push(node);
//         }
//     }
//     return roots;
// }

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
        }))
    }, [tasks])
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