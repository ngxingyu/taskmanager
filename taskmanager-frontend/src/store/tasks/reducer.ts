import produce from "immer";
import { TaskProps } from "core/entities";
import { TaskAction, TaskActionTypes } from "store/tasks/actions";
import { Reducer } from "redux";
export interface ActiveTaskState {
  id: number;
  tasks: TaskProps[];
}
export interface TaskStateProps {
  loading: boolean;
  error?: string;
  loaded: boolean;
  task?: TaskProps;
}

export const initialTaskState: TaskStateProps = {
  loaded: true,
  loading: false,
  error: undefined,
  task: undefined,
};

const TasksReducer: Reducer<TaskStateProps, TaskAction> = (
  state: TaskStateProps = initialTaskState,
  action: TaskAction
) => {
  return produce(state, (draftState) => {
    switch (action.type) {
      case TaskActionTypes.CREATE:
      case TaskActionTypes.UPDATE:
      case TaskActionTypes.DELETE:
      case TaskActionTypes.RETRIEVE:
      case TaskActionTypes.CREATING:
      case TaskActionTypes.UPDATING:
      case TaskActionTypes.DELETING:
      case TaskActionTypes.RETRIEVING:
        draftState.loading = true;
        break;
      case TaskActionTypes.RETRIEVED:
      case TaskActionTypes.CREATED:
        draftState.loaded = true;
        draftState.loading = false;
        draftState.error = undefined;
        draftState.task = action.payload;
        break;
      case TaskActionTypes.UPDATED:
        draftState.loading = false;
        draftState.error = undefined;
        break;
      case TaskActionTypes.DELETED:
        draftState.loading = false;
        draftState.error = undefined;
        draftState.task = undefined;
        break;
      case TaskActionTypes.RETRIEVE_FAILED:
      case TaskActionTypes.CREATE_FAILED:
      case TaskActionTypes.UPDATE_FAILED:
      case TaskActionTypes.DELETE_FAILED:
        draftState.loading = false;
        draftState.error = action.payload.message;
        break;
      // case TaskActionTypes.SELECT:
      //   draftState.task = action.payload.task
      //   break
    }
  });
};
export default TasksReducer;
