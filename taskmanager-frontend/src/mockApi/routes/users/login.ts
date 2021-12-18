/* routes/user-favorites/index.ts */
import { Request, Response } from "miragejs";
import { AnyRegistry } from "miragejs/-types";
import Schema from "miragejs/orm/schema";

const login = (schema: Schema<AnyRegistry>, request: Request) => {
  const attrs = JSON.parse(request.requestBody) as { password: string };
  return attrs.password === "password"
    ? { auth_token: "valid_token" }
    : new Response(401, { message: "Invalid credentials" });
};

export default login