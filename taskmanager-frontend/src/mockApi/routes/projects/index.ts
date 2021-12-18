/* routes/user-favorites/index.ts */
import { Server } from "miragejs";
import createProjectTask from "./createProjectTasks";
import getProject from "./getProject";
import getProjects from "./getProjects";
import getProjectTasks from "./getProjectTasks";

export const registerProjectRoutes = (context: Server) => {
  return [
    context.get("projects", getProjects),
    context.post("projects"),
    context.patch("projects"),
    context.delete("projects"),
    context.get("projects/:id", getProject),
    context.get("projects/:id/tasks", getProjectTasks),
    context.post("projects/:id/tasks", createProjectTask)
      // this.get("/projects/:id", (schema, request) => {
      //   const id = request.params.id;
      //   console.log(request.params);
      //   return schema.find("project", id);
      // });
      // this.post("/projects", (schema, request) => {
      //   const attrs = JSON.parse(request.requestBody);

      //   return schema.create("project", attrs);
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
