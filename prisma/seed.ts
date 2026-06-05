import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("Seeding database...");
  
  // Clean existing records
  await prisma.generation.deleteMany();
  await prisma.voice.deleteMany();

  const voice1 = await prisma.voice.create({
    data: {
      name: "Serena",
      description: "Warm audiobook narrator",
      category: "AUDIOBOOK",
      language: "en-US",
      variant: "SYSTEM",
    },
  });

  const voice2 = await prisma.voice.create({
    data: {
      name: "Marcus",
      description: "Deep corporate voiceover",
      category: "CORPORATE",
      language: "en-GB",
      variant: "SYSTEM",
    },
  });

  await prisma.generation.create({
    data: {
      orgId: "org-starter",
      voiceId: voice1.id,
      text: "Welcome to resonance, your audio generation platform.",
      voiceName: voice1.name,
      temperature: 0.7,
      topP: 1.0,
      topK: 50,
      repetitionPenalty: 1.0,
    },
  });

  console.log("Seed complete! Created 2 voices and 1 generation.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Seed error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
