import { TaskProps } from "../entities";
import { TaskRepositoryProps } from "../entities/repositories";
import { AxiosResponse } from "axios";
import { Task } from "../entities/models";
import { Repository } from "./repository";
import { UpdateTaskProps } from "core/useCases/taskUseCase";
import API from "../services/axios-config";

export class TaskRepository
  extends Repository<TaskProps>
  implements TaskRepositoryProps
{
  getAllTasks(
    project_id: number,
    depth?: number
  ): Promise<AxiosResponse<TaskProps[]>> {
    return TaskRepository.prototype.getAll(
      `/api/v1/projects/${project_id}/tasks`,
      { depth }
    );
  }

  getTask(id: string, depth?: number): Promise<AxiosResponse<TaskProps>> {
    return TaskRepository.prototype.getById("/api/v1/tasks", id, { depth });
  }

  updateTask(
    id: number,
    params: UpdateTaskProps
  ): Promise<AxiosResponse<UpdateTaskProps>> {
    return API.put<UpdateTaskProps>(
      `/api/v1/tasks/${id?.toString(10) || ""}`,
      params
    );
    // return Repository<UpdateTaskProps>.prototype.update();
  }

  createTask({
    project_id,
    params,
  }: {
    project_id: number;
    params: TaskProps;
  }): Promise<AxiosResponse<TaskProps>> {
    return TaskRepository.prototype.create(
      `/api/v1/projects/${project_id}/tasks`,
      new Task(params)
    );
  }

  deleteTask(id: string): Promise<AxiosResponse<boolean>> {
    return TaskRepository.prototype.delete(`/api/v1/tasks`, `${id}`);
  }
}
