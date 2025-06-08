import { useState, useEffect } from "react";
import {
  Form,
  redirect,
  useLoaderData,
  useNavigation,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router";
import TiptapEditor from "~/components/editor/Editor";
import { prisma } from "~/lib/prisma";
import { updateNoteSchema } from "~/validations/notes/updateNote";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { auth } from "~/lib/auth.server";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogDescription,
  DialogFooter,
} from "~/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const noteId = params.id;
  const note = await prisma.note.findUnique({
    where: { id: noteId },
    include: { User: true },
  });

  if (!note) {
    throw new Response("Note not found", { status: 404 });
  }

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const userId = session?.user?.id;
  const isAuthor = note.userId === userId;

  return { note, isAuthor, userId };
}

export default function EditNotePage() {
  const { note, isAuthor } = useLoaderData();
  const initialTitle = note.title || "";
  const initialContent = note.content || "<p></p>";

  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [hasChanges, setHasChanges] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  useEffect(() => {
    const titleChanged = title !== initialTitle;
    const contentChanged = content !== initialContent;
    setHasChanges(titleChanged || contentChanged);
  }, [title, content, initialTitle, initialContent]);

  if (!note) {
    return (
      <div className="p-8 text-center text-red-500 font-medium">
        Note not found.
      </div>
    );
  }

  if (!isAuthor) {
    return (
      <div className="max-w-4xl mx-auto p-4 h-screen">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-ellipsis overflow-hidden whitespace-nowrap">
            <Tooltip>
              <TooltipTrigger asChild>
                <h1 className="text-2xl font-bold text-ellipsis overflow-hidden whitespace-nowrap">
                  {note.title}
                </h1>
              </TooltipTrigger>
              <TooltipContent>{note.title}</TooltipContent>
            </Tooltip>
          </h1>
          <span className="text-sm text-gray-600">
            {note.User ? `Created by ${note.User.name}` : ""}
          </span>
        </div>

        <style>{`
          .preview-content h1 {
            font-size: 1.75rem;
            font-weight: 700;
            margin-top: 1rem;
            margin-bottom: 0.5rem;
            line-height: 1.2;
          }
          .preview-content h2 {
            font-size: 1.5rem;
            font-weight: 600;
            margin-top: 1rem;
            margin-bottom: 0.5rem;
            line-height: 1.25;
          }
          .preview-content h3 {
            font-size: 1.25rem;
            font-weight: 600;
            margin-top: 1rem;
            margin-bottom: 0.5rem;
          }
          .preview-content h4 {
            font-size: 1.125rem;
            font-weight: 600;
            margin-top: 1rem;
            margin-bottom: 0.5rem;
          }
          .preview-content h5 {
            font-size: 1rem;
            font-weight: 600;
            margin-top: 1rem;
            margin-bottom: 0.5rem;
          }
          .preview-content h6 {
            font-size: 0.875rem;
            font-weight: 600;
            margin-top: 1rem;
            margin-bottom: 0.5rem;
          }
          .preview-content blockquote {
            border-left: 4px solid #e2e8f0;
            padding-left: 1rem;
            font-style: italic;
            margin: 1rem 0;
            color: #4a5568;
          }
          .preview-content ul {
            list-style-type: disc;
            padding-left: 1.5rem;
            margin: 0.5rem 0;
          }
          .preview-content ol {
            list-style-type: decimal;
            padding-left: 1.5rem;
            margin: 0.5rem 0;
          }
          .preview-content hr {
            border: none;
            border-top: 2px solid #e2e8f0;
            margin: 1rem 0;
          }
          .preview-content p {
            margin: 0.5rem 0;
          }
          .preview-content img {
            display: block;
            margin-left: auto;
            margin-right: auto;
            text-align: center;
            max-width: 100%;
            height: auto;
            margin: 1rem auto;
          }
          .preview-content ul[data-type="taskList"] {
            list-style: none;
            padding: 0;
            margin: 0.5rem 0;
          }
          .preview-content ul[data-type="taskList"] li {
            display: flex;
            align-items: center;
            margin: 0.5rem 0;
            gap: 0.5rem;
          }
          .preview-content ul[data-type="taskList"] li > label {
            flex: 0 0 auto;
            margin-right: 0.5rem;
            user-select: none;
            display: flex;
            align-items: center;
          }
          .preview-content ul[data-type="taskList"] li > div {
            flex: 1 1 auto;
          }
          .preview-content ul[data-type="taskList"] li[data-checked="true"] {
            text-decoration: line-through;
            color: #6b7280;
          }
          .preview-content s {
            text-decoration: line-through;
          }
        `}</style>
        <div
          className="preview-content prose max-w-none border rounded p-6 bg-white"
          dangerouslySetInnerHTML={{ __html: note.content }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Edit Note</h1>
        {hasChanges && (
          <span className="text-sm text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
            Unsaved changes
          </span>
        )}
      </div>

      <Form method="post" className="space-y-4">
        <Input
          type="text"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-2xl font-semibold w-full border-b py-2"
        />

        <div className="border rounded-md overflow-hidden">
          <TiptapEditor content={content} onChange={setContent} />
        </div>

        <input type="hidden" name="content" value={content} />

        <div className="flex justify-end space-x-2 items-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive">Delete</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader className="text-start">
                <DialogTitle>Delete</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this note?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <div className="flex items-center justify-end gap-2">
                  <DialogClose>
                    <Button variant="outline">Close</Button>
                  </DialogClose>
                  <Form method="post">
                    <input type="hidden" name="intent" value="delete" />
                    <Button
                      type="submit"
                      variant="destructive"
                      name="intent"
                      value="delete"
                    >
                      Delete
                    </Button>
                  </Form>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button
            type="submit"
            name="intent"
            value="update"
            className="px-4 py-2 bg-black text-white rounded-md"
            disabled={isSubmitting || (!hasChanges && !isDeleteDialogOpen)}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </Form>

      <div className="mt-8 border-t pt-4">
        <h2 className="text-lg font-semibold mb-2">Preview</h2>
        <style>{`
          .preview-content h1 {
            font-size: 1.75rem;
            font-weight: 700;
            margin-top: 1rem;
            margin-bottom: 0.5rem;
            line-height: 1.2;
          }
          .preview-content h2 {
            font-size: 1.5rem;
            font-weight: 600;
            margin-top: 1rem;
            margin-bottom: 0.5rem;
            line-height: 1.25;
          }
          .preview-content h3 {
            font-size: 1.25rem;
            font-weight: 600;
            margin-top: 1rem;
            margin-bottom: 0.5rem;
          }
          .preview-content h4 {
            font-size: 1.125rem;
            font-weight: 600;
            margin-top: 1rem;
            margin-bottom: 0.5rem;
          }
          .preview-content h5 {
            font-size: 1rem;
            font-weight: 600;
            margin-top: 1rem;
            margin-bottom: 0.5rem;
          }
          .preview-content h6 {
            font-size: 0.875rem;
            font-weight: 600;
            margin-top: 1rem;
            margin-bottom: 0.5rem;
          }
          .preview-content blockquote {
            border-left: 4px solid #e2e8f0;
            padding-left: 1rem;
            font-style: italic;
            margin: 1rem 0;
            color: #4a5568;
          }
          .preview-content ul {
            list-style-type: disc;
            padding-left: 1.5rem;
            margin: 0.5rem 0;
          }
          .preview-content ol {
            list-style-type: decimal;
            padding-left: 1.5rem;
            margin: 0.5rem 0;
          }
          .preview-content hr {
            border: none;
            border-top: 2px solid #e2e8f0;
            margin: 1rem 0;
          }
          .preview-content p {
            margin: 0.5rem 0;
          }
          .preview-content img {
            display: block;
            margin-left: auto;
            margin-right: auto;
            text-align: center;
            max-width: 100%;
            height: auto;
            margin: 1rem auto;
          }
          .preview-content ul[data-type="taskList"] {
            list-style: none;
            padding: 0;
            margin: 0.5rem 0;
          }
          .preview-content ul[data-type="taskList"] li {
            display: flex;
            align-items: center;
            margin: 0.5rem 0;
            gap: 0.5rem;
          }
          .preview-content ul[data-type="taskList"] li > label {
            flex: 0 0 auto;
            margin-right: 0.5rem;
            user-select: none;
            display: flex;
            align-items: center;
          }
          .preview-content ul[data-type="taskList"] li > div {
            flex: 1 1 auto;
          }
          .preview-content ul[data-type="taskList"] li[data-checked="true"] {
            text-decoration: line-through;
            color: #6b7280;
          }
          .preview-content s {
            text-decoration: line-through;
          }
        `}</style>
        <div
          className="preview-content prose max-w-none border rounded p-4 bg-gray-50"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
}

export async function action({ request, params }: ActionFunctionArgs) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const userId = session?.user?.id;
  const note = await prisma.note.findUnique({
    where: { id: params.id },
  });

  if (note?.userId !== userId) {
    return new Response("Unauthorized", { status: 403 });
  }

  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "delete") {
    await prisma.note.delete({
      where: {
        id: params.id,
      },
    });
    return redirect("/notes");
  }

  const title = formData.get("title");
  const content = formData.get("content");

  const parse = updateNoteSchema.safeParse({ title, content });

  if (!parse.success) {
    const fieldErrors = parse.error.format();
    return { fieldErrors };
  }

  const { title: updatedTitle, content: updatedContent } = parse.data;

  await prisma.note.update({
    where: { id: params.id },
    data: {
      title: updatedTitle,
      content: updatedContent,
    },
  });

  return redirect("/notes");
}
