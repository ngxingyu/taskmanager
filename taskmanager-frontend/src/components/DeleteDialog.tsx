import { Box, Button, Dialog, DialogActions, DialogTitle, useMediaQuery } from "@mui/material"
import { FC } from "react"
import { theme } from "theme"

export const DeleteDialog: FC<{ onCancel: () => void, onDelete: () => void, name: string, warning: string }> =
({ onCancel, onDelete, name, warning }) => {
    return <Dialog fullWidth fullScreen={useMediaQuery(theme.breakpoints.down('md'))} open onClose={onCancel}>
        <>
            <DialogTitle>Confirm deletion of {name} </DialogTitle>
            <Box sx={{
                mx: 'auto',
                p: 1,
                m: 1,
                borderRadius: 1,
                textAlign: 'center',
            }}>{warning}</Box>
        </>
        <DialogActions>
            <Button onClick={onDelete}>Confirm Delete</Button>
            <Button onClick={onCancel}>Cancel</Button>
        </DialogActions>
    </Dialog>
}