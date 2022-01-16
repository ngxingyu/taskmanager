import { ProjectRepositoryProps } from "../entities/repositories";
import { ProjectProps, TaskProps } from "../entities";

export interface ProjectService {
  getAllProjects(): Promise<ProjectProps[]>;
  getProjectById(id: number): Promise<ProjectProps>;
  deleteProject(id: number): Promise<boolean>;
  updateProject(props: ProjectProps): Promise<boolean>;
  createProject(props: ProjectProps): Promise<ProjectProps>;
  // Filter all tasks satisfying a query string OR containg any of the given tags belonging to the project.
  queryTasks(
    project_id: number,
    query?: string,
    all_tags?: string[]
  ): Promise<TaskProps[]>;
}

export class ProjectServiceImpl implements ProjectService {
  projectRepo: ProjectRepositoryProps;

  constructor(pr: ProjectRepositoryProps) {
    this.projectRepo = pr;
  }
  getAllProjects(): Promise<ProjectProps[]> {
    return this.projectRepo.getAllProjects().then((r) => {
      return r.data;
    });
  }
  getProjectById(id: number, depth = 4): Promise<ProjectProps> {
    return this.projectRepo.getProject(String(id), depth).then((r) => r.data);
  }
  deleteProject(id: number): Promise<boolean> {
    return this.projectRepo
      .deleteProject(String(id))
      .then((r) => r.status === 204);
  }
  updateProject(props: ProjectProps): Promise<boolean> {
    return this.projectRepo
      .updateProject(
        props.id?.toString() || "",
        String(props.name),
        props.permissions
      )
      .then((r) => r.status === 204);
  }
  createProject(props: ProjectProps): Promise<ProjectProps> {
    return this.projectRepo
      .createProject(String(props.name))
      .then((r) => r.data);
  }

  queryTasks(
    project_id: number,
    query?: string,
    all_tags?: string[]
  ): Promise<TaskProps[]> {
    return this.projectRepo
      .queryTasks(project_id, query, all_tags)
      .then((r) => r.data);
  }
}
