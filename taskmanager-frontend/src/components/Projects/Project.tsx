import { TaskProps } from "core/entities";
import React, {
  FC,
  useEffect,
  useState,
} from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getProjectById } from "store/project/thunks";
import { useActiveProject } from ".";
import { createTask } from "store/tasks/thunks";
import { List, ListItem, Stack } from "@mui/material";
import TaskList from "components/Tasks/TaskList";
import CreateEntry from "components/CreateEntry";
import { ProjectStateProps } from "store/project/reducer";
import { ProjectDescription } from "./ProjectDescription";
import Search from "./Search";
import TaskDetails from "components/Tasks/TaskDetails";

const Project: FC = () => {
  const { projects, activeProjectId } = useActiveProject();
  const dispatch = useDispatch();
  const { projectId: id } = useParams();
  const projectId: number | undefined = id === undefined ? id : parseInt(id, 10);
  useEffect(() => {
    if (projectId !== undefined) {
      dispatch(getProjectById(projectId, 3));
    }
  }, [projectId]);
  const [activeProject, setActiveProject] = useState<ProjectStateProps | undefined>(undefined);
  useEffect(() => {
    setActiveProject(projects[projectId || activeProjectId]);
  }, [projects, projectId])
  const createTaskCallback = (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title")?.valueOf().toString() || "";
    if (projectId !== undefined) {
      dispatch(createTask(projectId, { title } as TaskProps));
    }
  };

  return (
    <>
      {activeProject !== undefined && (
        projectId !== undefined &&

        <Stack key={projectId}>
          <ProjectDescription projectId={projectId} />
          <Search title="Filter tasks" projectId={projectId} />
          {(activeProject.query || []).length > 0 ?
            <QueryResult tasks={activeProject.query || []} /> :
            <Tasks tasks={activeProject.tasks || {}} />}
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


const Tasks: FC<{ tasks: { [key: number]: TaskProps } }> = ({ tasks }) => {
  return (
    <TaskList tasks={tasks} />
  );
};

const QueryResult: FC<{ tasks: TaskProps[] }> = ({ tasks }) => {
  return <List sx={{ width: '100%' }} disablePadding>
    {tasks.map((task) => (
      <ListItem
        key={task.id}
        disableGutters
        sx={{ padding: '0' }}
      >
        <TaskDetails task={task} />
      </ListItem>
    ))}
  </List>
}

export default Project;