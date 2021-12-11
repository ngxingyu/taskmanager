import { ProjectProps } from "core/entities";

export enum ProjectActionTypes {
    CREATE = "Project/create",
    CREATING = "Project/creating",
    CREATED = "Project/created",
    CREATE_FAILED = "Project/create_failed",

    RETRIEVE = "Project/retrieve",
    RETRIEVING = "Project/retrieving",
    RETRIEVED = "Project/retrieved",
    RETRIEVE_FAILED = "Project/retrieve_failed",

    UPDATE = "Project/update",
    UPDATING = "Project/updating",
    UPDATED = "Project/updated",
    UPDATE_FAILED = "Project/update_failed",

    DELETE = "Project/delete",
    DELETING = "Project/deleting",
    DELETED = "Project/deleted",
    DELETE_FAILED = "Project/delete_failed",

    DROP_ALL = "Project/drop_all"
}

export interface ProjectCreateAction { type: ProjectActionTypes.CREATE; }
export interface ProjectCreatingAction { type: ProjectActionTypes.CREATING; }
export interface ProjectCreatedAction {
    type: ProjectActionTypes.CREATED;
    payload: [ProjectProps]
}
export interface ProjectCreateFailedAction {
    type: ProjectActionTypes.CREATE_FAILED;
    payload: { message: string }
}

export interface ProjectUpdateAction { type: ProjectActionTypes.UPDATE; }
export interface ProjectUpdatingAction { type: ProjectActionTypes.UPDATING; }
export interface ProjectUpdatedAction {
    type: ProjectActionTypes.UPDATED;
    payload: ProjectProps
}
export interface ProjectUpdateFailedAction {
    type: ProjectActionTypes.UPDATE_FAILED;
    payload: { message: string }
}

export interface ProjectDeleteAction { type: ProjectActionTypes.DELETE; }
export interface ProjectDeletingAction { type: ProjectActionTypes.DELETING; }
export interface ProjectDeletedAction {
    type: ProjectActionTypes.DELETED;
    payload: { id: number }
}
export interface ProjectDeleteFailedAction {
    type: ProjectActionTypes.DELETE_FAILED;
    payload: { message: string }
}


export interface ProjectRetrieveAction { type: ProjectActionTypes.RETRIEVE; }
export interface ProjectRetrievingAction { type: ProjectActionTypes.RETRIEVING; }
export interface ProjectRetrievedAction {
    type: ProjectActionTypes.RETRIEVED;
    payload: ProjectProps[]
}
export interface ProjectRetrieveFailedAction {
    type: ProjectActionTypes.RETRIEVE_FAILED;
    payload: { message: string }
}

export interface ProjectDropAllAction { type: ProjectActionTypes.DROP_ALL }

export type ProjectAction = ProjectCreateAction | ProjectCreatingAction | ProjectCreatedAction | ProjectCreateFailedAction |
    ProjectRetrieveAction | ProjectRetrievingAction | ProjectRetrievedAction | ProjectRetrieveFailedAction |
    ProjectUpdateAction | ProjectUpdatingAction | ProjectUpdatedAction | ProjectUpdateFailedAction |
    ProjectDeleteAction | ProjectDeletingAction | ProjectDeletedAction | ProjectDeleteFailedAction|
    ProjectDropAllAction;