"use client";

import { useState } from "react";
import { signIn, signUp } from "@/auth/client";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "register">("register");

  const handleSubmit = async () => {
    if (mode === "register") {
      const res = await signUp.email({
        email,
        password,
        name: "Alex",
      });

      console.log("REGISTER:", res);
    }

    if (mode === "login") {
      const res = await signIn.email({
        email,
        password,
      });

      console.log("LOGIN:", res);
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>{mode === "register" ? "Register" : "Login"}</h1>

      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

      <button type="button" onClick={handleSubmit}>
        {mode === "register" ? "Sign up" : "Sign in"}
      </button>

      <button type="button" onClick={() => setMode(mode === "register" ? "login" : "register")}>
        Switch
      </button>
    </div>
  );
}
