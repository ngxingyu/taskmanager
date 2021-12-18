import { TaskStatus } from "core/entities";
import { Model } from "miragejs";
import { ModelDefinition } from "miragejs/-types";
import { AppSchema } from "mockApi";
import moment from "moment";

export interface MockTaskProps {
  id?: number;
  title?: string;
  notes?: string;
  project_id?: number;
  parent_id?: number | null;
  importance?: number;
  status?: TaskStatus;
  deadline?: Date;
  duration?: moment.Duration;
  created_at?: Date;
  updated_at?: Date;
  subtasks?: any;
  tags?: MockTagProps[];
}

export interface MockTagProps {
  id?: number;
  project_id?: number;
  name?: string;
  color?: number;
}
export const TaskModel: ModelDefinition<MockTaskProps> = Model.extend({
  parent_id: null,
});
export const TagModel: ModelDefinition<MockTagProps> = Model.extend({});

const makeGenerateTask = () => {
  let id = 0;
  return ({
    parent_id,
    tags,
    project_id,
  }: Pick<MockTaskProps, "tags" | "parent_id" | "project_id">) => {
    id = id + 1;
    const dt = new Date();
    return {
      id,
      title: `Task ${id}`,
      notes: "Notes",
      projectId: project_id,
      parentId: parent_id || null,
      importance: 0,
      status: TaskStatus.Todo,
      deadline: new Date(dt),
      duration: moment.duration({ hours: 1 }),
      created_at: dt,
      updated_at: dt,
      subtasks: new Array<MockTaskProps>(),
      tags,
    };
  };
};
const taskGenerator = makeGenerateTask();
export const generateTasks = (
  schema: AppSchema,
  root_parent_id?: number | null,
  project_id = 1,
  max_depth = 1,
  count = 2
): MockTaskProps[] => {
  const helper = (
    depth: number,
    parent_id?: number | null
  ): MockTaskProps[] => {
    return Array.from({ length: count }, (v, k) => k + 1).map(() => {
      const task = taskGenerator({
        parent_id,
        project_id,
      });
      schema.create("task", { ...task, id: undefined });
      const subtasks = (
        depth === 1 ? [] : (helper(depth - 1, task.id) as MockTagProps[])
      ).map((x) => schema.create("task", { ...x, id: undefined }));
      task.subtasks.push(...subtasks);
      return {
        ...task,
        subtasks,
      } as MockTaskProps;
    });
  };
  return helper(max_depth, root_parent_id);
};
// generateTasks(schema, null, undefined, 2, 3);
