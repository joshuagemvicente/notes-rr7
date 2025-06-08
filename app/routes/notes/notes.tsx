import { prisma } from "~/lib/prisma";
import type { LoaderFunctionArgs } from "react-router";
import { data, redirect, Link, useLoaderData, useNavigate } from "react-router";
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
import { Edit, Eye } from "lucide-react";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    throw redirect("/login");
  }

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

  if (!user) {
    throw redirect("/login");
  }

  const notes = await prisma.note.findMany({
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      User: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return data({ notes, user });
}

export default function NotesPage() {
  const { notes, user } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notaryo</h1>
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
              <Link to="/profile">
                <DropdownMenuItem>Profile</DropdownMenuItem>
              </Link>
              <DropdownMenuItem>
                <Link to="/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut}>
                <button>Logout</button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid gap-4">
        {notes.length === 0 && (
          <p className="text-lg text-center text-gray-500">
            Create a blissful note to get started. ✨
          </p>
        )}
        {notes.map((note: any) => (
          <div
            key={note.id}
            className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <Link className="hover:underline" to={`/notes/${note.id}`}>
                <h2 className="text-lg font-semibold">{note.title}</h2>
              </Link>
              <div className="flex gap-2">
                <Link
                  to={`/notes/${note.id}`}
                  className="p-1 rounded hover:bg-gray-100"
                  title={note.userId === user.id ? "Edit" : "View"}
                >
                  {note.userId === user.id ? (
                    <Edit className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Link>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Last updated {formatDate(note.updatedAt)}
            </p>
            <p className="text-sm text-gray-500">
              By: {note.User?.name || "Unknown"}
              {note.userId === user.id && " (you)"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
