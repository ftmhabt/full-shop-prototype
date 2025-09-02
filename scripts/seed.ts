// import { OrderStatus, PrismaClient, Role } from "@prisma/client";
// import bcrypt from "bcryptjs";
// import slugify from "slugify";

// const prisma = new PrismaClient();

// async function main() {
//   const passwordHash = await bcrypt.hash("password123", 10);

//   // --- Users ---
//   const [admin, user1, user2, editor] = await Promise.all([
//     prisma.user.upsert({
//       where: { phone: "1111111111" },
//       update: {},
//       create: { phone: "1111111111", role: Role.ADMIN, password: passwordHash },
//     }),
//     prisma.user.upsert({
//       where: { phone: "2222222222" },
//       update: {},
//       create: { phone: "2222222222", role: Role.USER, password: passwordHash },
//     }),
//     prisma.user.upsert({
//       where: { phone: "3333333333" },
//       update: {},
//       create: { phone: "3333333333", role: Role.USER, password: passwordHash },
//     }),
//     prisma.user.upsert({
//       where: { phone: "4444444444" },
//       update: {},
//       create: {
//         phone: "4444444444",
//         role: Role.EDITOR,
//         password: passwordHash,
//       },
//     }),
//   ]);

//   // --- OTPs ---
//   await prisma.otp.createMany({
//     data: [
//       {
//         phone: "2222222222",
//         codeHash: "hashedcode123",
//         expiresAt: new Date(Date.now() + 300000),
//       },
//       {
//         phone: "3333333333",
//         codeHash: "hashedcode456",
//         expiresAt: new Date(Date.now() + 300000),
//       },
//     ],
//   });

//   // --- Categories ---
//   const [electronics, books, clothing] = await Promise.all([
//     prisma.category.upsert({
//       where: { slug: "electronics" },
//       update: {},
//       create: { name: "Electronics", slug: "electronics" },
//     }),
//     prisma.category.upsert({
//       where: { slug: "books" },
//       update: {},
//       create: { name: "Books", slug: "books" },
//     }),
//     prisma.category.upsert({
//       where: { slug: "clothing" },
//       update: {},
//       create: { name: "Clothing", slug: "clothing" },
//     }),
//   ]);

//   // --- Attributes & Values ---
//   const [brandElectronics, colorElectronics] = await Promise.all([
//     prisma.attribute.upsert({
//       where: { name_categoryId: { name: "Brand", categoryId: electronics.id } },
//       update: {},
//       create: {
//         name: "Brand",
//         slug: slugify("Brand").toLowerCase(),
//         categoryId: electronics.id,
//       },
//     }),
//     prisma.attribute.upsert({
//       where: { name_categoryId: { name: "Color", categoryId: electronics.id } },
//       update: {},
//       create: {
//         name: "Color",
//         slug: slugify("Color").toLowerCase(),
//         categoryId: electronics.id,
//       },
//     }),
//   ]);

//   const [apple, samsung, dell] = await Promise.all(
//     ["Apple", "Samsung", "Dell"].map((v) =>
//       prisma.attributeValue.upsert({
//         where: {
//           value_attributeId: { value: v, attributeId: brandElectronics.id },
//         },
//         update: {},
//         create: {
//           value: v,
//           slug: slugify(v).toLowerCase(),
//           attributeId: brandElectronics.id,
//         },
//       })
//     )
//   );

//   const [black, silver, white] = await Promise.all(
//     ["Black", "Silver", "White"].map((v) =>
//       prisma.attributeValue.upsert({
//         where: {
//           value_attributeId: { value: v, attributeId: colorElectronics.id },
//         },
//         update: {},
//         create: {
//           value: v,
//           slug: slugify(v).toLowerCase(),
//           attributeId: colorElectronics.id,
//         },
//       })
//     )
//   );

//   // Clothing Attributes
//   const [sizeClothing, colorClothing] = await Promise.all([
//     prisma.attribute.upsert({
//       where: { name_categoryId: { name: "Size", categoryId: clothing.id } },
//       update: {},
//       create: {
//         name: "Size",
//         slug: slugify("Size").toLowerCase(),
//         categoryId: clothing.id,
//       },
//     }),
//     prisma.attribute.upsert({
//       where: { name_categoryId: { name: "Color", categoryId: clothing.id } },
//       update: {},
//       create: {
//         name: "Color",
//         slug: slugify("Color").toLowerCase(),
//         categoryId: clothing.id,
//       },
//     }),
//   ]);

//   const [sizeS, sizeM, sizeL, sizeXL] = await Promise.all(
//     ["S", "M", "L", "XL"].map((v) =>
//       prisma.attributeValue.upsert({
//         where: {
//           value_attributeId: { value: v, attributeId: sizeClothing.id },
//         },
//         update: {},
//         create: {
//           value: v,
//           slug: slugify(v).toLowerCase(),
//           attributeId: sizeClothing.id,
//         },
//       })
//     )
//   );

