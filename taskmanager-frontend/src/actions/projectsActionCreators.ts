import { UserServiceImpl } from "../core/useCases/userUseCase";
import { ProjectRepository, UserRepository } from "../core/infrastructure/repositoryImpl";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { ProjectServiceImpl } from "core/useCases/projectUseCase";
import { ProjectProps } from "core/entities";
import { ProjectActionTypes, ProjectDeletedAction, ProjectDeleteFailedAction, ProjectDeletingAction, ProjectDropAllAction, ProjectRetrievedAction, ProjectRetrieveFailedAction, ProjectRetrievingAction } from "./projectsActions";

export const getProjectById = (id: number): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
        const projectRepo = new ProjectRepository();
        const projectService = new ProjectServiceImpl(projectRepo);
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                dispatch(retrievingProjects());
                projectService.getProjectById(id, 0)
                    .then(props => {
                        if (props.id === undefined) {
                            dispatch(retrieveProjectsFailed("invalid id obtained"));
                        } else {
                            dispatch(retrievedProjects([props]));
                        }
                    }).catch(e => {
                        dispatch(retrieveProjectsFailed(e));
                    }
                    );
                resolve();
            }, 3000);
        })
    }
}
export const getAllProjects = (): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
        const projectRepo = new ProjectRepository();
        const projectService = new ProjectServiceImpl(projectRepo);
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                dispatch(retrievingProjects());
                projectService.getAllProjects()
                    .then(props => {
                        if (props.some(x => x.id === undefined)) {
                            dispatch(retrieveProjectsFailed("invalid id obtained"));
                        } else {
                            dispatch(retrievedProjects(props));
                        }
                    }).catch(e => {
                        dispatch(retrieveProjectsFailed(e));
                    }
                    );
                resolve();
            }, 3000);
        })
    }
}
export const retrieveProjectsFailed = (message: string): ProjectRetrieveFailedAction => {
    return { type: ProjectActionTypes.RETRIEVE_FAILED, payload: { message } }
};
export const retrievingProjects = (): ProjectRetrievingAction => {
    return { type: ProjectActionTypes.RETRIEVING }
};

export const retrievedProjects = (projects: ProjectProps[]): ProjectRetrievedAction => {
    return { type: ProjectActionTypes.RETRIEVED, payload: projects }
};

export const deleteProject = (id: number):
    ThunkAction<Promise<void>, {}, {}, AnyAction> => {
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
        const projectRepo = new ProjectRepository();
        const projectService = new ProjectServiceImpl(projectRepo);
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                dispatch(deletingProject());
                projectService.deleteProject(id)
                    .then(props => {
                        if (props) {
                            dispatch(deletedProject(id));
                        } else {
                            dispatch(deleteProjectFailed("Failed to delete project"));
                        }
                    }).catch(e => {
                        dispatch(deleteProjectFailed(e));
                    }
                    );
                resolve();
            }, 3000);
        }
        )
    }
}

export function deletingProject(): ProjectDeletingAction {
    return { type: ProjectActionTypes.DELETING }
}

export function deletedProject(id: number): ProjectDeletedAction {
    return { type: ProjectActionTypes.DELETED, payload: { id } }
}

export function deleteProjectFailed(message: string): ProjectDeleteFailedAction {
    return {
        type: ProjectActionTypes.DELETE_FAILED,
        payload: {
            message
        }
    }
}

export function dropAllProjects(): ProjectDropAllAction {
    return { type: ProjectActionTypes.DROP_ALL }
}