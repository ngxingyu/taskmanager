import { AxiosResponse } from 'axios';
import { PermissionProps, ProjectProps, TagProps, TaskProps, UserProps } from './index';

export interface ReadProps<T> {

    getAll(route: string, params?: any): Promise<AxiosResponse<T[]>>;
    getById(route: string, id: string, params?: any): Promise<AxiosResponse<T>>;
}

export interface WriteProps<T> {
    create(route: string, model: T): Promise<AxiosResponse<T | boolean>>;
    update(route: string, model: T): Promise<AxiosResponse<T | boolean>>;
    delete(route: string, id: string, data?: any): Promise<AxiosResponse<boolean>>;
}

export interface RepositoryProps<T> extends WriteProps<T>, ReadProps<T> { }

export interface UserRepositoryProps extends RepositoryProps<UserProps> {
    logIn(email: string, password: string): Promise<AxiosResponse<UserProps>>;
    signUp(name: string, email: string, password: string, confirmation_password: string): Promise<AxiosResponse<UserProps>>;
    deleteAccount(id: number, password: string): Promise<AxiosResponse<boolean>>;
    getProfile(): Promise<AxiosResponse<UserProps>>;
}

export interface ProjectRepositoryProps extends RepositoryProps<ProjectProps> {
    getAllProjects(): Promise<AxiosResponse<ProjectProps[]>>;
    getProject(id: string, depth?: number): Promise<AxiosResponse<ProjectProps>>
    updateProject(name?: string, permissions?: PermissionProps[]): Promise<AxiosResponse<ProjectProps>>
    createProject(name: string, permissions: PermissionProps[]): Promise<AxiosResponse<ProjectProps>>
    deleteProject(id: string): Promise<AxiosResponse<boolean>>;
}

export interface TaskRepositoryProps extends RepositoryProps<TaskProps> {
    getAllTasks(project_id: number, depth?: number): Promise<AxiosResponse<TaskProps[]>>;
    getTask(id: string, depth?: number): Promise<AxiosResponse<TaskProps>>
    updateTask(params: TaskProps): Promise<AxiosResponse<TaskProps>>
    createTask({ project_id, params }:
        { project_id: number, params: TaskProps}): Promise<AxiosResponse<TaskProps>>
    deleteTask(id: string): Promise<AxiosResponse<boolean>>;
}

export interface TagRepositoryProps extends RepositoryProps<TagProps> {
    getProjectTags(project_id: number): Promise<AxiosResponse<TagProps[]>>;
}