//   const [red, blue, blackCloth] = await Promise.all(
//     ["Red", "Blue", "Black"].map((v) =>
//       prisma.attributeValue.upsert({
//         where: {
//           value_attributeId: { value: v, attributeId: colorClothing.id },
//         },
//         update: {},
//         create: {
//           value: v,
//           slug: slugify(v).toLowerCase(),
//           attributeId: colorClothing.id,
//         },
//       })
//     )
//   );

//   // --- Products ---
//   const [laptop, smartphone, headphones, tshirt, jeans, jacket] =
//     await Promise.all([
//       prisma.product.upsert({
//         where: { slug: "laptop" },
//         update: {},
//         create: {
//           name: "Laptop",
//           slug: slugify("Laptop").toLowerCase(),
//           description: "High performance Dell laptop",
//           price: 1200,
//           stock: 10,
//           categoryId: electronics.id,
//           image: [
//             "https://images.pexels.com/photos/18105/pexels-photo.jpg",
//             "https://images.pexels.com/photos/238118/pexels-photo-238118.jpeg",
//             "https://images.pexels.com/photos/812264/pexels-photo-812264.jpeg",
//           ],
//         },
//       }),
//       prisma.product.upsert({
//         where: { slug: "smartphone" },
//         update: {},
//         create: {
//           name: "Smartphone",
//           slug: slugify("Smartphone").toLowerCase(),
//           description: "Latest Apple smartphone",
//           price: 800,
//           stock: 0,
//           categoryId: electronics.id,
//           image: [
//             "https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg",
//             "https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg",
//             "https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg",
//           ],
//         },
//       }),
//       prisma.product.upsert({
//         where: { slug: "headphones" },
//         update: {},
//         create: {
//           name: "Headphones",
//           slug: slugify("Headphones").toLowerCase(),
//           description: "Samsung noise-canceling headphones",
//           price: 200,
//           stock: 25,
//           categoryId: electronics.id,
//           image: [
//             "https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg",
//             "https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg",
//             "https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg",
//           ],
//         },
//       }),
//       prisma.product.upsert({
//         where: { slug: "t-shirt" },
//         update: {},
//         create: {
//           name: "T-Shirt",
//           slug: slugify("T-Shirt").toLowerCase(),
//           description: "Red cotton T-shirt",
//           price: 20,
//           stock: 100,
//           categoryId: clothing.id,
//           image: [
//             "https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg",
//             "https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg",
//             "https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg",
//           ],
//         },
//       }),
//       prisma.product.upsert({
//         where: { slug: "jeans" },
//         update: {},
//         create: {
//           name: "Jeans",
//           slug: slugify("Jeans").toLowerCase(),
//           description: "Blue slim fit jeans",
//           price: 60,
//           stock: 40,
//           categoryId: clothing.id,
//           image: [
//             "https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg",
//             "https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg",
//             "https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg",
//           ],
//         },
//       }),
//       prisma.product.upsert({
//         where: { slug: "jacket" },
//         update: {},
//         create: {
//           name: "Jacket",
//           slug: slugify("Jacket").toLowerCase(),
//           description: "Winter black jacket",
//           price: 120,
//           stock: 15,
//           categoryId: clothing.id,
//           image: [
//             "https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg",
//             "https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg",
//             "https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg",
//           ],
//         },
//       }),
//     ]);

//   // --- Product Attributes ---
//   await prisma.productAttribute.createMany({
//     data: [
//       { productId: laptop.id, valueId: dell.id },
//       { productId: laptop.id, valueId: silver.id },
//       { productId: smartphone.id, valueId: apple.id },
//       { productId: smartphone.id, valueId: black.id },
//       { productId: headphones.id, valueId: samsung.id },
//       { productId: headphones.id, valueId: white.id },
//       { productId: tshirt.id, valueId: sizeM.id },
//       { productId: tshirt.id, valueId: red.id },
//       { productId: jeans.id, valueId: sizeL.id },
//       { productId: jeans.id, valueId: blue.id },
//       { productId: jacket.id, valueId: sizeXL.id },
//       { productId: jacket.id, valueId: blackCloth.id },
//     ],
//     skipDuplicates: true,
//   });

//   // --- Orders ---
//   await prisma.order.create({
//     data: {
//       userId: user1.id,
//       status: OrderStatus.PAID,
//       items: {
//         create: [
//           { productId: laptop.id, quantity: 1 },
//           { productId: tshirt.id, quantity: 2 },
//         ],
//       },
//     },
//   });

//   await prisma.order.create({
//     data: {
//       userId: user2.id,
//       status: OrderStatus.PENDING,
//       items: {
//         create: [{ productId: jacket.id, quantity: 1 }],
//       },
//     },
//   });

