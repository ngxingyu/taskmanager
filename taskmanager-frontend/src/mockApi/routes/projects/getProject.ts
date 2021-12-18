/* eslint-disable no-debugger */
/* eslint-disable no-console */
/* routes/user-favorites/index.ts */
import { Request } from "miragejs";

import { AppSchema } from "mockApi";
import { MockProjectProps } from "mockApi/models/project/data";
import { authorize } from "../helper";
// import { getTasksWith } from "../tasks/getTasks";

const getProject = (schema: AppSchema, request: Request) => {
  // const depthInput: string = request.queryParams?.depth;
  // const depth: number | undefined =
  //   depthInput === "" ? 0 : parseInt(depthInput, 10);
  const id: string = request.params?.id;
  return authorize(() => {
    const projects =
      id === undefined
        ? (schema.all("project") as MockProjectProps)
        : (schema.findBy(
            "project",
            (project) => project.id === id
          ) as MockProjectProps);
    // projects.tasks = getTasksWith(schema, {
    //   initial_depth: depth || 0,
    //   initial_parent_id: undefined,
    // });

    // console.log("getProject", id, depth || 0, projects);
    return projects;
  })(request);
};

export default getProject;
