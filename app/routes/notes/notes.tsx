import { prisma } from "~/lib/prisma";
import type { LoaderFunctionArgs } from "react-router";
import { data, redirect,  Link, useLoaderData  } from "react-router";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Button } from "~/components/ui/button";
import { auth } from "~/lib/auth.server";
import type { Note } from "@prisma/client";

dayjs.extend(relativeTime);

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    throw redirect("/login");
  }

  const notes = await prisma.note.findMany({
    orderBy: {
      updatedAt: "desc",
    },
  });

  return data({ notes });
}

function formatDate(date: Date) {
  const now = dayjs();
  const noteDate = dayjs(date);

  if (noteDate.isSame(now, "day")) {
    return "Today";
  } else if (noteDate.isSame(now.subtract(1, "day"), "day")) {
    return "Yesterday";
  } else if (noteDate.isAfter(now.subtract(7, "day"))) {
    return noteDate.fromNow();
  } else {
    return noteDate.format("MMM D, YYYY");
  }
}

export default function NotesPage() {
  const { notes } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Notes</h1>
        <Link to="/notes/new">
          <Button className="bg-black text-white hover:bg-gray-800">
            New Note
          </Button>
        </Link>
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