//   // --- Blog Posts ---
//   await prisma.blogPost.createMany({
//     data: [
//       {
//         title: "Top 5 Electronics in 2025",
//         content: "Here are the top 5 trending electronics...",
//         authorId: editor.id,
//       },
//       {
//         title: "Why Winter Jackets Are a Must-Have",
//         content: "Stay warm and stylish with our winter collection...",
//         authorId: admin.id,
//       },
//     ],
//   });

//   console.log("Seed completed with proper slugs!");
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // دسته‌بندی‌ها
  const categories = [
    { name: "دزدگیر اماکن", slug: "alarm-systems" },
    { name: "دوربین مداربسته", slug: "cctv-cameras" },
    { name: "لوازم جانبی", slug: "accessories" },
    { name: "کنترل تردد", slug: "access-control" },
    { name: "هوشمندسازی", slug: "smart-home" },
  ];

  const createdCategories = [];
  for (const cat of categories) {
    const c = await prisma.category.create({
      data: cat,
    });
    createdCategories.push(c);
  }

  // ویژگی‌ها و مقادیر ویژگی
  const attributesData = [
    {
      category: "دوربین مداربسته",
      name: "رزولوشن",
      values: ["1080p", "4K", "720p"],
    },
    {
      category: "دوربین مداربسته",
      name: "نوع لنز",
      values: ["فیش‌آی", "مینی بولت", "دام"],
    },
    {
      category: "دزدگیر اماکن",
      name: "نوع سنسور",
      values: ["حرکتی", "در و پنجره"],
    },
    {
      category: "هوشمندسازی",
      name: "قابلیت",
      values: ["روشنایی خودکار", "کنترل از راه دور"],
    },
  ];

  const attributeMap: Record<string, any[]> = {};

  for (const attr of attributesData) {
    const category = createdCategories.find((c) => c.name === attr.category);
    if (!category) continue;

    const attribute = await prisma.attribute.create({
      data: {
        name: attr.name,
        slug: attr.name.replace(/\s+/g, "-"),
        categoryId: category.id,
      },
    });

    const values = [];
    for (const val of attr.values) {
      const value = await prisma.attributeValue.create({
        data: {
          value: val,
          slug: val.replace(/\s+/g, "-").toLowerCase(),
          attributeId: attribute.id,
        },
      });
      values.push(value);
    }

    attributeMap[attr.name] = values;
  }

  // کاربران
  const users = [];
  for (let i = 1; i <= 5; i++) {
    const user = await prisma.user.create({
      data: {
        phone: `0900${Math.floor(1000000 + Math.random() * 8999999)}`,
        firstName: `کاربر${i}`,
        lastName: "نمونه",
        displayName: `کاربر${i}`,
        email: `user${i}@example.com`,
        password: "hashedpassword",
      },
    });
    users.push(user);
  }

  // آدرس‌ها
  for (const user of users) {
    await prisma.address.createMany({
      data: [
        {
          userId: user.id,
          title: "خانه",
          fullName: `${user.firstName} ${user.lastName}`,
          phone: user.phone,
          province: "تهران",
          city: "تهران",
          address: "خیابان نمونه پلاک 1",
          postalCode: "1234567890",
        },
        {
          userId: user.id,
          title: "محل کار",
          fullName: `${user.firstName} ${user.lastName}`,
          phone: user.phone,
          province: "تهران",
          city: "تهران",
          address: "خیابان نمونه پلاک 2",
          postalCode: "0987654321",
        },
      ],
    });
  }

  // محصولات
  for (const cat of createdCategories) {
    for (let i = 1; i <= 5; i++) {
      const product = await prisma.product.create({
        data: {
          slug: `${cat.slug}-product-${i}`,
          name: `${cat.name} ${i}`,
          description: `این یک توضیح نمونه برای محصول ${i} در دسته ${cat.name} است.`,
          image: [`/images/${cat.slug}-${i}.jpg`],
          price: Math.floor(Math.random() * 1000000) + 50000,
          stock: Math.floor(Math.random() * 50) + 1,
          categoryId: cat.id,
        },
      });

      // نسبت دادن ویژگی‌ها
      const catAttrs = attributesData.filter((a) => a.category === cat.name);
      for (const a of catAttrs) {
        const value =
          attributeMap[a.name][Math.floor(Math.random() * a.values.length)];
        await prisma.productAttribute.create({
          data: {
            productId: product.id,
            valueId: value.id,
          },
        });
      }
    }
  }

  // روش‌های ارسال
  const shippingMethods = await prisma.shippingMethod.createMany({
    data: [
      { name: "پست پیشتاز", cost: 25000 },
      { name: "تیپاکس", cost: 35000 },
      { name: "ارسال رایگان", cost: 0 },
    ],
  });

  console.log("Seed data inserted successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
