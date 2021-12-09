
import { Duration } from 'moment';

export interface Project {
    id: number;
    name: string;
    created_at: Date;
    updated_at: Date;
    role: Array<UserRole>;
    tasks: Array<Task>;
}

export interface Task {
    name: string;
    notes: string;
    parent_id: number | null;
    importance: number;
    status: TaskStatus;
    deadline: Date;
    duration: Duration;
    created_at: Date;
    updated_at: Date;
    subtasks: Array<Task>;
    tags: Array<Tag>;
}

export interface User {
    id: number;
    name: string;
    email: string;
    // admin: boolean;
}

enum Role {
    Owner,
    Editor,
    Viewer
}
type UserRole = {
    email: string;
    role: Role;
}

type Tag = {
    id: number;
    project_id: number;
    name: string;
    color: number;
}
enum TaskStatus {
    Todo,
    InProgress,
    Completed
}

export enum ApiStatus {
    LOADING = 'loading',
    LOADED = 'loaded',
    FAILED = 'failed'
}
