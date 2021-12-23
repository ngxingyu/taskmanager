import { Duration } from "moment";

export interface ProjectProps {
  name?: string;
  id?: number;
  created_at?: Date;
  updated_at?: Date;
  permissions?: UserRole[];
  tasks?: TaskProps[];
}

export interface TaskProps {
  id?: number;
  title?: string;
  notes?: string;
  parent_id?: number | null;
  project_id?: number;
  importance?: number;
  task_status_id?: TaskStatus;
  deadline?: Date;
  duration?: Duration;
  created_at?: Date;
  updated_at?: Date;
  subtasks?: TaskProps[];
  all_tags?: string[];
  // tags?: TagProps[];
}

export interface SearchTaskProps {
  query?: string;
  project_id?: number;
  importance?: number;
  task_status_id?: TaskStatus;
  // deadline?: Date;
  // duration?: Duration;
  // created_at?: Date;
  // updated_at?: Date;
  all_tags?: string[];
  // tags?: TagProps[];
}

export interface UserProps {
  email?: string;
  name?: string;
  password?: string;
  password_confirmation?: string;
  id?: number;
  admin?: boolean;
  auth_token?: string;
  projects?: ProjectProps[];
}

export interface PermissionProps {
  email: string;
  role: Role;
}

export enum Role {
  Owner,
  Editor,
  Viewer,
}

export type UserRole = {
  email: string;
  role: Role;
};

export interface TagProps {
  id?: number;
  project_id: number;
  name: string;
  color?: number;
}
export enum TaskStatus {
  Todo,
  InProgress,
  Completed,
}

export enum ApiStatus {
  LOADING = "loading",
  LOADED = "loaded",
  FAILED = "failed",
}
