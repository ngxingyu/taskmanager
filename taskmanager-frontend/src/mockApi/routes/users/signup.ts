/* routes/user-favorites/index.ts */
import { Request, Response } from "miragejs";
import { AnyRegistry } from "miragejs/-types";
import Schema from "miragejs/orm/schema";
import { MockUserProps } from "mockApi/models/user/data";

const signup = (schema: Schema<AnyRegistry>, request: Request) => {
  const attrs = JSON.parse(request.requestBody) as Pick<
    MockUserProps,
    "email" | "name" | "password" | "password_confirmation" | "admin"
  >;
  return attrs.password === attrs.password_confirmation
    ? { message: "Account created successfully", auth_token: "valid_token" }
    : new Response(422, { message: "Some Error Message" });
};

export default signup;
