import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { ProjectServiceImpl } from "core/useCases/projectUseCase";
import { PermissionProps, ProjectProps, TaskProps } from "core/entities";
import {
  ProjectActionTypes,
  ProjectCreatedAction,
  ProjectCreatedTaskAction,
  ProjectCreateFailedAction,
  ProjectCreatingAction,
  ProjectDeletedAction,
  ProjectDeletedTaskAction,
  ProjectDeleteFailedAction,
  ProjectDeletingAction,
  ProjectDropAllAction,
  ProjectRetrievedAction,
  ProjectRetrieveFailedAction,
  ProjectRetrievingAction,
  ProjectSelectAction,
  ProjectTasksRetrievedAction,
  ProjectTasksRetrieveFailedAction,
  ProjectTasksRetrievingAction,
  ProjectUpdatedAction,
  ProjectUpdatedTaskAction,
  ProjectUpdateFailedAction,
  ProjectUpdatingAction,
  SetActiveProjectAction,
} from "store/project/actions";
import { push } from "redux-first-history";
import { ProjectRepository } from "core/infrastructure/projectRepository";

/**
 * Retrieves project along with its contained tasks up to a certain depth.
 *
 * @param id project id
 * @param depth number of task levels to retrieve
 * @returns Thunk
 */
export const getProjectById = (
  id: number,
  depth = 4
): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    const projectRepo = new ProjectRepository();
    const projectService = new ProjectServiceImpl(projectRepo);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        dispatch(retrievingProjects());
        projectService
          .getProjectById(id, depth)
          .then((props) => {
            if (props.id === undefined) {
              dispatch(retrieveProjectsFailed("invalid id obtained"));
            } else {
              dispatch(retrievedProjects([props]));
              dispatch(
                selectedProject(props.id, props.permissions, props.tasks)
              );
              dispatch(push(`/projects/${props.id}`));
            }
          })
          .catch((e: string) => {
            dispatch(retrieveProjectsFailed(e));
          });
        resolve();
      }, 3000);
    });
  };
};

/** Helper to set current project */
export const setActiveProject = (
  project_id: number
): SetActiveProjectAction => {
  return {
    type: ProjectActionTypes.SET_ACTIVE_PROJECT,
    payload: { project_id },
  };
};

/** Retrieves a list of all projects visible to user */
export const getAllProjects = (): ThunkAction<
  Promise<void>,
  {},
  {},
  AnyAction
> => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    const projectRepo = new ProjectRepository();
    const projectService = new ProjectServiceImpl(projectRepo);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        dispatch(retrievingProjects());
        projectService
          .getAllProjects()
          .then((props) => {
            if (props.some((x) => x.id === undefined)) {
              dispatch(retrieveProjectsFailed("invalid id obtained"));
            } else {
              dispatch(retrievedProjects(props));
            }
          })
          .catch((e: string) => {
            dispatch(retrieveProjectsFailed(e));
          });
        resolve();
      }, 3000);
    });
  };
};

export const retrieveProjectsFailed = (
  message: string
): ProjectRetrieveFailedAction => {
  return { type: ProjectActionTypes.RETRIEVE_FAILED, payload: { message } };
};

export const retrievingProjects = (): ProjectRetrievingAction => {
  return { type: ProjectActionTypes.RETRIEVING };
};

export const retrievedProjects = (
  projects: ProjectProps[]
): ProjectRetrievedAction => {
  return { type: ProjectActionTypes.RETRIEVED, payload: projects };
};

/** Deletes single project by its id, and performs onDelete callback if successful */
export const deleteProject = (
  id: number,
  onDelete: () => void
): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    const projectRepo = new ProjectRepository();
    const projectService = new ProjectServiceImpl(projectRepo);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        dispatch(deletingProject());
        projectService
          .deleteProject(id)
          .then((props) => {
            if (props) {
              dispatch(deletedProject(id));
              onDelete();
            } else {
              dispatch(deleteProjectFailed("Failed to delete project"));
            }
          })
          .catch((e: string) => {
            dispatch(deleteProjectFailed(e));
          });
        resolve();
      }, 3000);
    });
  };
};

export const deletingProject = (): ProjectDeletingAction => {
  return { type: ProjectActionTypes.DELETING };
};

export const deletedProject = (id: number): ProjectDeletedAction => {
  return { type: ProjectActionTypes.DELETED, payload: { id } };
};

export const deleteProjectFailed = (
  message: string
): ProjectDeleteFailedAction => {
  return {
    type: ProjectActionTypes.DELETE_FAILED,
    payload: {
      message,
    },
  };
};

