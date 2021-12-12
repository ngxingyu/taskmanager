import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { ProjectServiceImpl } from "core/useCases/projectUseCase";
import { PermissionProps, ProjectProps, TaskProps } from "core/entities";
import { ProjectActionTypes, ProjectDeletedAction, ProjectDeleteFailedAction, ProjectDeletingAction,
    ProjectDropAllAction, ProjectRetrievedAction, ProjectRetrieveFailedAction, ProjectRetrievingAction,
     ProjectSelectAction } from "store/project/actions";
import { push } from "redux-first-history";
import { ProjectRepository } from "core/infrastructure/repositoryImpl";

export const getProjectById = (id: number, depth = 2): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
        const projectRepo = new ProjectRepository();
        const projectService = new ProjectServiceImpl(projectRepo);
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                dispatch(retrievingProjects());
                projectService.getProjectById(id, depth)
                    .then(props => {
                        if (props.id === undefined) {
                            dispatch(retrieveProjectsFailed("invalid id obtained"));
                        } else {
                            dispatch(retrievedProjects([props]));
                            dispatch(selectedProject(props.id, props.permissions, props.tasks));
                            dispatch(push(`/projects/${props.id}`));
                        }
                    }).catch((e:string) => {
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
                    }).catch((e:string) => {
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
                    }).catch((e:string) => {
                        dispatch(deleteProjectFailed(e));
                    }
                    );
                resolve();
            }, 3000);
        }
        )
    }
}

export const deletingProject = (): ProjectDeletingAction => {
    return { type: ProjectActionTypes.DELETING }
}

export const deletedProject = (id: number): ProjectDeletedAction => {
    return { type: ProjectActionTypes.DELETED, payload: { id } }
}

export const deleteProjectFailed = (message: string): ProjectDeleteFailedAction => {
    return {
        type: ProjectActionTypes.DELETE_FAILED,
        payload: {
            message
        }
    }
}

export const dropAllProjects = (): ProjectDropAllAction => {
    return { type: ProjectActionTypes.DROP_ALL }
}


export const selectedProject = (id: number, permissions: PermissionProps[] = [], tasks: TaskProps[] = []): ProjectSelectAction => {
    return { type: ProjectActionTypes.SELECT, payload: { id, permissions, tasks } }
}