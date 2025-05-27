import { prisma } from "~/lib/prisma";

export async function getNoteById(noteId: string) {
  const note = await prisma.note.findUnique({
    where: {
      id: noteId,
    },
  });

  if (!note) {
    throw new Error("No note found.");
  }

  return { note };
}

export async function getAllNotes() {
  const notes = await prisma.note.findMany();
  if (!notes) {
    throw new Error("No notes found.");
  }

  return { notes };
}

export async function createNote(title: string, content: string) {
  return await prisma.note.create({
    data: {
      title,
      content,
    },
  });
}

export async function updateNote(id: string, title: string, content: string) {
  const note = await prisma.note.update({
    where: {
      id,
    },
    data: {
      title,
      content,
    },
  });

  return { note };
}

export async function deleteNote(noteId: string) {
  return await prisma.note.delete({
    where: {
      id: noteId,
    },
  });
}
