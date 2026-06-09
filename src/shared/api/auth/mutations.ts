"use client";

import { useMutation } from "@tanstack/react-query";
import { signIn, signUp } from "@/auth/client";

type LoginPayload = {
  email: string;
  password: string;
};

type RegisterPayload = LoginPayload & {
  name: string;
};

export function useLogin() {
  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
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
    mutationFn: async (payload: RegisterPayload) => {
      const result = await signUp.email(payload);

      if (result.error) {
        throw new Error(result.error.message);
      }

      return result.data;
    },
  });
}
