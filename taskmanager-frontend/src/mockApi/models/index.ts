import { Registry } from "miragejs/-types";
import { ProjectModel } from "./project/data";
import { ProjectUserRoleModel } from "./project_user_role/data";
import { RoleModel } from "./role/data";
import { TaskModel, TagModel } from "./task/data";
import { TaskTagModel } from "./task_tag/data";
import { UserModel } from "./user/data";
export type AppRegistry = Registry<
  {
    user: typeof UserModel;
    project: typeof ProjectModel;
    task: typeof TaskModel;
    tag: typeof TagModel;
    taskTag: typeof TaskTagModel;
    role: typeof RoleModel;
    projectUserRole: typeof ProjectUserRoleModel
  },
  {}
>;