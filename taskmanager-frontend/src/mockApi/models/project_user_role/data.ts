import { Model } from "miragejs";
import { ModelDefinition } from "miragejs/-types";
import { MockProjectProps } from "../project/data";
import { MockUserProps } from "../user/data";

export interface MockProjectUserRoleProps {
  id?: number;
  user: MockUserProps;
  project: MockProjectProps;
  created_at?: Date;
  updated_at?: Date;
}

export const ProjectUserRoleModel: ModelDefinition<MockProjectUserRoleProps> =
  Model.extend({});
