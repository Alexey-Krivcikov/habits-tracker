import { z } from "zod";

export const entrySchema = z.object({
  situation: z.string().min(10, "Опишите ситуацию подробнее (минимум 10 символов)"),
  achievement: z.string().min(10, "Опишите достижение подробнее (минимум 10 символов)"),
  emotion: z.string().min(2, "Укажите эмоцию"),
  thought: z.string().min(10, "Опишите мысль подробнее (минимум 10 символов)"),
});

export type EntryFormValues = z.infer<typeof entrySchema>;
