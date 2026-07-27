import { PrismaClient } from "@prisma/client";
import { SEED_PRODUCTS } from "../../src/data/products";

const prisma = new PrismaClient();

async function main() {
  for (const product of SEED_PRODUCTS) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: product,
      create: product
    });
  }
  console.log(`Seeded ${SEED_PRODUCTS.length} products.`);
}

main().
finally(() => prisma.$disconnect());
