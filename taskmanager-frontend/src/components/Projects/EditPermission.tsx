/* eslint-disable no-console */
import { Grid, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Editable from 'components/Editable';
import { PermissionProps } from 'core/entities';
import React, { FC, useState } from 'react'
import RoleSelector from './RoleSelector';

const EditPermission: FC<{ permission: PermissionProps, callback: (x?: PermissionProps) => void }> =
    ({ permission, callback }) => {
        const [state, setState] = useState(permission);
        console.log(permission.role.valueOf(), state.role.valueOf(), permission.role === state.role, permission.email)
        const handleChange = (newState?: PermissionProps) => {
            if (newState !== undefined) { setState(newState); }
            callback(newState);
            if (permission.email === "") {
                setState({ email: "", role: 1 });
            }
        }
        return (
            <Grid container spacing={2}>
                {<Grid item xs={(
                    (state.email === "" ? 12 : 9) -
                    (permission.email === "" ? 0 : 1)
                    )}>
                    <Editable
                        text={state.email}
                        label="Email: "
                        name="email"
                        placeholder="user email"
                        callback={(x: string) => handleChange({ ...state, email: x })}
                    />
                </Grid>}
                {state.email !== "" && (
                    <Grid item xs={3}>
                        <RoleSelector role={state.role} callback={(x: number) => handleChange({ ...state, role: x })} />
                    </Grid>)}
                {permission.email !== "" && (
                    <Grid item xs={1}>
                        <IconButton aria-label="delete" onClick={() => handleChange(undefined)}>
                            <DeleteIcon />
                        </IconButton>
                    </Grid>)}
            </Grid >
        )
    }

export default EditPermission
