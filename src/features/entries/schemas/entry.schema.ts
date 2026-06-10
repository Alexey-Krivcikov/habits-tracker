import { z } from "zod";

export const entrySchema = z.object({
  situation: z.string().min(1, "Situation is required"),
  achievement: z.string().min(1, "Achievement is required"),
  emotion: z.string().min(1, "Emotion is required"),
  thought: z.string().min(1, "Thought is required"),
});

export type EntryFormValues = z.infer<typeof entrySchema>;
