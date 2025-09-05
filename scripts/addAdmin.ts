import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  const users = [];
  const hashedPassword = await bcrypt.hash("hashedpassword", 10);
  const user = await prisma.user.create({
    data: {
      phone: `0900${getRandomInt(1000000, 9999999)}`,
      firstName: `ftm`,
      lastName: "نمونه",
      displayName: `کاربرft`,
      email: `userff@example.com`,
      role: "ADMIN",
      password: hashedPassword,
    },
  });
  users.push(user);

  console.log("admin successfully inserted!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
