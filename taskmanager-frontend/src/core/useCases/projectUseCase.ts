import { ProjectRepositoryProps } from '../entities/repositories'
import { ProjectProps } from '../entities'

export interface ProjectService {
  getAllProjects(): Promise<ProjectProps[]>
  getProjectById(id: number): Promise<ProjectProps>
  deleteProject(id: number): Promise<boolean>
  updateProject(props: ProjectProps): Promise<ProjectProps>
  createProject(props: ProjectProps): Promise<ProjectProps>
}

export class ProjectServiceImpl implements ProjectService {
  projectRepo: ProjectRepositoryProps

  constructor(pr: ProjectRepositoryProps) {
    this.projectRepo = pr
  }
  getAllProjects(): Promise<ProjectProps[]> {
    return this.projectRepo.getAllProjects().then((r) => r.data)
  }
  getProjectById(id: number, depth = 2): Promise<ProjectProps> {
    return this.projectRepo.getProject(String(id), depth).then((r) => r.data)
  }
  deleteProject(id: number): Promise<boolean> {
    return this.projectRepo.deleteProject(String(id)).then((r) => r.data)
  }
  updateProject(props: ProjectProps): Promise<ProjectProps> {
    return this.projectRepo.updateProject(String(props.id), props.permissions).then((r) => r.data)
  }
  createProject(props: ProjectProps): Promise<ProjectProps> {
    return this.projectRepo.createProject(String(props.id), props.permissions).then((r) => r.data)
  }
}
