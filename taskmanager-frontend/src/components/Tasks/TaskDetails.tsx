
import { TaskProps, TaskStatus } from 'core/entities'
import { FC, useState } from 'react'
import EditIcon from '@mui/icons-material/Edit'
import CheckIcon from '@mui/icons-material/Check'
import DeleteIcon from '@mui/icons-material/Delete'
import CloseIcon from '@mui/icons-material/Close'
import { useDispatch } from 'react-redux';
import { Checkbox, Grid, IconButton, Stack, TextField, Tooltip } from '@mui/material';
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
        setEditing(false);
    }
    const triggerDelete = () => {
        dispatch(deleteTask(state.project_id || -1, state.id || -1));
        setEditing(false);
    }
    return (editing ? (
        <>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} m={2} >
                <Grid item xs={3}>
                    <TextField
                        label="Task"
                        value={state.title}
                        onChange={(e) => {
                            setState({ ...state, title: e.currentTarget.value })
                        }}
                    />
                </Grid>
                <Grid item xs={3}><TaskStatusSelector callback={(e) => { setState({ ...state, task_status_id: e }) }} task_status_id={task.task_status_id || 0} /></Grid>
                <Grid item xs={4}>
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
                </Grid>
                <Grid item xs={3}>
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
                </Grid>
                <Grid item xs={5}>
                    <ChipInput
                        defaultValue={state.all_tags}
                        fullWidth
                        placeholder='Type and press enter to add tags'
                        onChange={(chips: string[]) => setState({
                            ...state, all_tags: chips
                        })}
                    />
                </Grid>
                <Grid item xs={1}>
                    <Tooltip title="Save changes">
                        <IconButton
                            onClick={saveChanges}
                            disabled={state.title === ""}
                        >
                            <CheckIcon />
                        </IconButton>
                    </Tooltip>
                </Grid>
                <Grid item xs={1}>
                    <Tooltip title="Cancel Edit">
                        <IconButton onClick={() => setEditing(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Tooltip>
                </Grid>
                <Grid item xs={1}>
                    <Tooltip title="Delete Task">
                        <IconButton onClick={() => setDeleting(true)}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid >
            {deleting && <DeleteDialog onCancel={() => setDeleting(false)} onDelete={triggerDelete} name="task" warning="Confirm deletion of task. This action is irreversible" />}
        </>
    ) :
        <Stack direction="row" alignItems="center" spacing={2} >
            <Checkbox onChange={toggleCompletion} checked={completed} />
            <Stack direction="column" alignItems="start" spacing={0} >
                <h4>{task.title}</h4>
                <p>{task.notes}</p>
            </Stack>
            <p>{task.deadline}</p>
            <TagList tags={task.all_tags} />
            <IconButton onClick={() => setEditing(true)}>
                <EditIcon />
            </IconButton>
        </Stack >
    )
}
export default TaskDetails
