import { Model } from "miragejs";
import { ModelDefinition } from "miragejs/-types";
import { MockTagProps, MockTaskProps } from "../task/data";

export interface MockTaskTagProps {
  id?: number;
  task: MockTaskProps;
  tag: MockTagProps;
  created_at?: Date;
  updated_at?: Date;
}

export const TaskTagModel: ModelDefinition<MockTaskTagProps> =
  Model.extend({});
