import { TaskProps } from 'core/entities'
import { Action } from 'redux'

export enum TaskActionTypes {
  CREATE = 'task/create',
  CREATING = 'task/creating',
  CREATED = 'task/created',
  CREATE_FAILED = 'task/create_failed',

  RETRIEVE = 'task/retrieve',
  RETRIEVING = 'task/retrieving',
  RETRIEVED = 'task/retrieved',
  RETRIEVE_FAILED = 'task/retrieve_failed',

  UPDATE = 'task/update',
  UPDATING = 'task/updating',
  UPDATED = 'task/updated',
  UPDATE_FAILED = 'task/update_failed',

  DELETE = 'task/delete',
  DELETING = 'task/deleting',
  DELETED = 'task/deleted',
  DELETE_FAILED = 'task/delete_failed',
}

export interface TaskCreateAction extends Action {
  type: TaskActionTypes.CREATE
}
export interface TaskCreatingAction extends Action {
  type: TaskActionTypes.CREATING
}
export interface TaskCreatedAction extends Action {
  type: TaskActionTypes.CREATED
  payload: TaskProps
}
export interface TaskCreateFailedAction extends Action {
  type: TaskActionTypes.CREATE_FAILED
  payload: { message: string }
}

export interface TaskUpdateAction extends Action {
  type: TaskActionTypes.UPDATE
}
export interface TaskUpdatingAction extends Action {
  type: TaskActionTypes.UPDATING
}
export interface TaskUpdatedAction extends Action {
  type: TaskActionTypes.UPDATED
  payload: TaskProps
}
export interface TaskUpdateFailedAction extends Action {
  type: TaskActionTypes.UPDATE_FAILED
  payload: { message: string }
}

export interface TaskDeleteAction extends Action {
  type: TaskActionTypes.DELETE
}
export interface TaskDeletingAction extends Action {
  type: TaskActionTypes.DELETING
}
export interface TaskDeletedAction extends Action {
  type: TaskActionTypes.DELETED
  payload: { id: number }
}
export interface TaskDeleteFailedAction extends Action {
  type: TaskActionTypes.DELETE_FAILED
  payload: { message: string }
}

export interface TaskRetrieveAction extends Action {
  type: TaskActionTypes.RETRIEVE
}
export interface TaskRetrievingAction extends Action {
  type: TaskActionTypes.RETRIEVING
}
export interface TaskRetrievedAction extends Action {
  type: TaskActionTypes.RETRIEVED
  payload: TaskProps
}
export interface TaskRetrieveFailedAction extends Action {
  type: TaskActionTypes.RETRIEVE_FAILED
  payload: { message: string }
}

export type TaskAction =
  | TaskCreateAction
  | TaskCreatingAction
  | TaskCreatedAction
  | TaskCreateFailedAction
  | TaskRetrieveAction
  | TaskRetrievingAction
  | TaskRetrievedAction
  | TaskRetrieveFailedAction
  | TaskUpdateAction
  | TaskUpdatingAction
  | TaskUpdatedAction
  | TaskUpdateFailedAction
  | TaskDeleteAction
  | TaskDeletingAction
  | TaskDeletedAction
  | TaskDeleteFailedAction
