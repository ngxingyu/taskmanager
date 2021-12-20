

/* routes/user-favorites/index.ts */
import { Request } from "miragejs";

import { AppSchema } from "mockApi";
import { MockTaskProps } from "mockApi/models/task/data";
import { authorize } from "../helper";

const getTask = (schema: AppSchema, request: Request) => {
  const id: string = request.params?.id;
  return authorize(() => {
    const tasks =
      id === undefined
        ? (schema.all("task") as MockTaskProps)
        : (schema.findBy(
            "task",
            (task) => task.id === String(id)
          ) as MockTaskProps);

    return tasks;
  })(request);
};

export default getTask;
