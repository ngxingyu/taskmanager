import { ThunkAction, ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'
import { PermissionProps, TaskProps } from 'core/entities'
import {
  TaskActionTypes,
  TaskCreatedAction,
  TaskCreateFailedAction,
  TaskCreatingAction,
  TaskDeletedAction,
  TaskDeleteFailedAction,
  TaskDeletingAction,
  TaskRetrievedAction,
  TaskRetrieveFailedAction,
  TaskRetrievingAction,
} from 'store/tasks/actions'
import { TaskRepository } from 'core/infrastructure/repositoryImpl'
import { TaskServiceImpl } from 'core/useCases/taskUseCase'

export const getTaskById = (
  id: number,
  depth = 2
): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    const taskRepo = new TaskRepository()
    const taskService = new TaskServiceImpl(taskRepo)
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        dispatch(retrievingTask())
        taskService
          .getTaskById(id, depth)
          .then((props) => {
            if (props.id === undefined) {
              dispatch(retrieveTaskFailed('invalid id obtained'))
            } else {
              dispatch(retrievedTask(props))
            }
          })
          .catch((e: string) => {
            dispatch(retrieveTaskFailed(e))
          })
        resolve()
      }, 3000)
    })
  }
}

export const retrieveTaskFailed = (message: string): TaskRetrieveFailedAction => {
  return { type: TaskActionTypes.RETRIEVE_FAILED, payload: { message } }
}
export const retrievingTask = (): TaskRetrievingAction => {
  return { type: TaskActionTypes.RETRIEVING }
}

export const retrievedTask = (tasks: TaskProps): TaskRetrievedAction => {
  return { type: TaskActionTypes.RETRIEVED, payload: tasks }
}

export const deleteTask = (id: number): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    const taskRepo = new TaskRepository()
    const taskService = new TaskServiceImpl(taskRepo)
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        dispatch(deletingTask())
        taskService
          .deleteTask(id)
          .then((props) => {
            if (props) {
              dispatch(deletedTask(id))
            } else {
              dispatch(deleteTaskFailed('Failed to delete task'))
            }
          })
          .catch((e: string) => {
            dispatch(deleteTaskFailed(e))
          })
        resolve()
      }, 3000)
    })
  }
}

export const deletingTask = (): TaskDeletingAction => {
  return { type: TaskActionTypes.DELETING }
}

export const deletedTask = (id: number): TaskDeletedAction => {
  return { type: TaskActionTypes.DELETED, payload: { id } }
}

export const deleteTaskFailed = (message: string): TaskDeleteFailedAction => {
  return {
    type: TaskActionTypes.DELETE_FAILED,
    payload: {
      message,
    },
  }
}

export const createTask = (project_id: number, task: TaskProps): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    const taskRepo = new TaskRepository()
    const taskService = new TaskServiceImpl(taskRepo)
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        dispatch(creatingTask())
        taskService
          .createTask(project_id,task)
          .then((props) => {
            if (props && props.id!==undefined) {
              dispatch(createdTask(props.id, task))
            } else {
              dispatch(createTaskFailed('Failed to create task'))
            }
          })
          .catch((e: string) => {
            dispatch(deleteTaskFailed(e))
          })
        resolve()
      }, 3000)
    })
  }
}


export const creatingTask = (): TaskCreatingAction => {
  return { type: TaskActionTypes.CREATING }
}

export const createdTask = (id: number, task: TaskProps): TaskCreatedAction => {
  return { type: TaskActionTypes.CREATED, payload: task }
}

export const createTaskFailed = (message: string): TaskCreateFailedAction => {
  return {
    type: TaskActionTypes.CREATE_FAILED,
    payload: {
      message,
    },
  }
}