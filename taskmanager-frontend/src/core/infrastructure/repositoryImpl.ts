/* eslint-disable max-classes-per-file */
import {PermissionProps, ProjectProps, TagProps, TaskProps, UserProps} from "../entities/";
import {
    ProjectRepositoryProps,
    RepositoryProps,
    TagRepositoryProps,
    TaskRepositoryProps,
    UserRepositoryProps
} from "../entities/repositories";
import API from "../../core/services/axios-config"
import {AxiosResponse} from "axios";
import {Project, Task, User} from "../entities/models";

export class Repository<T> implements RepositoryProps<T> {
    create(route: string, model: T): Promise<AxiosResponse<T>> {
        return API.post<T>(route, model);
    }

    update(route: string, model: T): Promise<AxiosResponse<T>> {
        return API.put<T>(route, model)
    }

    delete(route: string, id: string, data?: any): Promise<AxiosResponse<boolean>> {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        return API.delete(route, {data: {id, data}});
    }

    getAll(route: string, params?: any): Promise<AxiosResponse<T[]>> {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        return API.get<T[]>(route, {params});
    }

    getById(route: string, id: string, params?: any): Promise<AxiosResponse<T>> {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        return API.get<T>(route, {params: {id, params}});
    }

}

export class UserRepository extends Repository<UserProps> implements UserRepositoryProps {
    async logIn(email: string, password: string): Promise<AxiosResponse<UserProps>> {
        return API.post<User>("/login", new User({email, password}));
    }

    async signUp(name: string, email: string, password: string, password_confirmation: string): Promise<AxiosResponse<UserProps>> {
        return UserRepository.prototype.create("/signup", new User({email, name, password, password_confirmation}))
    }

    async deleteAccount(id: number, password: string): Promise<AxiosResponse<boolean>> {
        return UserRepository.prototype.delete(`/api/v1/users`, `${id}`, {password})
    }
    async getProfile(): Promise<AxiosResponse<UserProps>> {
        return API.get("/profile");
    }
}

export class ProjectRepository extends Repository<ProjectProps> implements ProjectRepositoryProps {
    createProject(name: string, permissions: PermissionProps[]): Promise<AxiosResponse<ProjectProps>> {
        return ProjectRepository.prototype.create("/api/v1/projects", new Project({name, permissions}));
    }

    getAllProjects(): Promise<AxiosResponse<ProjectProps[]>> {
        return ProjectRepository.prototype.getAll("/api/v1/projects");
    }

    getProject(id: string, depth?: number): Promise<AxiosResponse<ProjectProps>> {
        return ProjectRepository.prototype.getById("/api/v1/projects", id, {depth});
    }

    updateProject(name?: string, permissions?: PermissionProps[]): Promise<AxiosResponse<ProjectProps>> {
        return ProjectRepository.prototype.update("api/v1/projects", new Project({name, permissions}))
    }

    deleteProject(id: string): Promise<AxiosResponse<boolean>> {
        return ProjectRepository.prototype.delete(`/api/v1/projects`, `${id}`)
    }
}


export class TaskRepository extends Repository<TaskProps> implements TaskRepositoryProps {
    getAllTasks(project_id: number, depth?: number): Promise<AxiosResponse<TaskProps[]>> {
        return TaskRepository.prototype.getAll(`/api/v1/projects/${project_id}/tasks`, {depth});
    }

    getTask(id: string, depth?: number): Promise<AxiosResponse<TaskProps>> {
        return TaskRepository.prototype.getById("/api/v1/tasks", id, {depth});
    }

    updateTask(params: TaskProps): Promise<AxiosResponse<TaskProps>> {
        return TaskRepository.prototype.update("api/v1/tasks", params)
    }

    createTask({
                   project_id, params
               }: {
        project_id: number,
        params: TaskProps
    }): Promise<AxiosResponse<TaskProps>> {

        return TaskRepository.prototype.create(`/api/v1/projects/${project_id}/tasks`,
            new Task(params))
    }

    deleteTask(id: string): Promise<AxiosResponse<boolean>> {
        return TaskRepository.prototype.delete(`/api/v1/tasks`, `${id}`)
    }

}

export class TagRepository extends Repository<TagProps> implements TagRepositoryProps {
    getProjectTags(project_id: number): Promise<AxiosResponse<TagProps[]>> {
        return TagRepository.prototype.getAll(`/api/v1/projects/${project_id}/tags`);
    }
}