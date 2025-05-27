import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  layout("./routes/notes/notes-layout.tsx", [
    route("notes", "./routes/notes/notes.tsx"),
    route("notes/:id", "./routes/notes/notes.$id.tsx"),
    route("notes/new", "./routes/notes/notes.new.tsx"),
  ]),
  layout("./routes/auth/auth-layout.tsx", [
    route("login", "./routes/auth/login.tsx"),
    route("signup", "./routes/auth/signup.tsx"),
  ]),

  ...prefix("api", [route("auth/*", "./routes/api/better.tsx")]),
] satisfies RouteConfig;
