"use client";

import { useMutation } from "@tanstack/react-query";
import { signIn, signUp } from "@/features/auth/services";
import { queryKeys } from "@/shared/api";
import type { LoginFormValues, RegisterFormValues } from "../schemas";

export function useLogin() {
  return useMutation({
    mutationKey: queryKeys.auth.login,
    mutationFn: async (payload: LoginFormValues) => {
      const result = await signIn.email(payload);

      if (result.error) {
        throw new Error(result.error.message);
      }

      return result.data;
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationKey: queryKeys.auth.register,
    mutationFn: async (payload: RegisterFormValues) => {
      const result = await signUp.email(payload);

      if (result.error) {
        throw new Error(result.error.message);
      }

      return result.data;
    },
  });
}
