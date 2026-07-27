import { entrySchema } from "@/features/entries/schemas";

const validEntry = {
  situation: "Сегодня я закончил сложный проект на работе",
  achievement: "Я успешно сдал проект в срок",
  emotion: "Гордость",
  thought: "Я понял, что могу справляться с трудными задачами",
};

describe("entrySchema", () => {
  it("passes valid entry data", () => {
    const result = entrySchema.safeParse(validEntry);

    expect(result.success).toBe(true);
  });

  it("fails when situation is too short", () => {
    const result = entrySchema.safeParse({ ...validEntry, situation: "коротко" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("situation");
    }
  });

  it("fails when emotion is missing", () => {
    const result = entrySchema.safeParse({ ...validEntry, emotion: "" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("emotion");
    }
  });
});
