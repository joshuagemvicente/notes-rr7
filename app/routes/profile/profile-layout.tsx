
import type { Route } from "./+types/profile-layout";
import { data, Outlet, redirect, type LoaderFunctionArgs } from "react-router";
import { auth } from "~/lib/auth.server";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    throw redirect("/login");
  }

  return data({ session });
}

export default function ProfileLayout() {
  return (
    <main>
      <>
        <Outlet />
      </>
    </main>
  );
}
