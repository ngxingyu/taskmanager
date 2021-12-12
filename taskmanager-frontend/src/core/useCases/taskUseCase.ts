import { TaskRepositoryProps } from '../entities/repositories'
import { TaskProps } from '../entities'

export interface TaskService {
  getTaskById(id: number): Promise<TaskProps>
  deleteTask(id: number): Promise<boolean>
  updateTask(props: TaskProps): Promise<TaskProps>
  createTask(project_id: number, params: TaskProps): Promise<TaskProps>
}

export class TaskServiceImpl implements TaskService {
  taskRepo: TaskRepositoryProps

  constructor(tr: TaskRepositoryProps) {
    this.taskRepo = tr
  }
  getTaskById(id: number, depth = 2): Promise<TaskProps> {
    return this.taskRepo.getTask(String(id), depth).then((r) => r.data)
  }
  deleteTask(id: number): Promise<boolean> {
    return this.taskRepo.deleteTask(String(id)).then((r) => r.data)
  }
  updateTask(props: TaskProps): Promise<TaskProps> {
    return this.taskRepo.updateTask(props).then((r) => r.data)
  }
  createTask(project_id: number, params: TaskProps): Promise<TaskProps> {
    return this.taskRepo.createTask({project_id, params}).then((r) => r.data)
  }
}
