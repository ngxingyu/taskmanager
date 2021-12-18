/* eslint-disable no-debugger */
/* eslint-disable no-console */
import { Model } from "miragejs";
import { ModelDefinition } from "miragejs/-types";
import { MockTaskProps } from "../task/data";

export interface MockProjectProps {
  name?: string;
  id?: number;
  created_at?: Date;
  updated_at?: Date;
  tasks?: MockTaskProps[];
}
export const ProjectModel: ModelDefinition<MockProjectProps> = Model.extend({});

export const projects: MockProjectProps[] = Array.from(
  { length: 5 },
  (v, k) => k + 1
).map((i) => {
  return {
    name: `Project ${i}`,
    id: i,
    created_at: new Date(),
    updated_at: new Date()
  };
});
