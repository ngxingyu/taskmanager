

/* routes/user-favorites/index.ts */
import { Request, Response } from "miragejs";
import { AnyResponse } from "miragejs/-types";
import { RouteHandler } from "miragejs/server";

import { AppSchema } from "mockApi";
import { AppRegistry } from "mockApi/models";
import { authorize } from "../helper";
import { getTasksWith } from "../tasks/getTasks";

const getProjectTasks: RouteHandler<AppRegistry, AnyResponse> = (
  schema: AppSchema,
  request: Request
) => {
  const depthInput: string = request.queryParams?.depth;
  const depth: number | undefined =
    depthInput === "" ? 0 : parseInt(depthInput, 10);
  const id: number = parseInt(request.params?.id, 10);
  return authorize(() => {
    if (id !== undefined) {
      return getTasksWith(schema, {
        initial_depth: depth || 0,
        initial_parent_id: undefined,
      });
    } else {
      return new Response(422, { message: "Some Error Message" });
    }
  })(request);
};

export default getProjectTasks;