/** Creates new project with given project properties */
export const createProject = (
  project: ProjectProps
): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    const projectRepo = new ProjectRepository();
    const projectService = new ProjectServiceImpl(projectRepo);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        dispatch(creatingProject());
        projectService
          .createProject(project)
          .then((props) => {
            if (props && props.id !== undefined) {
              dispatch(createdProject(props));
              dispatch(push(`/projects/${props.id}`));
            } else {
              dispatch(createProjectFailed("Failed to create project"));
            }
          })
          .catch((e: string) => {
            dispatch(createProjectFailed(e));
          });
        resolve();
      }, 3000);
    });
  };
};

export const creatingProject = (): ProjectCreatingAction => {
  return { type: ProjectActionTypes.CREATING };
};

export const createdProject = (props: ProjectProps): ProjectCreatedAction => {
  return { type: ProjectActionTypes.CREATED, payload: props };
};

export const createProjectFailed = (
  message: string
): ProjectCreateFailedAction => {
  return {
    type: ProjectActionTypes.CREATE_FAILED,
    payload: {
      message,
    },
  };
};

/** Modify project details on the backend */
export const updateProject = (
  project: ProjectProps,
  onSuccess?: () => void
): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    const projectRepo = new ProjectRepository();
    const projectService = new ProjectServiceImpl(projectRepo);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        dispatch(updatingProject());
        projectService
          .updateProject(project)
          .then((props) => {
            if (props) {
              dispatch(updatedProject(project));
              if (onSuccess !== undefined) {
                onSuccess();
              }
            } else {
              dispatch(updateProjectFailed("Failed to update project"));
            }
          })
          .catch((e: string) => {
            dispatch(updateProjectFailed(e));
          });
        resolve();
      }, 3000);
    });
  };
};

export const updatingProject = (): ProjectUpdatingAction => {
  return { type: ProjectActionTypes.UPDATING };
};

export const updatedProject = (project: ProjectProps): ProjectUpdatedAction => {
  return { type: ProjectActionTypes.UPDATED, payload: project };
};

export const updateProjectFailed = (
  message: string
): ProjectUpdateFailedAction => {
  return {
    type: ProjectActionTypes.UPDATE_FAILED,
    payload: {
      message,
    },
  };
};

export const dropAllProjects = (): ProjectDropAllAction => {
  return { type: ProjectActionTypes.DROP_ALL };
};

export const selectedProject = (
  id: number,
  permissions: PermissionProps[] = [],
  tasks: TaskProps[] = []
): ProjectSelectAction => {
  return {
    type: ProjectActionTypes.SELECT,
    payload: { id, permissions, tasks },
  };
};

export const createProjectTask = (
  project_id: number,
  task: TaskProps
): ProjectCreatedTaskAction => {
  return {
    type: ProjectActionTypes.CREATED_TASK,
    payload: { id: project_id, task },
  };
};

export const updateProjectTask = (
  project_id: number,
  task: TaskProps
): ProjectUpdatedTaskAction => {
  return {
    type: ProjectActionTypes.UPDATED_TASK,
    payload: { id: project_id, task },
  };
};

export const deletedProjectTask = (
  project_id: number,
  task_id: number
): ProjectDeletedTaskAction => {
  return {
    type: ProjectActionTypes.DELETED_TASK,
    payload: { project_id, task_id },
  };
};

export const retrievingTask = (): ProjectTasksRetrievingAction => {
  return { type: ProjectActionTypes.RETRIEVING_TASKS };
};

export const retrieveTaskFailed = (
  err: string
): ProjectTasksRetrieveFailedAction => {
  return {
    type: ProjectActionTypes.RETRIEVE_FAILED,
    payload: { message: err },
  };
};

export const retrievedTasks = (
  project_id: number,
  tasks: TaskProps[]
): ProjectTasksRetrievedAction => {
  return {
    type: ProjectActionTypes.RETRIEVED_TASKS,
    payload: {
      project_id,
      tasks,
    },
  };
};

/** Submits query string and query tags along with a specific project_id to the server */
export const queryTasks = (
  project_id: number,
  query?: string,
  all_tags?: string[]
): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    const projectRepo = new ProjectRepository();
    const projectService = new ProjectServiceImpl(projectRepo);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        dispatch(retrievingTask());
        if (query === undefined && all_tags === undefined) {
          dispatch(retrievedTasks(project_id, []));
        } else {
          projectService
            .queryTasks(project_id, query, all_tags)
            .then((props) => {
              dispatch(retrievedTasks(project_id, props));
            })
            .catch((e: string) => {
              dispatch(retrieveTaskFailed(e));
            });
        }
        resolve();
      }, 3000);
    });
  };
};
