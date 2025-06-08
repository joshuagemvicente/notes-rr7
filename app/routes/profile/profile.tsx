import { data } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { auth } from "~/lib/auth.server";
import { ProfileComponent } from "~/components/profile/ProfileComponent";


export async function loader({ request }: LoaderFunctionArgs) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  return data({ session });
}


export default function Profile() {
  return <ProfileComponent />;
}
