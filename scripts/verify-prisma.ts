import { prisma } from "../src/lib/prisma";

async function main() {
  try {
    const voicesCount = await prisma.voice.count();
    console.log(`Voices in database: ${voicesCount}`);
    console.log("✅ Connected");
  } catch (error) {
    console.error("Connection failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
