

/* routes/user-favorites/index.ts */
import { UserProps } from "core/entities";
import { Request } from "miragejs";
import { AnyRegistry } from "miragejs/-types";
import Schema from "miragejs/orm/schema";
import { authorize } from "../helper";

const profile = (schema: Schema<AnyRegistry>, request: Request) => {
  return authorize(() => {
    const first_user = schema.first("user") as UserProps;
    return JSON.stringify(first_user);
  })(request);
};

export default profile;
