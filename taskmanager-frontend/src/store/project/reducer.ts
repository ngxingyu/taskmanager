import produce from "immer";
import { TaskProps, UserRole } from "core/entities";
import { ProjectAction, ProjectActionTypes } from "store/project/actions";
import { Reducer } from "redux";
export interface ActiveProjectState {
  id: number;
  // tasks: { [key: number]: TaskProps };
}

export interface ProjectStateProps {
  name?: string;
  id?: number;
  created_at?: Date;
  updated_at?: Date;
  permissions?: UserRole[];
  tasks?: { [key: number]: TaskProps };
  query?: TaskProps[];
}
export interface ProjectsStateProps {
  loading: boolean;
  error?: string;
  loaded: boolean;
  projects: { [key: number]: ProjectStateProps };
  active?: ActiveProjectState;
}

export const initialProjectsState: ProjectsStateProps = {
  loaded: false,
  loading: true,
  error: undefined,
  projects: {},
  active: undefined,
};

const ProjectsReducer: Reducer<ProjectsStateProps, ProjectAction> = (
  state: ProjectsStateProps = initialProjectsState,
  action: ProjectAction
) => {
  return produce(state, (draftState) => {
    switch (action.type) {
      case ProjectActionTypes.RETRIEVE:
      case ProjectActionTypes.CREATE:
      case ProjectActionTypes.UPDATE:
      case ProjectActionTypes.DELETE:
      case ProjectActionTypes.RETRIEVING:
      case ProjectActionTypes.CREATING:
      case ProjectActionTypes.UPDATING:
      case ProjectActionTypes.DELETING:
        draftState.loading = true;
        break;
      case ProjectActionTypes.CREATED:
        draftState.loaded = true;
        draftState.loading = false;
        draftState.error = undefined;
        const project = action.payload;
        draftState.projects[project.id || -1] = { ...project, tasks: {} };
        break;
      case ProjectActionTypes.RETRIEVED:
        draftState.loaded = true;
        draftState.loading = false;
        draftState.error = undefined;
        const projects = action.payload;
        projects.forEach((x) => {
          const t: { [key: number]: TaskProps } = {};
          x.tasks?.forEach((task) => {
            t[task.id || -1] = task;
          });
          draftState.projects[x.id || -1] = { ...x, tasks: t };
        });
        break;
      case ProjectActionTypes.UPDATED:
        draftState.loading = false;
        draftState.error = undefined;
        if (action.payload.id !== undefined) {
          draftState.projects[action.payload.id] = action.payload;
        }
        break;
      case ProjectActionTypes.DELETED:
        draftState.loading = false;
        draftState.error = undefined;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [action.payload.id]: v, ...rest } = draftState.projects;
        draftState.projects = rest;
        break;
      case ProjectActionTypes.RETRIEVE_FAILED:
      case ProjectActionTypes.CREATE_FAILED:
      case ProjectActionTypes.UPDATE_FAILED:
      case ProjectActionTypes.DELETE_FAILED:
        draftState.loading = false;
        draftState.error = action.payload.message || "";
        break;
      case ProjectActionTypes.DROP_ALL:
        draftState.projects = {};
        draftState.loading = false;
        draftState.loaded = false;
        break;
      case ProjectActionTypes.SELECT:
        draftState.projects[action.payload.id].permissions =
          action.payload.permissions;
        break;
      case ProjectActionTypes.CREATED_TASK:
        draftState.projects[action.payload.id].tasks = {
          ...(state.projects[action.payload.id].tasks || {}),
          [action.payload.task.id || -1]: action.payload.task,
        };
        break;
      case ProjectActionTypes.UPDATED_TASK:
        draftState.projects[action.payload.id].tasks = {
          ...(state.projects[action.payload.id].tasks || {}),
          [action.payload.task.id || -1]: action.payload.task,
        };
        break;
      case ProjectActionTypes.DELETED_TASK:
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [action.payload.task_id]: v1, ...rest1 } =
          draftState.projects[action.payload.project_id].tasks || {};
        draftState.projects[action.payload.project_id].tasks = { ...rest1 };
        break;
      case ProjectActionTypes.RETRIEVED_TASKS:
        draftState.loaded = true;
        draftState.loading = false;
        draftState.projects[action.payload.project_id].query =
          action.payload.tasks;
        break;
      case ProjectActionTypes.SET_ACTIVE:
        draftState.active = { id: action.payload.project_id };
        break;
    }
  });
};
export default ProjectsReducer;
