import { z } from "zod";

export const updateNoteSchema = z.object({
  title: z.string(),
  content: z.string(),
});
