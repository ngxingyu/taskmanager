import { Dialog, useMediaQuery, DialogTitle, Box, DialogActions, Button, Tooltip } from "@mui/material";
import { DeleteDialog } from "components/DeleteDialog";
import { ProjectProps } from "core/entities";
import { FC, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { push } from "redux-first-history";
import { ApplicationState } from "store";
import { updateProject, deleteProject } from "store/project/thunks";
import { theme } from "theme";
import { EditProjectDescription } from "./EditProjectDescription";

export const ProjectDescription: FC<{ projectId: number }> = ({ projectId }) => {
    const [editing, toggleEditing] = useState(false);
    const [deleting, toggleDeleting] = useState(false);
    const projectInit = useSelector((state: ApplicationState) => state.project_state.projects[projectId] as ProjectProps)
    const [project, setProject] = useState(projectInit)
    const dispatch = useDispatch();
    const saveChanges = (p: ProjectProps) => {
        dispatch(updateProject(p, () => { toggleEditing(false) }));
    }
    const confirmDelete = (id: number) => {
        dispatch(deleteProject(id, () => { dispatch(push("/projects/")) }));
    }

    return <>
        <Dialog fullWidth fullScreen={useMediaQuery(theme.breakpoints.down('md'))} open={editing} onClose={toggleEditing}>

            <DialogTitle>Edit &ldquo;{project.name}&rdquo; Project details</DialogTitle>
            <EditProjectDescription project={project} onChange={setProject} />
            <DialogActions>
                <Button onClick={() => toggleDeleting(true)}>Delete</Button>
                <Button onClick={() => saveChanges(project)}>Save</Button>
                <Button onClick={() => toggleEditing(false)}>Cancel</Button>
            </DialogActions>
        </Dialog>
        {deleting && <DeleteDialog
            onCancel={() => toggleDeleting(false)}
            onDelete={() => (project.id !== undefined) && confirmDelete(project.id)}
            name={project.name || "Project"}
            warning="Note: you will not be able to recover any tasks within the project. Proceed with caution." />}
        <Box sx={{
            '&:hover': {
                background: "lightgray",
            }
        }}><Tooltip title="Edit Project Details" onClick={() => toggleEditing(true)}>
                <h1>{project.name || ""} </h1>
            </Tooltip>
        </Box>
    </>
};
