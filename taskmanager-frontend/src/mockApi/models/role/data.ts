import { Model } from "miragejs";
import { ModelDefinition } from "miragejs/-types";

export interface MockRoleProps {
  name?: string;
  id?: number;
  created_at?: Date;
  updated_at?: Date;
}
export const RoleModel: ModelDefinition<MockRoleProps> = Model.extend({});

export const roles: MockRoleProps[] = [
  { id: 1, name: "Owner" },
  { id: 2, name: "Editor" },
  { id: 3, name: "Viewer" },
];
