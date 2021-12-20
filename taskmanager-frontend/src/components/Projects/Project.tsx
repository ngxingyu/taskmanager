
import { TaskProps } from "core/entities";
import React, {
  useEffect,
  useState,
} from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getProjectById } from "store/project/thunks";
import { useActiveProject } from ".";
import { createTask } from "store/tasks/thunks";
import { Stack } from "@mui/material";
import TaskList from "components/Tasks/TaskList";
import CreateEntry from "components/CreateEntry";
import { ProjectStateProps } from "store/project/reducer";
import { ProjectDescription } from "./ProjectDescription";

const Project = () => {
  const { projects, activeProjectId } = useActiveProject();
  const dispatch = useDispatch();
  const { projectId: id } = useParams();
  const projectId: number | undefined = id === undefined ? id : parseInt(id, 10);
  useEffect(() => {
    dispatch(getProjectById((projectId !== undefined && projectId) || -1, 5));
  }, []);
  const [activeProject, setActiveProject] = useState<ProjectStateProps | undefined>(undefined);
  useEffect(() => {
    setActiveProject(projects[projectId || activeProjectId]);
  }, [projects, projectId])
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
          <Tasks tasks={activeProject.tasks || {}} />
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


const Tasks = ({ tasks }: { tasks: { [key: number]: TaskProps } }) => {
  return (
    <TaskList tasks={tasks} />
  );
};

export default Project;
