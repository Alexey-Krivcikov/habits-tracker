import { db } from "@/db/index";
import { successEntries } from "@/db/schema";

async function main() {
  const result = await db.select().from(successEntries);
  console.log(result);
}

void main();
