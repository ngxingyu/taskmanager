import { Request, Response } from "miragejs";

export const authorize = (fn: () => Response | {}) => (request: Request) => {
  if (request.requestHeaders.Authorization !== "Bearer valid_token") {
    return new Response(401, {
      message: "Invalid credentials",
      help: JSON.stringify(request.requestHeaders),
    });
  } else {
    return fn();
  }
};
