import { OrderStatus, PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import slugify from "slugify";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  // --- Users ---
  const [admin, user1, user2, editor] = await Promise.all([
    prisma.user.upsert({
      where: { phone: "1111111111" },
      update: {},
      create: { phone: "1111111111", role: Role.ADMIN, password: passwordHash },
    }),
    prisma.user.upsert({
      where: { phone: "2222222222" },
      update: {},
      create: { phone: "2222222222", role: Role.USER, password: passwordHash },
    }),
    prisma.user.upsert({
      where: { phone: "3333333333" },
      update: {},
      create: { phone: "3333333333", role: Role.USER, password: passwordHash },
    }),
    prisma.user.upsert({
      where: { phone: "4444444444" },
      update: {},
      create: {
        phone: "4444444444",
        role: Role.EDITOR,
        password: passwordHash,
      },
    }),
  ]);

  // --- OTPs ---
  await prisma.otp.createMany({
    data: [
      {
        phone: "2222222222",
        codeHash: "hashedcode123",
        expiresAt: new Date(Date.now() + 300000),
      },
      {
        phone: "3333333333",
        codeHash: "hashedcode456",
        expiresAt: new Date(Date.now() + 300000),
      },
    ],
  });

  // --- Categories ---
  const [electronics, books, clothing] = await Promise.all([
    prisma.category.upsert({
      where: { slug: "electronics" },
      update: {},
      create: { name: "Electronics", slug: "electronics" },
    }),
    prisma.category.upsert({
      where: { slug: "books" },
      update: {},
      create: { name: "Books", slug: "books" },
    }),
    prisma.category.upsert({
      where: { slug: "clothing" },
      update: {},
      create: { name: "Clothing", slug: "clothing" },
    }),
  ]);

  // --- Attributes & Values ---
  const [brandElectronics, colorElectronics] = await Promise.all([
    prisma.attribute.upsert({
      where: { name_categoryId: { name: "Brand", categoryId: electronics.id } },
      update: {},
      create: {
        name: "Brand",
        slug: slugify("Brand").toLowerCase(),
        categoryId: electronics.id,
      },
    }),
    prisma.attribute.upsert({
      where: { name_categoryId: { name: "Color", categoryId: electronics.id } },
      update: {},
      create: {
        name: "Color",
        slug: slugify("Color").toLowerCase(),
        categoryId: electronics.id,
      },
    }),
  ]);

  const [apple, samsung, dell] = await Promise.all(
    ["Apple", "Samsung", "Dell"].map((v) =>
      prisma.attributeValue.upsert({
        where: {
          value_attributeId: { value: v, attributeId: brandElectronics.id },
        },
        update: {},
        create: {
          value: v,
          slug: slugify(v).toLowerCase(),
          attributeId: brandElectronics.id,
        },
      })
    )
  );

  const [black, silver, white] = await Promise.all(
    ["Black", "Silver", "White"].map((v) =>
      prisma.attributeValue.upsert({
        where: {
          value_attributeId: { value: v, attributeId: colorElectronics.id },
        },
        update: {},
        create: {
          value: v,
          slug: slugify(v).toLowerCase(),
          attributeId: colorElectronics.id,
        },
      })
    )
  );

  // Clothing Attributes
  const [sizeClothing, colorClothing] = await Promise.all([
    prisma.attribute.upsert({
      where: { name_categoryId: { name: "Size", categoryId: clothing.id } },
      update: {},
      create: {
        name: "Size",
        slug: slugify("Size").toLowerCase(),
        categoryId: clothing.id,
      },
    }),
    prisma.attribute.upsert({
      where: { name_categoryId: { name: "Color", categoryId: clothing.id } },
      update: {},
      create: {
        name: "Color",
        slug: slugify("Color").toLowerCase(),
        categoryId: clothing.id,
      },
    }),
  ]);

  const [sizeS, sizeM, sizeL, sizeXL] = await Promise.all(
    ["S", "M", "L", "XL"].map((v) =>
      prisma.attributeValue.upsert({
        where: {
          value_attributeId: { value: v, attributeId: sizeClothing.id },
        },
        update: {},
        create: {
          value: v,
          slug: slugify(v).toLowerCase(),
          attributeId: sizeClothing.id,
        },
      })
    )
  );

  const [red, blue, blackCloth] = await Promise.all(
    ["Red", "Blue", "Black"].map((v) =>
      prisma.attributeValue.upsert({
        where: {
          value_attributeId: { value: v, attributeId: colorClothing.id },
        },
        update: {},
        create: {
          value: v,
          slug: slugify(v).toLowerCase(),
          attributeId: colorClothing.id,
        },
      })
    )
  );

  // --- Products ---
  const [laptop, smartphone, headphones, tshirt, jeans, jacket] =
    await Promise.all([
      prisma.product.upsert({
        where: { slug: "laptop" },
        update: {},
        create: {
          name: "Laptop",
          slug: slugify("Laptop").toLowerCase(),
          description: "High performance Dell laptop",
          price: 1200,
          stock: 10,
          categoryId: electronics.id,
        },
      }),
      prisma.product.upsert({
        where: { slug: "smartphone" },
        update: {},
        create: {
          name: "Smartphone",
          slug: slugify("Smartphone").toLowerCase(),
          description: "Latest Apple smartphone",
          price: 800,
          stock: 0,
          categoryId: electronics.id,
        },
      }),
      prisma.product.upsert({
        where: { slug: "headphones" },
        update: {},
        create: {
          name: "Headphones",
          slug: slugify("Headphones").toLowerCase(),
          description: "Samsung noise-canceling headphones",
          price: 200,
          stock: 25,
          categoryId: electronics.id,
        },
      }),
      prisma.product.upsert({
        where: { slug: "t-shirt" },
        update: {},
        create: {
          name: "T-Shirt",
          slug: slugify("T-Shirt").toLowerCase(),
          description: "Red cotton T-shirt",
          price: 20,
          stock: 100,
          categoryId: clothing.id,
        },
      }),
      prisma.product.upsert({
        where: { slug: "jeans" },
        update: {},
        create: {
          name: "Jeans",
          slug: slugify("Jeans").toLowerCase(),
          description: "Blue slim fit jeans",
          price: 60,
          stock: 40,
          categoryId: clothing.id,
        },
      }),
      prisma.product.upsert({
        where: { slug: "jacket" },
        update: {},
        create: {
          name: "Jacket",
          slug: slugify("Jacket").toLowerCase(),
          description: "Winter black jacket",
          price: 120,
          stock: 15,
          categoryId: clothing.id,
        },
      }),
    ]);

  // --- Product Attributes ---
  await prisma.productAttribute.createMany({
    data: [
      { productId: laptop.id, valueId: dell.id },
      { productId: laptop.id, valueId: silver.id },
      { productId: smartphone.id, valueId: apple.id },
      { productId: smartphone.id, valueId: black.id },
      { productId: headphones.id, valueId: samsung.id },
      { productId: headphones.id, valueId: white.id },
      { productId: tshirt.id, valueId: sizeM.id },
      { productId: tshirt.id, valueId: red.id },
      { productId: jeans.id, valueId: sizeL.id },
      { productId: jeans.id, valueId: blue.id },
      { productId: jacket.id, valueId: sizeXL.id },
      { productId: jacket.id, valueId: blackCloth.id },
    ],
    skipDuplicates: true,
  });

  // --- Orders ---
  await prisma.order.create({
    data: {
      userId: user1.id,
      status: OrderStatus.PAID,
      items: {
        create: [
          { productId: laptop.id, quantity: 1 },
          { productId: tshirt.id, quantity: 2 },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      userId: user2.id,
      status: OrderStatus.PENDING,
      items: {
        create: [{ productId: jacket.id, quantity: 1 }],
      },
    },
  });

  // --- Blog Posts ---
  await prisma.blogPost.createMany({
    data: [
      {
        title: "Top 5 Electronics in 2025",
        content: "Here are the top 5 trending electronics...",
        authorId: editor.id,
      },
      {
        title: "Why Winter Jackets Are a Must-Have",
        content: "Stay warm and stylish with our winter collection...",
        authorId: admin.id,
      },
    ],
  });

  console.log("Seed completed with proper slugs!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
