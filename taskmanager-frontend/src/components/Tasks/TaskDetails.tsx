
import { TaskProps, TaskStatus } from 'core/entities'
import { FC, useState } from 'react'
import EditIcon from '@mui/icons-material/Edit'
import CheckIcon from '@mui/icons-material/Check'
import DeleteIcon from '@mui/icons-material/Delete'
import CloseIcon from '@mui/icons-material/Close'
import { useDispatch } from 'react-redux';
import { Box, Checkbox, IconButton, Stack, TextField, Tooltip } from '@mui/material';
import { deleteTask, updateTask } from 'store/tasks/thunks';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/lab';
import ChipInput from '@jansedlon/material-ui-chip-input';
import TaskStatusSelector from './TaskStatusSelector';
import TagList from './TagList'
import { DeleteDialog } from 'components/DeleteDialog'

export const TaskDetails: FC<{ task: TaskProps }> = ({ task }) => {
    const [completed, setCompleted] = useState(task.task_status_id === TaskStatus.Completed)
    const [editing, setEditing] = useState(false)
    const [deleting, setDeleting] = useState(false)
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
        setCompleted(state.task_status_id === TaskStatus.Completed);
        setEditing(false);
    }
    const triggerDelete = () => {
        dispatch(deleteTask(state.project_id || -1, state.id || -1));
        setEditing(false);
    }
    return (editing ? (
        <>
            <Box sx={{ display: 'flex', flexWrap: 'wrap' }} >
                <TextField
                    label="Task"
                    value={state.title}
                    onChange={(e) => {
                        setState({ ...state, title: e.currentTarget.value })
                    }}
                />
                <TaskStatusSelector callback={(e) => { setState({ ...state, task_status_id: e }) }} task_status_id={task.task_status_id || 0} />
                <TextField
                    label="Description"
                    aria-label="notes"
                    minRows={3}
                    placeholder="Task notes"
                    style={{ width: 200 }}
                    value={state.notes}
                    onChange={(e) => { setState({ ...state, notes: e.currentTarget.value }) }}
                    multiline
                />
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        label="Basic example"
                        value={state.deadline}
                        onChange={(newValue) => {
                            if (newValue !== null) {
                                setState({ ...state, deadline: newValue });
                            }
                        }}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>
                <ChipInput
                    defaultValue={state.all_tags}
                    fullWidth
                    placeholder='Type and press enter to add tags'
                    onChange={(chips: string[]) => setState({
                        ...state, all_tags: chips
                    })}
                />
                <Tooltip title="Save changes">
                    <IconButton
                        onClick={saveChanges}
                        disabled={state.title === ""}
                    >
                        <CheckIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Cancel Edit">
                    <IconButton onClick={() => setEditing(false)}>
                        <CloseIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete Task">
                    <IconButton onClick={() => setDeleting(true)}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            </Box >
            {deleting && <DeleteDialog onCancel={() => setDeleting(false)} onDelete={triggerDelete} name="task" warning="Confirm deletion of task. This action is irreversible" />}
        </>
    ) :
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start', alignContent: 'space-between', p: 1, m: 1 }} >
            <Checkbox onChange={toggleCompletion} checked={completed} />
            <Stack direction="column" alignItems="start" spacing={0} paddingRight={2}>
                <h4>{task.title}</h4>
                <p>{task.notes}</p>
            </Stack>
            <p>{task.deadline?.toDateString()}</p>
            <TagList tags={task.all_tags} />
            <IconButton onClick={() => setEditing(true)}>
                <EditIcon />
            </IconButton>
        </Box >
    )
}
export default TaskDetails
