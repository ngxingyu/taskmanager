/* eslint-disable no-console */
import { PermissionProps, ProjectProps, TaskProps } from "../entities";
import { ProjectRepositoryProps } from "../entities/repositories";
import { AxiosResponse } from "axios";
import { Project } from "../entities/models";
import { Repository } from "./repository";

export class ProjectRepository
  extends Repository<ProjectProps>
  implements ProjectRepositoryProps
{
  queryTasks(
    project_id: number,
    query?: string,
    all_tags?: string[]
  ): Promise<AxiosResponse<TaskProps[]>> {
    return ProjectRepository.prototype.getAll(
      `/api/v1/projects/${project_id}/tasks`,
      { query, all_tags }
    );
  }
  createProject(
    name: string,
    permissions: PermissionProps[]
  ): Promise<AxiosResponse<ProjectProps>> {
    return ProjectRepository.prototype.create(
      "/api/v1/projects",
      new Project({ name, permissions })
    );
  }

  getAllProjects(): Promise<AxiosResponse<ProjectProps[]>> {
    return ProjectRepository.prototype.getAll("/api/v1/projects");
  }

  getProject(id: string, depth?: number): Promise<AxiosResponse<ProjectProps>> {
    return ProjectRepository.prototype.getById("/api/v1/projects", id, {
      depth,
    });
  }

  updateProject(
    id: string,
    name?: string,
    permissions?: PermissionProps[]
  ): Promise<AxiosResponse<ProjectProps>> {
    return ProjectRepository.prototype.update(
      `/api/v1/projects/${id}`,
      new Project({ name, permissions })
    );
  }

  deleteProject(id: string): Promise<AxiosResponse<boolean>> {
    return ProjectRepository.prototype.delete(`/api/v1/projects`, `${id}`);
  }
}
