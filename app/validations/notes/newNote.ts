import { z } from "zod";

export const newNoteSchema = z.object({
  title: z.string(),
  content: z.string(),
});
