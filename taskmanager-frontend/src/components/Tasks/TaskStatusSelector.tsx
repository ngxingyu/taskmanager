
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { TaskStatus } from 'core/entities';
import React, { FC, useState } from 'react'

type StatusKeys = { [key: string]: number; }
const TaskStatusSelector: FC<{ task_status_id: number, callback: (x: number) => void }> = ({ task_status_id, callback }) => {
    const [state, setState] = useState(task_status_id);
    const keys = Object.keys(TaskStatus).reduce((acc: StatusKeys, key) => {
        const numericKey: number = parseInt(key, 10);
        if (!isNaN(numericKey)) {
            acc[TaskStatus[numericKey]] = numericKey;
        }
        return acc;
    }, {});
    return (
        <FormControl fullWidth>
            <InputLabel id="simple-select-label">Task Status</InputLabel>
            <Select
                labelId="simple-select-label"
                id="simple-select"
                value={state}
                label="Status"
                onChange={e => {
                    setState(e.target.value as number)
                    callback(e.target.value as number);
                }}
            >
                {Object.entries(keys).map( v =>
                    <MenuItem key={v[1]} value={v[1]}>{v[0]}</MenuItem>
                )}
            </Select>
        </FormControl>
    )
}

export default TaskStatusSelector
