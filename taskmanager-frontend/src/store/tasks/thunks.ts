import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { TaskProps } from "core/entities";
import {
  TaskActionTypes,
  TaskCreatedAction,
  TaskCreateFailedAction,
  TaskCreatingAction,
  TaskDeleteFailedAction,
  TaskDeletingAction,
  TaskRetrievedAction,
  TaskRetrieveFailedAction,
  TaskRetrievingAction,
  TaskUpdatedAction,
  TaskUpdateFailedAction,
  TaskUpdatingAction,
} from "store/tasks/actions";
import { TaskRepository } from "core/infrastructure/taskRepository";
import { TaskServiceImpl } from "core/useCases/taskUseCase";
import { deletedProjectTask, updateProjectTask } from "store/project/thunks";
import { TaskRepositoryProps } from "core/entities/repositories";

export const getTaskById = (
  id: number,
  depth = 4
): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    const taskRepo = new TaskRepository();
    const taskService = new TaskServiceImpl(taskRepo);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        dispatch(retrievingTask());
        taskService
          .getTaskById(id, depth)
          .then((props) => {
            if (props.id === undefined) {
              dispatch(retrieveTaskFailed("invalid id obtained"));
            } else {
              dispatch(retrievedTask(props));
            }
          })
          .catch((e: string) => {
            dispatch(retrieveTaskFailed(e));
          });
        resolve();
      }, 3000);
    });
  };
};

export const retrieveTaskFailed = (
  message: string
): TaskRetrieveFailedAction => {
  return { type: TaskActionTypes.RETRIEVE_FAILED, payload: { message } };
};
export const retrievingTask = (): TaskRetrievingAction => {
  return { type: TaskActionTypes.RETRIEVING };
};

export const retrievedTask = (tasks: TaskProps): TaskRetrievedAction => {
  return { type: TaskActionTypes.RETRIEVED, payload: tasks };
};

export const deleteTask = (
  project_id: number,
  id: number
): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    const taskRepo: TaskRepositoryProps = new TaskRepository();
    const taskService = new TaskServiceImpl(taskRepo);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        dispatch(deletingTask());
        taskService
          .deleteTask(id)
          .then((props) => {
            if (props) {
              dispatch(deletedProjectTask(project_id, id));
            } else {
              dispatch(deleteTaskFailed("Failed to delete task"));
            }
          })
          .catch((e: string) => {
            dispatch(deleteTaskFailed(e));
          });
        resolve();
      }, 3000);
    });
  };
};

export const deletingTask = (): TaskDeletingAction => {
  return { type: TaskActionTypes.DELETING };
};

// export const deletedTask = (id: number): TaskDeletedAction => {
//   return { type: TaskActionTypes.DELETED, payload: { id } };
// };

export const deleteTaskFailed = (message: string): TaskDeleteFailedAction => {
  return {
    type: TaskActionTypes.DELETE_FAILED,
    payload: {
      message,
    },
  };
};

export const createTask = (
  project_id: number,
  task: TaskProps
): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    const taskRepo = new TaskRepository();
    const taskService = new TaskServiceImpl(taskRepo);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        dispatch(creatingTask());
        taskService
          .createTask(project_id, task)
          .then((props) => {
            if (props && props.id !== undefined) {
              dispatch(createdTask(props.id, task));
              dispatch(updateProjectTask(project_id, props));
            } else {
              dispatch(createTaskFailed("Failed to create task"));
            }
          })
          .catch((e: string) => {
            dispatch(createTaskFailed(e));
          });
        resolve();
      }, 3000);
    });
  };
};

export const creatingTask = (): TaskCreatingAction => {
  return { type: TaskActionTypes.CREATING };
};

export const createdTask = (id: number, task: TaskProps): TaskCreatedAction => {
  return { type: TaskActionTypes.CREATED, payload: task };
};

export const createTaskFailed = (message: string): TaskCreateFailedAction => {
  return {
    type: TaskActionTypes.CREATE_FAILED,
    payload: {
      message,
    },
  };
};

export const updatingTask = (): TaskUpdatingAction => {
  return { type: TaskActionTypes.UPDATING };
};

export const updatedTask = (id: number, task: TaskProps): TaskUpdatedAction => {
  return { type: TaskActionTypes.UPDATED, payload: task };
};

export const updateTaskFailed = (message: string): TaskUpdateFailedAction => {
  return {
    type: TaskActionTypes.UPDATE_FAILED,
    payload: {
      message,
    },
  };
};

export const updateTask = (
  task: TaskProps
): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    const taskRepo = new TaskRepository();
    const taskService = new TaskServiceImpl(taskRepo);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        dispatch(updatingTask());
        taskService
          .updateTask(task.id || -1, {
            title: task.title,
            notes: task.notes,
            duration: task.duration,
            importance: task.importance,
            parent_id: task.parent_id,
            task_status_id: task.task_status_id,
            all_tags: task.all_tags || [],
          })
          .then((props) => {
            if (props) {
              dispatch(updatedTask(task.id || -1, task));
              dispatch(updateProjectTask(task.project_id || -1, task));
              // Do not update the project state, just the active project state.
            } else {
              dispatch(updateTaskFailed("Failed to update task"));
            }
          })
          .catch((e: string) => {
            dispatch(updateTaskFailed(e));
          });
        resolve();
      }, 1000);
    });
  };
};
