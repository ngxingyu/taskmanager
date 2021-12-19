/* eslint-disable no-console */
import { Grid, IconButton } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import { PermissionProps, Role } from 'core/entities';
import React, { FC, useState } from 'react'
import RoleSelector from './RoleSelector';
import ChipInput from '@jansedlon/material-ui-chip-input';

const AddPermission: FC<{ callback: (x: PermissionProps[]) => void }> =
    ({ callback }) => {
        const [emails, setEmails] = useState<string[]>([]);
        const [role, setRole] = useState(1);
        const handleChange = (newEmails: string[], newRole: number) => {
            callback(newEmails.map<PermissionProps>((email) => { return { email, role: newRole } as PermissionProps }))
            setEmails([]);
            // if (newState !== undefined) { setState(newState); }
            // callback(newState);
            // if (permission.email === "") {
            //     setState({ email: "", role: 1 });
            // }
        }
        return (
            <Grid container spacing={2}>
                {<Grid item xs={(
                    (emails.length === 0 ? 12 : 9)  -
                    (emails.length === 0 ? 0 : 1)
                )}>
                    <ChipInput
                        defaultValue={[]}
                        fullWidth
                        label='Emails'
                        placeholder='Type and press enter to add emails'
                        value={emails}
                        onAdd={(chip:string) => setEmails([...emails, chip])}
                        onDelete={(chip:string) => setEmails(emails.filter(x=>x!==chip))}
                    />
                </Grid>}
                {emails.length !== 0 && (
                    <>
                        <Grid item xs={3}>
                            <RoleSelector role={role} callback={(x: number) => setRole(x)} />
                        </Grid>
                        <Grid item xs={1}>
                            <IconButton aria-label="add" onClick={() => handleChange(emails, role)}>
                                <DoneIcon />
                            </IconButton>
                        </Grid>
                    </>)}
            </Grid >
        )
    }

export default AddPermission
