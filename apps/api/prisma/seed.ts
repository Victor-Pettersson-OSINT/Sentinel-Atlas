import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const roles = [
    { key: "anonymous", name: "Anonymous User" },
    { key: "user", name: "Authenticated User" },
    { key: "regional_manager", name: "Regional Manager" },
    { key: "nordic_manager", name: "Nordic Manager" },
    { key: "european_manager", name: "European Manager" },
    { key: "global_manager", name: "Global Manager" },
    { key: "tag_specialist", name: "Tag Specialist" },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { key: role.key },
      update: { name: role.name },
      create: role,
    });
  }

  const global = await prisma.region.upsert({
    where: { code: "GLOBAL" },
    update: { name: "Global", type: "global" },
    create: { code: "GLOBAL", name: "Global", type: "global" },
  });

  const europe = await prisma.region.upsert({
    where: { code: "EU" },
    update: { name: "Europe", type: "macro", parentId: global.id },
    create: { code: "EU", name: "Europe", type: "macro", parentId: global.id },
  });

  const nordic = await prisma.region.upsert({
    where: { code: "NORDIC" },
    update: { name: "Nordic", type: "macro", parentId: europe.id },
    create: { code: "NORDIC", name: "Nordic", type: "macro", parentId: europe.id },
  });

  const countries = [
    { code: "SE", name: "Sweden", parentId: nordic.id },
    { code: "DK", name: "Denmark", parentId: nordic.id },
  ];

  for (const country of countries) {
    await prisma.region.upsert({
      where: { code: country.code },
      update: { name: country.name, type: "country", parentId: country.parentId },
      create: {
        code: country.code,
        name: country.name,
        type: "country",
        parentId: country.parentId,
      },
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
