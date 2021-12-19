/* eslint-disable no-debugger */
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Role } from 'core/entities';
import React, { FC, useState } from 'react'

type RoleKeys = { [key: string]: number; }
const RoleSelector: FC<{ role: number, callback: (x: number) => void }> = ({ role, callback }) => {
    const [state, setState] = useState(role);
    const keys = Object.keys(Role).reduce((acc: RoleKeys, key) => {
        const numericKey: number = parseInt(key, 10);
        if (!isNaN(numericKey)) {
            acc[Role[numericKey]] = numericKey;
        }
        return acc;
    }, {});
    return (
        <FormControl fullWidth>
            <InputLabel id="simple-select-label">Role</InputLabel>
            <Select
                labelId="simple-select-label"
                id="simple-select"
                value={state}
                label="Role"
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

export default RoleSelector
