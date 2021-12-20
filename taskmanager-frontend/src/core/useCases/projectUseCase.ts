import { ProjectRepositoryProps } from "../entities/repositories";
import { ProjectProps } from "../entities";

export interface ProjectService {
  getAllProjects(): Promise<ProjectProps[]>;
  getProjectById(id: number): Promise<ProjectProps>;
  deleteProject(id: number): Promise<boolean>;
  updateProject(props: ProjectProps): Promise<boolean>;
  createProject(props: ProjectProps): Promise<ProjectProps>;
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
  getProjectById(id: number, depth = 5): Promise<ProjectProps> {
    return this.projectRepo.getProject(String(id), depth).then((r) => r.data);
  }
  deleteProject(id: number): Promise<boolean> {
    return this.projectRepo.deleteProject(String(id)).then((r) => r.status===204);
  }
  updateProject(props: ProjectProps): Promise<boolean> {
    return this.projectRepo
      .updateProject(props.id?.toString()||"", String(props.name), props.permissions)
      .then((r) => r.status===204);
  }
  createProject(props: ProjectProps): Promise<ProjectProps> {
    return this.projectRepo
      .createProject(String(props.name))
      .then((r) => r.data);
  }
}
