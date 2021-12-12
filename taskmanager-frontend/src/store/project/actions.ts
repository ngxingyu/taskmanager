import { PermissionProps, ProjectProps, TaskProps } from 'core/entities'
import { Action } from 'redux'

export enum ProjectActionTypes {
  CREATE = 'project/create',
  CREATING = 'project/creating',
  CREATED = 'project/created',
  CREATE_FAILED = 'project/create_failed',

  RETRIEVE = 'project/retrieve',
  RETRIEVING = 'project/retrieving',
  RETRIEVED = 'project/retrieved',
  RETRIEVE_FAILED = 'project/retrieve_failed',

  UPDATE = 'project/update',
  UPDATING = 'project/updating',
  UPDATED = 'project/updated',
  UPDATE_FAILED = 'project/update_failed',

  DELETE = 'project/delete',
  DELETING = 'project/deleting',
  DELETED = 'project/deleted',
  DELETE_FAILED = 'project/delete_failed',

  DROP_ALL = 'project/drop_all',
  SELECT = 'project/select',
}

export interface ProjectCreateAction extends Action {
  type: ProjectActionTypes.CREATE
}
export interface ProjectCreatingAction extends Action {
  type: ProjectActionTypes.CREATING
}
export interface ProjectCreatedAction extends Action {
  type: ProjectActionTypes.CREATED
  payload: [ProjectProps]
}
export interface ProjectCreateFailedAction extends Action {
  type: ProjectActionTypes.CREATE_FAILED
  payload: { message: string }
}

export interface ProjectUpdateAction extends Action {
  type: ProjectActionTypes.UPDATE
}
export interface ProjectUpdatingAction extends Action {
  type: ProjectActionTypes.UPDATING
}
export interface ProjectUpdatedAction extends Action {
  type: ProjectActionTypes.UPDATED
  payload: ProjectProps
}
export interface ProjectUpdateFailedAction extends Action {
  type: ProjectActionTypes.UPDATE_FAILED
  payload: { message: string }
}

export interface ProjectDeleteAction extends Action {
  type: ProjectActionTypes.DELETE
}
export interface ProjectDeletingAction extends Action {
  type: ProjectActionTypes.DELETING
}
export interface ProjectDeletedAction extends Action {
  type: ProjectActionTypes.DELETED
  payload: { id: number }
}
export interface ProjectDeleteFailedAction extends Action {
  type: ProjectActionTypes.DELETE_FAILED
  payload: { message: string }
}

export interface ProjectRetrieveAction extends Action {
  type: ProjectActionTypes.RETRIEVE
}
export interface ProjectRetrievingAction extends Action {
  type: ProjectActionTypes.RETRIEVING
}
export interface ProjectRetrievedAction extends Action {
  type: ProjectActionTypes.RETRIEVED
  payload: ProjectProps[]
}
export interface ProjectRetrieveFailedAction extends Action {
  type: ProjectActionTypes.RETRIEVE_FAILED
  payload: { message: string }
}

export interface ProjectDropAllAction extends Action {
  type: ProjectActionTypes.DROP_ALL
}
export interface ProjectSelectAction extends Action {
  type: ProjectActionTypes.SELECT
  payload: {
    id: number
    permissions: PermissionProps[]
    tasks: TaskProps[]
  }
}

export type ProjectAction =
  | ProjectCreateAction
  | ProjectCreatingAction
  | ProjectCreatedAction
  | ProjectCreateFailedAction
  | ProjectRetrieveAction
  | ProjectRetrievingAction
  | ProjectRetrievedAction
  | ProjectRetrieveFailedAction
  | ProjectUpdateAction
  | ProjectUpdatingAction
  | ProjectUpdatedAction
  | ProjectUpdateFailedAction
  | ProjectDeleteAction
  | ProjectDeletingAction
  | ProjectDeletedAction
  | ProjectDeleteFailedAction
  | ProjectDropAllAction
  | ProjectSelectAction
