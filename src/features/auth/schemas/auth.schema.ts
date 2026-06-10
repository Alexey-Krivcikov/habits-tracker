import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must contain at least 8 characters"),
});

export const registerSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must contain at least 8 characters"),
  name: z.string().min(2, "Name must contain at least 2 characters"),
});

export const authSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must contain at least 8 characters"),
});

export type AuthFormValues = z.infer<typeof authSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
