import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.category.create({
    data: {
      name: "دوربین مداربسته",
      products: {
        create: [
          { name: "دوربین HD", price: 2500000, stock: 10 },
          { name: "پکیج ۴ دوربین", price: 6200000, stock: 5 },
        ],
      },
    },
  });
}

main().finally(() => prisma.$disconnect());
