import { OrderStatus, PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // --- Users ---
  const passwordHash = await bcrypt.hash("password123", 10);

  const users = await Promise.all([
    prisma.user.create({
      data: { phone: "1111111111", role: Role.ADMIN, password: passwordHash },
    }),
    prisma.user.create({
      data: { phone: "2222222222", role: Role.USER, password: passwordHash },
    }),
    prisma.user.create({
      data: { phone: "3333333333", role: Role.EDITOR, password: passwordHash },
    }),
  ]);

  // --- Categories ---
  const categories = await Promise.all([
    prisma.category.create({
      data: { name: "Electronics", slug: "electronics" },
    }),
    prisma.category.create({ data: { name: "Books", slug: "books" } }),
    prisma.category.create({ data: { name: "Clothing", slug: "clothing" } }),
  ]);

  // --- Products ---
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: "Laptop",
        description: "High performance laptop",
        price: 1200,
        stock: 10,
        categoryId: categories[0].id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Smartphone",
        description: "Latest smartphone",
        price: 800,
        stock: 15,
        categoryId: categories[0].id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Book A",
        description: "Interesting book",
        price: 25,
        stock: 50,
        categoryId: categories[1].id,
      },
    }),
    prisma.product.create({
      data: {
        name: "T-Shirt",
        description: "Comfortable cotton t-shirt",
        price: 20,
        stock: 100,
        categoryId: categories[2].id,
      },
    }),
  ]);

  // --- Orders ---
  const orders = await Promise.all([
    prisma.order.create({
      data: {
        userId: users[1].id,
        status: OrderStatus.PAID,
        items: {
          create: [
            { productId: products[0].id, quantity: 1 },
            { productId: products[2].id, quantity: 2 },
          ],
        },
      },
    }),
    prisma.order.create({
      data: {
        userId: users[1].id,
        status: OrderStatus.PENDING,
        items: { create: [{ productId: products[1].id, quantity: 1 }] },
      },
    }),
    prisma.order.create({
      data: {
        userId: users[2].id,
        status: OrderStatus.SHIPPED,
        items: {
          create: [
            { productId: products[3].id, quantity: 3 },
            { productId: products[2].id, quantity: 1 },
          ],
        },
      },
    }),
  ]);

  // --- BlogPosts ---
  await Promise.all([
    prisma.blogPost.create({
      data: {
        title: "Welcome to our store",
        content: "We are excited to have you here!",
        authorId: users[0].id,
      },
    }),
    prisma.blogPost.create({
      data: {
        title: "Tips for using electronics",
        content: "Always handle with care...",
        authorId: users[0].id,
      },
    }),
    prisma.blogPost.create({
      data: {
        title: "Best books to read in 2025",
        content: "Here are some must-read books...",
        authorId: users[2].id,
      },
    }),
  ]);

  console.log(
    "Database seeded successfully with at least 3 entries per entity!"
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
