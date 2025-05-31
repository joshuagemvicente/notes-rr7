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
    ...prefix("notes", [
      index("./routes/notes/notes.tsx"),
      route(":id", "./routes/notes/notes.$id.tsx"),
      route("new", "./routes/notes/notes.new.tsx"),
    ]),
  ]),

  layout("./routes/auth/auth-layout.tsx", [
    route("login", "./routes/auth/login.tsx"),
    route("signup", "./routes/auth/signup.tsx"),
  ]),

  layout("./routes/profile/profile-layout.tsx", [
    ...prefix("profile", [
      route(":id", "./routes/profile/profile.$id.tsx"),
      route("settings", "./routes/profile/profile.settings.tsx"),
    ]),
  ]),

  ...prefix("api", [route("auth/*", "./routes/api/better.tsx")]),
] satisfies RouteConfig;
