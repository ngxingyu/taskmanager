

/* routes/user-favorites/index.ts */
import { Request } from "miragejs";

import { AppSchema } from "mockApi";
import { MockTaskProps } from "mockApi/models/task/data";
import { authorize } from "../helper";

const getTasks = (schema: AppSchema, request: Request) => {
  return authorize(() => {
    const tasks = schema.all("task") as MockTaskProps;
    return tasks;
  })(request);
};

export const getTasksWith = (
  schema: AppSchema,
  {
    initial_depth = 1,
    initial_parent_id = undefined,
  }: { initial_depth: number; initial_parent_id: string | undefined }
): MockTaskProps[] => {
  const helper = (
    depth: number,
    parent_id: string | undefined
  ): MockTaskProps[] => {
    if (depth === 1) {
      return (schema.findBy("task", (task) => task.parent_id === parent_id) ||
        []) as MockTaskProps[];
    } else {
      const current = [schema.findBy("task", (t) => t.id === parent_id)];
      return [
        ...(current as MockTaskProps[]),
        ...current.flatMap<MockTaskProps>((t) => helper(depth - 1, t?.id)),
      ] as MockTaskProps[];
    }
  };
  return helper(initial_depth, initial_parent_id);
};

export default getTasks;
