// eslint-disable-next-line max-classes-per-file
import moment, { Duration } from "moment";
import { ProjectProps, Role, TaskProps, TaskStatus, TagProps, UserProps } from ".";

export class Project implements ProjectProps {
    constructor({name, id, created_at, updated_at, permissions, tasks}: {
        name?: string;
        id?: number;
        created_at?: Date;
        updated_at?: Date;
        permissions?: { email: string; role: Role; }[];
        tasks?: Task[];
    }) {
        this.name = name;
        this.id = id;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.permissions = permissions;
        this.tasks = tasks;
    }

    name?: string;
    id?: number;
    created_at?: Date;
    updated_at?: Date;
    permissions?: { email: string; role: Role; }[];
    tasks?: Task[];
}

const next_week = () => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);
}

export class Task implements TaskProps {
    constructor({
                    name, notes, parent_id = null, importance = 0, status = TaskStatus.Todo,
                    deadline = next_week(), duration = moment.duration({hours: 1}),
                    created_at, updated_at, subtasks, tags = []
                }: {
                    name?: string,
                    notes?: string,
                    parent_id?: number | null,
                    importance?: number,
                    status?: TaskStatus,
                    deadline?: Date,
                    duration?: Duration,
                    created_at?: Date,
                    updated_at?: Date,
                    subtasks?: Task[],
                    tags?: TagProps[]
                }
    ) {
        this.name = name;
        this.notes = notes;
        this.parent_id = parent_id;
        this.importance = importance;
        this.status = status;
        this.deadline = deadline;
        this.duration = duration;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.subtasks = subtasks;
        this.tags = tags;
    }

    name?: string;
    notes?: string;
    parent_id?: number | null;
    importance?: number;
    status?: TaskStatus;
    deadline?: Date;
    duration?: Duration;
    created_at?: Date;
    updated_at?: Date;
    subtasks?: Task[];
    tags?: TagProps[];
}

export class User implements UserProps {
    constructor({email, name, password, password_confirmation, id, admin = false, auth_token}: {
        id?: number,
        name?: string,
        email: string,
        admin?: boolean,
        password?: string,
        password_confirmation?: string,
        auth_token?: string
    }) {
        this.email = email;
        this.name = name;
        this.password = password;
        this.password_confirmation = password_confirmation;
        this.id = id;
        this.admin = admin;
        this.auth_token = auth_token;
    }

    id?: number;
    name?: string;
    email: string;
    admin: boolean;
    password?: string;
    password_confirmation?: string;
    auth_token?: string;
}