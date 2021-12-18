/* eslint-disable no-debugger */
/* eslint-disable no-console */
/* routes/user-favorites/index.ts */
import { Request, Response } from "miragejs";
import { AnyResponse } from "miragejs/-types";
import { RouteHandler } from "miragejs/server";

import { AppSchema } from "mockApi";
import { AppRegistry } from "mockApi/models";
import { MockTaskProps } from "mockApi/models/task/data";
import { authorize } from "../helper";

const createProjectTask:RouteHandler<AppRegistry, AnyResponse> = (schema: AppSchema, request: Request) => {
  const id: number = parseInt(request.params?.id, 10);
  return authorize(() => {
    const attrs = JSON.parse(request.requestBody) as MockTaskProps;
    if (id !== undefined) {
      const task = schema.create("task", {
        ...attrs,
        id: undefined,
      }) as MockTaskProps;
      return task;
    } else {
      return new Response(422, { message: "Some Error Message" });
    }
  })(request);
};

export default createProjectTask;
