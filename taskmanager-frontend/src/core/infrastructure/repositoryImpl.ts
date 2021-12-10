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
        return API.post(route, model);
    }

    update(route: string, model: T): Promise<AxiosResponse<T>> {
        return API.put(route, model)
    }

    delete(route: string, id: string, data?: any): Promise<AxiosResponse<boolean>> {
        return API.delete(route, {data: {id: id, data}});
    }

    getAll(route: string, params?: any): Promise<AxiosResponse<T[]>> {
        return API.get(route, {params: params});
    }

    getById(route: string, id: string, params?: any): Promise<AxiosResponse<T>> {
        return API.get(route, {params: {id: id, params}});
    }

}

export class UserRepository extends Repository<UserProps> implements UserRepositoryProps {
    async logIn(email: string, password: string): Promise<AxiosResponse<UserProps>> {
        return Repository.prototype.create("/login", new User({email, password}));
    }

    async signUp(name: string, email: string, password: string, password_confirmation: string): Promise<AxiosResponse<UserProps>> {
        return Repository.prototype.create("/signup", new User({email, name, password, password_confirmation}))
    }

    async deleteAccount(id: number, password: string): Promise<AxiosResponse<boolean>> {
        return Repository.prototype.delete(`/api/v1/users`, `${id}`, {password: password})
    }
    async getProfile(): Promise<AxiosResponse<UserProps>> {
        return API.get("/profile");
    }
}

export class ProjectRepository extends Repository<ProjectProps> implements ProjectRepositoryProps {
    createProject(name: string, permissions: PermissionProps[]): Promise<AxiosResponse<ProjectProps>> {
        return Repository.prototype.create("/api/v1/projects", new Project({name, permissions}));
    }

    getAllProjects(): Promise<AxiosResponse<ProjectProps[]>> {
        return Repository.prototype.getAll("/api/v1/projects");
    }

    getProject(id: string, depth?: number): Promise<AxiosResponse<ProjectProps>> {
        return Repository.prototype.getById("/api/v1/projects", id, {depth});
    }

    updateProject(name?: string, permissions?: PermissionProps[]): Promise<AxiosResponse<ProjectProps>> {
        return Repository.prototype.update("api/v1/projects", new Project({name, permissions}))
    }

    deleteProject(id: string): Promise<AxiosResponse<boolean>> {
        return Repository.prototype.delete(`/api/v1/projects`, `${id}`)
    }
}


export class TaskRepository extends Repository<TaskProps> implements TaskRepositoryProps {
    getAllTasks(project_id: number, depth?: number): Promise<AxiosResponse<TaskProps[]>> {
        return Repository.prototype.getAll(`/api/v1/projects/${project_id}/tasks`, {depth});
    }

    getTask(id: string, depth?: number): Promise<AxiosResponse<TaskProps>> {
        return Repository.prototype.getById("/api/v1/tasks", id, {depth});
    }

    updateTask(params: TaskProps): Promise<AxiosResponse<TaskProps>> {
        return Repository.prototype.update("api/v1/tasks", params)
    }

    createTask({
                   project_id, params
               }: {
        project_id: number,
        params: TaskProps
    }): Promise<AxiosResponse<TaskProps>> {

        return this.create(`/api/v1/projects/${project_id}/tasks`,
            new Task(params))
    }

    deleteTask(id: string): Promise<AxiosResponse<boolean>> {
        return Repository.prototype.delete(`/api/v1/tasks`, `${id}`)
    }

}

export class TagRepository extends Repository<TagProps> implements TagRepositoryProps {
    getProjectTags(project_id: number): Promise<AxiosResponse<TagProps[]>> {
        return Repository.prototype.getAll(`/api/v1/projects/${project_id}/tags`);
    }
}