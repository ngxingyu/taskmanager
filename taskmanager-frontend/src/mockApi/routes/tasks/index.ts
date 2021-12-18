/* routes/user-favorites/index.ts */
import { Server } from "miragejs";
import getTask from "./getTask";


export const registerProjectRoutes = (context: Server) => {
  return [
    context.get("tasks/:id", getTask),
    // context.get("projects/:id", getProject),
    // context.post("projects"),
    // context.patch("projects"),
    // context.delete("projects"),
    // this.get("/projects/:id", (schema, request) => {
    //   const id = request.params.id;
    //   console.log(request.params);
    //   return schema.find("project", id);
    // });
    // this.post("/projects", (schema, request) => {
    //   const attrs = JSON.parse(request.requestBody);

    //   return schema.create("project", attrs);
    // });
    // this.post("/projects/:id/tasks", (schema, request) => {
    //   const id = request.params.id;
    //   const attrs = JSON.parse(request.requestBody);
    //   return schema.create("task", { projectId: id, ...attrs });
    // });
    // this.patch<Response>("/projects/:id", (schema, request) => {
    //   const newAttrs = JSON.parse(request.requestBody);
    //   const id = request.params.id;
    //   schema.find("project", id)?.update(newAttrs);
    //   return new Response(204);
    // });
    // this.delete<Response>("/projects/:id", (schema, request) => {
    //   const id = request.params.id;

    //   schema.find("project", id)?.destroy();
    //   return new Response(204);
    // });
  ];
};
