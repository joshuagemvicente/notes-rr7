import { Form, redirect, useNavigation } from "react-router";
import type { ActionFunctionArgs } from "react-router";
import TiptapEditor from "~/components/editor/Editor";
import { prisma } from "~/lib/prisma";
import { newNoteSchema } from "~/validations/notes/newNote";
import { useState, useRef, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { auth } from "~/lib/auth.server";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const title = formData.get("title");
  const content = formData.get("content");

  if (!title || !content) {
    return { error: "Title and content are required." };
  }

  const parse = newNoteSchema.safeParse({ title, content });
  if (!parse.success) {
    return { fieldErrors: parse.error.format() };
  }

  const { title: noteTitle, content: noteContent } = parse.data;

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const userId = session?.user?.id;

  await prisma.note.create({
    data: {
      title: noteTitle,
      content: noteContent,
      userId: userId,
    },
  });

  return redirect("/notes");
}

export default function NewNotePage() {
  const [content, setContent] = useState("<p></p>");
  const [title, setTitle] = useState("");
  const titleInputRef = useRef<HTMLInputElement>(null);
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">New Note</h1>
      <Form method="post" className="space-y-4">
        <Input
          ref={titleInputRef}
          type="text"
          name="title"
          placeholder="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-xl font-semibold w-full border-b py-2 outline-none"
          required
        />

        <div className="border rounded-md overflow-hidden">
          <TiptapEditor content={content} onChange={setContent} />
        </div>

        <input type="hidden" name="content" value={content} />

        <div className="flex justify-end items-center">
          <Button
            type="submit"
            className="px-4 py-2 bg-black text-white rounded-md"
            disabled={isSubmitting || !title.trim() || content === "<p></p>"}
          >
            {isSubmitting ? "Saving..." : "Save Note"}
          </Button>
        </div>
      </Form>
    </div>
  );
}
