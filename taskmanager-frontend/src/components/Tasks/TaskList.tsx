/* eslint-disable no-debugger */
/* eslint-disable no-console */

import SvgIcon from '@mui/material/SvgIcon';
import { TaskProps } from 'core/entities';
import { FC, useState } from 'react';
import { StylesProvider } from '@mui/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Tree, NodeModel, DragLayerMonitorProps } from "@minoru/react-dnd-treeview";
import { CustomNode } from './CustomNode';
import { CustomDragPreview } from './CustomDragPreview';
import styles from "./TaskList.module.css";
import { ThemeProvider } from '@emotion/react';
import { theme } from 'theme';

const MinusSquare = (props: any) => {
    return (
        <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
            {/* tslint:disable-next-line: max-line-length */}
            <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
        </SvgIcon>
    );
}

const PlusSquare = (props: any) => {
    return (
        <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
            {/* tslint:disable-next-line: max-line-length */}
            <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
        </SvgIcon>
    );
}

const CloseSquare = (props: any) => {
    return (
        <SvgIcon
            className="close"
            fontSize="inherit"
            style={{ width: 14, height: 14 }}
            {...props}
        >
            {/* tslint:disable-next-line: max-line-length */}
            <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
        </SvgIcon>
    );
}

const listToTree = (tasks: TaskProps[]) => {
    const tmp = new Array<TaskProps>();
    const hash: { [key: number]: number } = {};
    const roots = [];

    for (let i = 0; i < tasks.length; i += 1) {
        if (tasks[i].id !== undefined) {
            hash[(tasks[i].id) as number] = i;
            tmp[i] = { subtasks: [], ...tasks[i] };
        }
    }
    for (const task of tmp) {
        const node: TaskProps = task;
        if (node.parent_id !== null) {
            tmp[hash[node.parent_id as number]] = {
                ...tmp[hash[node.parent_id as number]],
                subtasks: [...(tmp[hash[node.parent_id as number]].subtasks || []), node]
            };
        } else {
            roots.push(node);
        }
    }
    return roots;
}

const updateTaskParent = (x: NodeModel<TaskProps>, targetId: number | string) => {
    return { ...x, data: { ...x.data, parent_id: targetId } } as NodeModel<TaskProps>
}
const TaskList: FC<{ tasks: { [key: number]: TaskProps } }> = ({ tasks }) => {
    const [treeData, setTreeData] = useState<NodeModel<TaskProps>[]>(Object.values(tasks).map(task => {
        return { id: task.id, parent: task.parent_id || -1, text: task.title, droppable: true, data: task } as NodeModel<TaskProps>
    }));
    const handleDrop = (newTree: NodeModel<TaskProps>[], { dragSourceId, dropTargetId }: { dragSourceId: number | string, dropTargetId: number | string }) => {
        newTree.map(x => x.id === dragSourceId ? updateTaskParent(x, dropTargetId) : x)
        setTreeData(newTree);
    }
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
                            <CustomNode node={node} depth={depth} isOpen={isOpen} onToggle={onToggle} onValueChange={handleValueChange} />
                        )}
                        dragPreviewRender={(
                            monitorProps: DragLayerMonitorProps<TaskProps>
                        ) => <CustomDragPreview monitorProps={monitorProps} />}
                        // canDrop={(
                        //     currentTree,
                        //     { dragSourceId, dropTargetId }
                        // ) => {
                        //     return dragSourceId !== dropTargetId;
                        // }}
                        onDrop={handleDrop}
                        classes={{
                            root: styles.treeRoot,
                            draggingSource: styles.draggingSource,
                            dropTarget: styles.dropTarget,
                        }}
                        sort={false}
                        initialOpen

                    // aria-label="customized"
                    // defaultExpanded={['1']}
                    // defaultCollapseIcon={< MinusSquare />}
                    // defaultExpandIcon={< PlusSquare />}
                    // defaultEndIcon={< CloseSquare />}
                    // multiSelect
                    // sx={{ flexGrow: 1, overflowY: 'auto' }}
                    />
                </div>
            </ThemeProvider>
        </StylesProvider>
    );
}



export default TaskList;