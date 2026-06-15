import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Некорректный email адрес"),
  password: z.string().min(8, "Пароль должен содержать минимум 8 символов"),
});

export const registerSchema = z.object({
  email: z.email("Некорректный email адрес"),
  password: z.string().min(8, "Пароль должен содержать минимум 8 символов"),
  name: z.string().min(2, "Имя должно содержать минимум 2 символа"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
