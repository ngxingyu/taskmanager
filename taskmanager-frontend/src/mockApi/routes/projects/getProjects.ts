

/* routes/user-favorites/index.ts */
import { Request } from "miragejs";

import { AppSchema } from "mockApi";
import { MockProjectProps } from "mockApi/models/project/data";
import { authorize } from "../helper";

const getProjects = (schema: AppSchema, request: Request) => {
  return authorize(() => {
    const projects = schema.all("project") as MockProjectProps;
    return projects;
  })(request);
};

export default getProjects;
