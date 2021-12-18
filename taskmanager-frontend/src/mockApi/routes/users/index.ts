/* routes/user-favorites/index.ts */
import { Server } from "miragejs";
import login from "./login";
import profile from "./profile";
import signup from "./signup";

export const registerUserRoutes = (context: Server) => {
  return [
    context.post("login", login),
    context.post("signup", signup),
    context.get("profile", profile),
  ];
};
