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
  ProjectDeleteFailedAction,
  ProjectDeletingAction,
  ProjectDropAllAction,
  ProjectRetrievedAction,
  ProjectRetrieveFailedAction,
  ProjectRetrievingAction,
  ProjectSelectAction,
  ProjectUpdatedAction,
  ProjectUpdatedTaskAction,
  ProjectUpdateFailedAction,
  ProjectUpdatingAction,
} from "store/project/actions";
import { push } from "redux-first-history";
import { ProjectRepository } from "core/infrastructure/projectRepository";

export const getProjectById = (
  id: number,
  depth = 2
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

export const deleteProject = (
  id: number
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
              dispatch(createdProject(props.id, project));
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

export const createdProject = (
  id: number,
  project: ProjectProps
): ProjectCreatedAction => {
  return { type: ProjectActionTypes.CREATED, payload: [project] };
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
