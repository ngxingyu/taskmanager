import { PermissionProps, ProjectProps, Role, TaskProps, UserRole } from "core/entities";
import React, {
  FC,
  useEffect,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getProjectById, updateProject } from "store/project/thunks";
import { useActiveProject } from ".";
import { createTask } from "store/tasks/thunks";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import TaskList from "components/Tasks/TaskList";
import CreateEntry from "components/CreateEntry";
import Editable from "components/Editable";
import EditPermission from "./EditPermission";
import { ApplicationState } from "store";
import AddPermission from "./AddPermissions";

const Project = () => {
  const activeProject = useActiveProject();
  const dispatch = useDispatch();
  const { projectId: id } = useParams();
  const projectId: number | undefined =
    id === undefined ? id : parseInt(id, 10);
  useEffect(() => {
    dispatch(getProjectById((projectId !== undefined && projectId) || -1, 2));
  }, [dispatch]);
  const createTaskCallback = (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title")?.valueOf().toString() || "";
    dispatch(createTask(projectId || -1, { title } as TaskProps));
  };
  return (
    <>
      {activeProject !== undefined && (
        projectId !== undefined &&
        <Stack key={projectId}>
          <ProjectDescription projectId={projectId} />
          <Tasks tasks={activeProject.tasks} />
          <CreateEntry
            onSubmit={createTaskCallback}
            initValue=""
            id="title"
            label='Enter new task'
          />
        </Stack>
      )}
    </>
  );
};

const SetPermissions: FC<{
  permissions: UserRole[],
  callback: (permissions: UserRole[]) => void;
}> = ({ permissions, callback }) => {
  const [state, setState] = useState(permissions)
  const handleUpdate = (i: number) => (newPermission?: PermissionProps) => {
    let newState;
    if (newPermission !== undefined) {
      newState = state.map((item, idx) => idx === i ? newPermission : item)
    } else {
      newState = state.filter((_, idx) => idx !== i)
    }
    setState(newState);
    callback(newState);
  }
  const handleCreate = (newPermissions: PermissionProps[]) => {
    if (newPermissions.length !== 0) {
      const newState = [...state, ...newPermissions]
      setState(newState)
      callback(newState);
    }
  }

  return <>{permissions.map((x, i) => {
    return <EditPermission key={i} permission={x} callback={handleUpdate(i)} />
  })}
    <Typography>Add New User</Typography>
    <AddPermission callback={handleCreate} />
  </>
}

const EditProjectDescription: FC<{ project: ProjectProps, onChange: (project: ProjectProps) => void }> = ({ project, onChange }) => {
  const update = (newProjectState: ProjectProps) => {
    onChange(newProjectState);
  }
  return (<Box>
    <Editable
      text={project.name || ""}
      label="Name: "
      name="title"
      placeholder="Project name"
      callback={(x: string) => update({ ...project, name: x })}
    />
    <SetPermissions permissions={project.permissions || []} callback={(x: UserRole[]) => update({ ...project, permissions: x })} />
  </Box>)
}
const ProjectDescription: FC<{ projectId: number }> = ({ projectId }) => {
  const [editing, toggleEditing] = useState(false);
  const projectInit = useSelector((state: ApplicationState) => state.project_state.projects[projectId] as ProjectProps)
  const [project, setProject] = useState(projectInit)
  const dispatch = useDispatch();
  const saveChanges = (p: ProjectProps) => {
    dispatch(updateProject(p, () => { toggleEditing(false) }));
  }
  const theme = useTheme();
  return <> {
    <>
      <Dialog fullWidth={useMediaQuery(theme.breakpoints.down('md'))} open={editing} onClose={toggleEditing}>
        <DialogTitle>Edit &ldquo;{project.name}&rdquo; Project details</DialogTitle>
        <EditProjectDescription project={project} onChange={setProject} />
        <DialogActions>
          <Button onClick={() => saveChanges(project)}>Save</Button>
          <Button onClick={() => toggleEditing(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
      <Box sx={{
        '&:hover': {
          background: "lightgray",
        }
      }}><Tooltip title="Edit Project Details" onClick={() => toggleEditing(true)}>
          <h1>{project.name || ""} </h1>
        </Tooltip>
      </Box>
    </>
  }
  </>
};

const Tasks = ({ tasks }: { tasks: { [key: number]: TaskProps } }) => {
  return (
    <TaskList tasks={tasks} />
  );
};

export default Project;
