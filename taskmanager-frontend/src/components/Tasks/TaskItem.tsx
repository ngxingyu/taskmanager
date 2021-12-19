/* eslint-disable no-console */
import { TagProps, TaskProps, TaskStatus } from 'core/entities'
import React, { FC, PropsWithChildren, ReactNode, useState } from 'react'
import PropTypes from 'prop-types';
import EditIcon from '@mui/icons-material/Edit'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import Collapse from '@mui/material/Collapse';
import { useDispatch } from 'react-redux';
import { Checkbox, Grid, IconButton, Stack, TextareaAutosize, TextField } from '@mui/material';
import { TreeItem } from './TreeItemContent';
import { updateTask } from 'store/tasks/thunks';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/lab';
import ChipInput from '@jansedlon/material-ui-chip-input';
import TaskStatusSelector from './TaskStatusSelector';

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
export const TaskDetails: FC<{ task: TaskProps }> = ({ task }) => {
    const [completed, setCompleted] = useState(task.task_status_id === TaskStatus.Completed)
    const [editing, setEditing] = useState(false)
    const [state, setState] = useState(task);
    const dispatch = useDispatch();
    const toggleCompletion = () => {
        setCompleted(!completed);
        const taskStatus = task.task_status_id === TaskStatus.Completed ? TaskStatus.Todo : TaskStatus.Completed;
        dispatch(updateTask({
            ...task, task_status_id: taskStatus
        }));
    };
    const saveChanges = () => {
        dispatch(updateTask(state));
        setEditing(false);
    }
    return (editing ? (
        <Grid container spacing={2}>
            <Grid item xs={3}><TaskStatusSelector callback={(e) => { setState({ ...state, task_status_id: e }) }} task_status_id={task.task_status_id || 0} /></Grid>
            <Grid item xs={3}>
                <TextField
                    value={task.title}
                    onChange={(e) => { setState({ ...state, title: e.target.value }) }}
                />
            </Grid>
            <Grid item xs={4}>
                <TextareaAutosize
                    aria-label="notes"
                    minRows={3}
                    placeholder="Task notes"
                    style={{ width: 200 }}
                    value={task.notes}
                    onChange={(e) => { setState({ ...state, notes: e.target.value }) }}
                />
            </Grid>
            <Grid item xs={3}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        label="Basic example"
                        value={task.deadline}
                        onChange={(newValue) => {
                            if (newValue !== null) {
                                setState({ ...state, deadline: newValue });
                            }
                        }}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>
            </Grid>
            <Grid item xs={4}>
                <ChipInput
                    defaultValue={task.tags}
                    fullWidth
                    label='Tags'
                    placeholder='Type and press enter to add tags'
                    onChange={(chips: string[]) => setState({
                        ...state, tags: chips.map(chip => {
                            return { project_id: task.project_id, name: chip } as TagProps
                        })
                    })}
                />
            </Grid>
            <Grid item xs={1}>
                <IconButton
                    onClick={saveChanges}
                    disabled={task.title === ""}
                >
                    <CheckIcon />
                </IconButton>
            </Grid>
            <Grid item xs={1}>
                <IconButton onClick={() => setEditing(false)}>
                    <CloseIcon />
                </IconButton>
            </Grid>
        </Grid >
    ) :
        <Stack direction="row" spacing={2} >
            <Checkbox onChange={toggleCompletion} checked={completed} />
            <h4>{task.title}</h4>
            <p>{task.notes}</p>
            <p>{task.deadline}</p>
            <Tags tags={task.tags || []} />
            <IconButton onClick={() => setEditing(true)}>
                <EditIcon />
            </IconButton>
        </Stack >
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
