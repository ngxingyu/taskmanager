

/* routes/user-favorites/index.ts */
import { Request } from "miragejs";

import { AppSchema } from "mockApi";
import { MockProjectProps } from "mockApi/models/project/data";
import { authorize } from "../helper";
// import { getTasksWith } from "../tasks/getTasks";

const getProject = (schema: AppSchema, request: Request) => {
  const id: string = request.params?.id;
  return authorize(() => {
    const projects =
      id === undefined
        ? (schema.all("project") as MockProjectProps)
        : (schema.findBy(
            "project",
            (project) => project.id === id
          ) as MockProjectProps);
    return projects;
  })(request);
};

export default getProject;
