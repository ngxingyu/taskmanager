/* eslint-disable no-console */
import { TagProps, TaskProps, TaskStatus } from 'core/entities'
import React, { FC, PropsWithChildren, ReactNode, useState } from 'react'
import PropTypes from 'prop-types';
import { alpha, styled } from '@mui/material/styles';
import Collapse from '@mui/material/Collapse';
import { useDispatch } from 'react-redux';
import { Checkbox, Stack } from '@mui/material';
import { TreeItem } from './TreeItemContent';
import { updateTask } from 'store/tasks/thunks';

const TransitionComponent = (props: any) => {
    // const style = useSpring({
    //     from: {
    //         opacity: 0,
    //         transform: 'translate3d(20px,0,0)',
    //     },
    //     to: {
    //         opacity: props.in ? 1 : 0,
    //         transform: `translate3d(${props.in ? 0 : 20}px,0,0)`,
    //     },
    // });

    return (
        <div>
            <Collapse {...props} />
        </div>
    );
}

TransitionComponent.propTypes = {
    /**
     * Show the component; triggers the enter or exit states
     */
    in: PropTypes.bool,
};

const Tags: FC<{ tags: TagProps[] }> = ({ tags }) => {
    return (<>
        {tags.map(tag => {
            return <p key={tag.id}>{tag.name}</p>
        })}
    </>)
}
const TaskDetails: FC<{ task: TaskProps }> = ({ task }) => {
    const [completed, setCompleted] = useState(task.task_status_id === TaskStatus.Completed)
    const dispatch = useDispatch();
    const toggleCompletion = () => {
        setCompleted(!completed);
        const taskStatus = task.task_status_id === TaskStatus.Completed ? TaskStatus.Todo : TaskStatus.Completed;
        dispatch(updateTask({
            ...task, task_status_id: taskStatus
        }));
    };
    return (
        <Stack direction="row" spacing={2}>
            <Checkbox onChange={toggleCompletion} checked={completed} />
            <h4>{task.title}</h4>
            <p>{task.notes}</p>
            <p>{task.deadline}</p>
            <Tags tags={task.tags || []} />
        </Stack>
    )
}
const TaskItem: FC<PropsWithChildren<{ task: TaskProps }>> = ({ task }) => {
    if (!Array.isArray(task.subtasks) || !task.subtasks.length) {
        return <TreeItem key={task.id} nodeId={(task.id?.toString(10) || "-1")} label={<TaskDetails task={task} />} />
    }
    return (
        <TreeItem key={task.id} nodeId={(task.id?.toString(10) || "-1")} label={<TaskDetails task={task} />}>
            {
                task.subtasks.map((t, idx) => <TaskItem key={idx} task={t} />)
            }
        </TreeItem >
    )
}

// const renderTask = (task: TaskProps) => {
//     return (
//         <StyledTreeItem key={task.id} nodeId={(task.id?.toString(10) || "-1")} label={<TaskDetails task={task} />}>
//             {
//                 Array.isArray(task.subtasks)
//                     ? task.subtasks.map((t) => renderTask(t))
//                     : null
//             }
//         </StyledTreeItem >
//     )
// }

export default TaskItem
