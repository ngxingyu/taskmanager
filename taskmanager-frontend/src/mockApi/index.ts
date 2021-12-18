/* eslint-disable no-debugger */
/* eslint-disable no-console */
import {
  createServer,
  Model,
  Factory,
  hasMany,
  belongsTo,
  RestSerializer,
} from "miragejs";
import faker from "faker";
import { MockProjectProps, projects } from "./models/project/data";
import { generateTasks } from "./models/task/data";
import { users } from "./models/user/data";
import { registerUserRoutes } from "./routes/users";
import { registerProjectRoutes } from "./routes/projects";
import Schema from "miragejs/orm/schema";
import { AppRegistry } from "./models";
import { SerializerInterface } from "miragejs/serializer";
import { ProjectProps, TaskProps } from "core/entities";

const camelToSnakeCase = (str: string) =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
const ApplicationSerializer = (params: SerializerInterface = {}) =>
  RestSerializer.extend({
    embed: true,
    root: false,
    keyForAttribute: (key: string) => {
      return camelToSnakeCase(key);
    },
    keyForRelationship: (key: string) => {
      return camelToSnakeCase(key);
    },
    ...params,
  });

export type AppSchema = Schema<AppRegistry>;
export const makeServer = ({ environment = "development" }) => {
  return createServer({
    environment,
    serializers: {
      project: ApplicationSerializer({
        include: ["tasks", "tags"],
        serialize: (object: MockProjectProps) => {
          const json: ProjectProps = {
            name: object.name,
            id: object.id,
            created_at: object.created_at,
            updated_at: object.updated_at,
            permissions: [],
            tasks: object.tasks?.map((t) => t) as TaskProps[],
          };
          return json;
        },
      }),
      projectUserRole: ApplicationSerializer(),
      role: ApplicationSerializer(),
      task: ApplicationSerializer({
        include: ["subtasks", "taskTags"],
        keyForAttribute: (key: string) => {
          return key === "subtasks" ? "tasks" : camelToSnakeCase(key);
        },
        keyForRelationship: (key: string) => {
          return key === "subtasks" ? "tasks" : camelToSnakeCase(key);
        },
      }),
      taskTag: ApplicationSerializer(),
      user: ApplicationSerializer(),
      tag: ApplicationSerializer(),
    },

    models: {
      user: Model.extend({
        projects: hasMany(),
        projectUserRoles: hasMany(),
      }),
      project: Model.extend({
        users: hasMany(),
        tasks: hasMany(),
        tags: hasMany(),
        projectUserRoles: hasMany(),
      }),
      projectUserRole: Model.extend({
        user: belongsTo(),
        project: belongsTo(),
        role: belongsTo(),
      }),
      role: Model.extend({
        projectUserRoles: hasMany(),
      }),
      task: Model.extend({
        project: belongsTo(),
        parent: belongsTo("task", { inverse: "subtasks" }),
        subtasks: hasMany("task", { inverse: "parent" }),
        taskTags: hasMany(),
      }),
      taskTag: Model.extend({
        task: belongsTo(),
        tag: belongsTo(),
      }),
      tag: Model.extend({
        project: belongsTo(),
        taskTags: hasMany(),
      }),
    },

    factories: {
      user: Factory.extend({
        name: faker.name.findName(),
        password: faker.internet.password(),
        email: faker.internet.email(),
        admin: faker.datatype.boolean(),
        // withProjects: trait({
        //   afterCreate(user, server) {
        //     if (!user.projects.length) {
        //       server.createList("project", 5, { user }, "withTasks", "withPermissions");
        //     }
        //   },
        // })
      }),
      tag: Factory.extend({}),
      task: Factory.extend({
        projectId: 1,
        title: (i) => {
          return `Task ${i}`;
        },
        parentId: null,
        notes: faker.lorem.paragraph(),
        // tags: trait({
        //   afterCreate(user, server) {
        //     if (!user.tags.length) {
        //       server.createList("tag", 5);
        //     }
        //   },
        // })
      }),
      project: Factory.extend({
        name: (i) => {
          return `Project ${i}`;
        },
        // withTasks: trait({
        //   afterCreate(project, server) {
        //     console.log(project, project.id);
        //     if (!project.tasks.length) {
        //       server.createList("task", 5, { projectId: project.id });
        //     }
        //   },
        // }),
      }),
    },
    fixtures: {
      projects,
      users,
    },
    routes() {
      this.urlPrefix = process.env.REACT_APP_API_URL || "http://localhost:3001";
      registerUserRoutes(this);
      this.namespace = "api/v1";
      registerProjectRoutes(this);
      this.get("tasks");
      this.patch("tasks");
      this.delete("tasks");
      // this.get("/projects", (schema) => {
      //   return schema.where("project", { user_id: 1 });
      // });

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
      // this.get("/tasks/:id", (schema, request) => {
      //   const id = request.params.id;
      //   return schema.find("task", id);
      // });
    },

    seeds: (server) => {
      // server.loadFixtures();
      server.createList("user", 5);
      const projectList = server.createList("project", 5);
      projectList.forEach((p) => {
        generateTasks(server.schema, null, parseInt(p.id || "1", 10), 2, 3);
      });
      // console.log(projectList);
      // server.create("user", {
      //   name: "admin",
      //   email: "admin@admin.admin",
      //   admin: true,
      // });
      // server.createList("user", 3);
      // server.create("project", {
      //   name: "My Tasks",
      //   userId: 1,
      //   permissions: server.schema.all("user"),
      // });
      // server.createList("project", 5, { user_id: 1 });
      // console.log(server.schema.all("task"));
    },
  });
};
