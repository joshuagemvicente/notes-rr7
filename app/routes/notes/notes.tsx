import { prisma } from "~/lib/prisma";
import type { LoaderFunctionArgs } from "react-router";
import { data, redirect, Link, useLoaderData } from "react-router";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Button } from "~/components/ui/button";
import { auth } from "~/lib/auth.server";
import type { Note } from "@prisma/client";
import { formatDate } from "~/utils/formatDate";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuContent,
} from "~/components/ui/dropdown-menu";
import { signOut } from "~/lib/auth.client";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });
  const userId = session?.user?.id;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  if (!session) {
    throw redirect("/login");
  }

  const notes = await prisma.note.findMany({
    orderBy: {
      updatedAt: "desc",
    },
  });

  return data({ notes, user });
}

export default function NotesPage() {
  const { notes, user } = useLoaderData<typeof loader>();
  console.log("userData", user);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Notes</h1>
        <div className="flex items-center gap-4">
          <Link to="/notes/new">
            <Button className="bg-black text-white hover:bg-gray-800">
              New Note
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar>
                <AvatarFallback className="bg-gray-200 text-gray-800">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel className="text-sm font-semibold">
                {user?.name || "User"}
              </DropdownMenuLabel>
              <DropdownMenuItem>
                <Link to="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => signOut()}>
                <button>Logout</button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid gap-4">
        {notes.map((note: Note) => (
          <Link
            key={note.id}
            to={`/notes/${note.id}`}
            className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <h2 className="text-lg font-semibold mb-2">{note.title}</h2>
            <p className="text-sm text-gray-500">
              Last updated {formatDate(note.updatedAt)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
