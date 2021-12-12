import produce from 'immer'
import { PermissionProps, ProjectProps, TaskProps } from 'core/entities'
import { ProjectAction, ProjectActionTypes } from 'store/project/actions'
import { Reducer } from 'redux'
export interface ActiveProjectState {
  id: number
  tasks: TaskProps[]
}
export interface ProjectsStateProps {
  loading: boolean
  error?: string
  loaded: boolean
  projects: { [key: number]: ProjectProps }
  active?: ActiveProjectState
}

export const initialProjectsState: ProjectsStateProps = {
  loaded: true,
  loading: false,
  error: undefined,
  projects: {},
  active: undefined,
}

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
        draftState.loading = true
        break
      case ProjectActionTypes.RETRIEVED:
      case ProjectActionTypes.CREATED:
        draftState.loaded = true
        draftState.loading = false
        draftState.error = undefined
        const projects = action.payload
        projects.forEach((x) => (draftState.projects[x.id || -1] = x))
        break
      case ProjectActionTypes.UPDATED:
        draftState.loading = false
        draftState.error = undefined
        break
      case ProjectActionTypes.DELETED:
        draftState.loading = false
        draftState.error = undefined
        const { [action.payload.id]: v, ...rest } = draftState.projects
        draftState.projects = rest
        break
      case ProjectActionTypes.RETRIEVE_FAILED:
      case ProjectActionTypes.CREATE_FAILED:
      case ProjectActionTypes.UPDATE_FAILED:
      case ProjectActionTypes.DELETE_FAILED:
        draftState.loading = false
        draftState.error = action.payload.message
        break
      case ProjectActionTypes.DROP_ALL:
        draftState.projects = {}
        draftState.loading = false
        draftState.loaded = false
        break
      case ProjectActionTypes.SELECT:
        draftState.projects[action.payload.id].permissions = action.payload.permissions
        draftState.active = {
          id: action.payload.id,
          tasks: action.payload.tasks,
        }
        break
      case ProjectActionTypes.CREATED_TASK:
        draftState.projects[action.payload.id].tasks = [...(state.projects[action.payload.id].tasks || []), action.payload.task]
    }
  })
}
export default ProjectsReducer
