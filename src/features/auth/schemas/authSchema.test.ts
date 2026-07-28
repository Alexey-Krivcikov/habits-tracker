import { loginSchema, registerSchema } from "@/features";

const validLogin = { email: "user@example.com", password: "password123" };
const validRegister = { email: "user@example.com", password: "password123", name: "Иван" };

describe("loginSchema", () => {
  it("passes with valid data", () => {
    expect(loginSchema.safeParse(validLogin).success).toBe(true);
  });

  it("fails with invalid email", () => {
    const result = loginSchema.safeParse({ ...validLogin, email: "not-email" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("email");
    }
  });

  it("fails with short password", () => {
    const result = loginSchema.safeParse({ ...validLogin, password: "123" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("password");
    }
  });

  it("fails with empty email", () => {
    const result = loginSchema.safeParse({ ...validLogin, email: "" });

    expect(result.success).toBe(false);
  });

  it("fails with empty password", () => {
    const result = loginSchema.safeParse({ ...validLogin, password: "" });

    expect(result.success).toBe(false);
  });
});

describe("registerSchema", () => {
  it("passes with valid data", () => {
    expect(registerSchema.safeParse(validRegister).success).toBe(true);
  });

  it("fails with invalid email", () => {
    const result = registerSchema.safeParse({ ...validRegister, email: "bad" });

    expect(result.success).toBe(false);
  });

  it("fails with short password", () => {
    const result = registerSchema.safeParse({ ...validRegister, password: "123" });

    expect(result.success).toBe(false);
  });

  it("fails with short name", () => {
    const result = registerSchema.safeParse({ ...validRegister, name: "И" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("name");
    }
  });

  it("fails with empty name", () => {
    const result = registerSchema.safeParse({ ...validRegister, name: "" });

    expect(result.success).toBe(false);
  });
});
