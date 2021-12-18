import { Model } from "miragejs";
import { ModelDefinition } from "miragejs/-types";
import { MockProjectProps } from "../project/data";

export interface MockUserProps {
  email?: string;
  name?: string;
  password?: string;
  password_confirmation?: string;
  id?: number;
  admin?: boolean;
  auth_token?: string;
  projects?: MockProjectProps[];
}
export const UserModel: ModelDefinition<MockUserProps> = Model.extend({});
export const users: MockUserProps[] = Array.from(
  { length: 3 },
  (v, k) => k + 1
).map((i) => {
  return {
    email: `${i}@${i}.${i}`,
    name: `User ${i}`,
    password: "password",
    id: i,
    admin: i === 1,
    auth_token: "valid_token",
  };
});


