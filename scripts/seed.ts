import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  // --- Users ---
  await Promise.all([
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
      create: {
        phone: "3333333333",
        role: Role.EDITOR,
        password: passwordHash,
      },
    }),
  ]);

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

  // --- Attributes ---
  // Electronics: Brand, Color
  const brandElectronics = await prisma.attribute.upsert({
    where: { name_categoryId: { name: "Brand", categoryId: electronics.id } },
    update: {},
    create: { name: "Brand", categoryId: electronics.id },
  });

  const colorElectronics = await prisma.attribute.upsert({
    where: { name_categoryId: { name: "Color", categoryId: electronics.id } },
    update: {},
    create: { name: "Color", categoryId: electronics.id },
  });

  const brandValuesElectronics = await Promise.all(
    ["Apple", "Samsung", "Dell"].map((val) =>
      prisma.attributeValue.upsert({
        where: {
          value_attributeId: { value: val, attributeId: brandElectronics.id },
        },
        update: {},
        create: { value: val, attributeId: brandElectronics.id },
      })
    )
  );

  const colorValuesElectronics = await Promise.all(
    ["Black", "Silver", "White"].map((val) =>
      prisma.attributeValue.upsert({
        where: {
          value_attributeId: { value: val, attributeId: colorElectronics.id },
        },
        update: {},
        create: { value: val, attributeId: colorElectronics.id },
      })
    )
  );

  // Clothing: Size, Color
  const sizeClothing = await prisma.attribute.upsert({
    where: { name_categoryId: { name: "Size", categoryId: clothing.id } },
    update: {},
    create: { name: "Size", categoryId: clothing.id },
  });

  const colorClothing = await prisma.attribute.upsert({
    where: { name_categoryId: { name: "Color", categoryId: clothing.id } },
    update: {},
    create: { name: "Color", categoryId: clothing.id },
  });

  const sizeValuesClothing = await Promise.all(
    ["S", "M", "L", "XL"].map((val) =>
      prisma.attributeValue.upsert({
        where: {
          value_attributeId: { value: val, attributeId: sizeClothing.id },
        },
        update: {},
        create: { value: val, attributeId: sizeClothing.id },
      })
    )
  );

  const colorValuesClothing = await Promise.all(
    ["Red", "Blue", "Black"].map((val) =>
      prisma.attributeValue.upsert({
        where: {
          value_attributeId: { value: val, attributeId: colorClothing.id },
        },
        update: {},
        create: { value: val, attributeId: colorClothing.id },
      })
    )
  );

  // --- Products ---
  const products = await Promise.all([
    prisma.product.upsert({
      where: { slug: "laptop" },
      update: {},
      create: {
        name: "Laptop",
        slug: "laptop",
        description: "High performance laptop",
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
        slug: "smartphone",
        description: "Latest smartphone",
        price: 800,
        stock: 0, // out of stock
        categoryId: electronics.id,
      },
    }),
    prisma.product.upsert({
      where: { slug: "headphones" },
      update: {},
      create: {
        name: "Headphones",
        slug: "headphones",
        description: "Noise-canceling headphones",
        price: 200,
        stock: 25,
        categoryId: electronics.id,
      },
    }),
    prisma.product.upsert({
      where: { slug: "book-a" },
      update: {},
      create: {
        name: "Book A",
        slug: "book-a",
        description: "Interesting novel",
        price: 25,
        stock: 50,
        categoryId: books.id,
      },
    }),
    prisma.product.upsert({
      where: { slug: "book-b" },
      update: {},
      create: {
        name: "Book B",
        slug: "book-b",
        description: "Science textbook",
        price: 40,
        stock: 30,
        categoryId: books.id,
      },
    }),
    prisma.product.upsert({
      where: { slug: "t-shirt" },
      update: {},
      create: {
        name: "T-Shirt",
        slug: "t-shirt",
        description: "Cotton T-shirt",
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
        slug: "jeans",
        description: "Slim fit jeans",
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
        slug: "jacket",
        description: "Winter jacket",
        price: 120,
        stock: 15,
        categoryId: clothing.id,
      },
    }),
  ]);

  // --- Product Attributes ---
  // Link products to attribute values
  await Promise.all([
    // Laptop (Dell, Silver)
    prisma.productAttribute.upsert({
      where: {
        productId_valueId: {
          productId: products[0].id,
          valueId: brandValuesElectronics[2].id,
        },
      },
      update: {},
      create: {
        productId: products[0].id,
        valueId: brandValuesElectronics[2].id,
      },
    }),
    prisma.productAttribute.upsert({
      where: {
        productId_valueId: {
          productId: products[0].id,
          valueId: colorValuesElectronics[1].id,
        },
      },
      update: {},
      create: {
        productId: products[0].id,
        valueId: colorValuesElectronics[1].id,
      },
    }),

    // Smartphone (Apple, Black)
    prisma.productAttribute.upsert({
      where: {
        productId_valueId: {
          productId: products[1].id,
          valueId: brandValuesElectronics[0].id,
        },
      },
      update: {},
      create: {
        productId: products[1].id,
        valueId: brandValuesElectronics[0].id,
      },
    }),
    prisma.productAttribute.upsert({
      where: {
        productId_valueId: {
          productId: products[1].id,
          valueId: colorValuesElectronics[0].id,
        },
      },
      update: {},
      create: {
        productId: products[1].id,
        valueId: colorValuesElectronics[0].id,
      },
    }),

    // Headphones (Samsung, White)
    prisma.productAttribute.upsert({
      where: {
        productId_valueId: {
          productId: products[2].id,
          valueId: brandValuesElectronics[1].id,
        },
      },
      update: {},
      create: {
        productId: products[2].id,
        valueId: brandValuesElectronics[1].id,
      },
    }),
    prisma.productAttribute.upsert({
      where: {
        productId_valueId: {
          productId: products[2].id,
          valueId: colorValuesElectronics[2].id,
        },
      },
      update: {},
      create: {
        productId: products[2].id,
        valueId: colorValuesElectronics[2].id,
      },
    }),

    // T-Shirt (Size M, Red)
    prisma.productAttribute.upsert({
      where: {
        productId_valueId: {
          productId: products[5].id,
          valueId: sizeValuesClothing[1].id,
        },
      },
      update: {},
      create: { productId: products[5].id, valueId: sizeValuesClothing[1].id },
    }),
    prisma.productAttribute.upsert({
      where: {
        productId_valueId: {
          productId: products[5].id,
          valueId: colorValuesClothing[0].id,
        },
      },
      update: {},
      create: { productId: products[5].id, valueId: colorValuesClothing[0].id },
    }),

    // Jeans (Size L, Blue)
    prisma.productAttribute.upsert({
      where: {
        productId_valueId: {
          productId: products[6].id,
          valueId: sizeValuesClothing[2].id,
        },
      },
      update: {},
      create: { productId: products[6].id, valueId: sizeValuesClothing[2].id },
    }),
    prisma.productAttribute.upsert({
      where: {
        productId_valueId: {
          productId: products[6].id,
          valueId: colorValuesClothing[1].id,
        },
      },
      update: {},
      create: { productId: products[6].id, valueId: colorValuesClothing[1].id },
    }),

    // Jacket (Size XL, Black)
    prisma.productAttribute.upsert({
      where: {
        productId_valueId: {
          productId: products[7].id,
          valueId: sizeValuesClothing[3].id,
        },
      },
      update: {},
      create: { productId: products[7].id, valueId: sizeValuesClothing[3].id },
    }),
    prisma.productAttribute.upsert({
      where: {
        productId_valueId: {
          productId: products[7].id,
          valueId: colorValuesClothing[2].id,
        },
      },
      update: {},
      create: { productId: products[7].id, valueId: colorValuesClothing[2].id },
    }),
  ]);

  console.log("seed completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
