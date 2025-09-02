import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

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
    const c = await prisma.category.create({ data: cat });
    createdCategories.push(c);
  }

  // ویژگی‌ها و مقادیر ویژگی
  const attributesData = [
    {
      category: "دوربین مداربسته",
      name: "رزولوشن",
      values: ["1080p", "4K", "720p", "5MP"],
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
      values: ["روشنایی خودکار", "کنترل از راه دور", "تشخیص صدا"],
    },
    {
      category: "لوازم جانبی",
      name: "رنگ",
      values: ["مشکی", "سفید", "نقره‌ای"],
    },
    {
      category: "کنترل تردد",
      name: "نوع کارتخوان",
      values: ["RFID", "بیومتریک"],
    },
  ];

  const attributeMap: Record<string, any[]> = {};

  for (const attr of attributesData) {
    const category = createdCategories.find((c) => c.name === attr.category);
    if (!category) continue;

    const attribute = await prisma.attribute.create({
      data: {
        name: attr.name,
        slug: attr.name.replace(/\s+/g, "-").toLowerCase(),
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
  for (let i = 1; i <= 10; i++) {
    const user = await prisma.user.create({
      data: {
        phone: `0900${getRandomInt(1000000, 9999999)}`,
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
          address: `خیابان نمونه ${getRandomInt(1, 50)}`,
          postalCode: `${getRandomInt(1000000000, 9999999999)}`,
        },
        {
          userId: user.id,
          title: "محل کار",
          fullName: `${user.firstName} ${user.lastName}`,
          phone: user.phone,
          province: "تهران",
          city: "تهران",
          address: `خیابان اداری ${getRandomInt(1, 50)}`,
          postalCode: `${getRandomInt(1000000000, 9999999999)}`,
        },
      ],
    });
  }

  // محصولات
  for (const cat of createdCategories) {
    for (let i = 1; i <= 20; i++) {
      const product = await prisma.product.create({
        data: {
          slug: `${cat.slug}-product-${i}`,
          name: `${cat.name} مدل ${i}`,
          description: `این یک توضیح کامل برای محصول ${i} از دسته‌بندی ${cat.name} است. محصولی با کیفیت بالا، مناسب برای استفاده در خانه و محل کار، با قابلیت‌ها و ویژگی‌های منحصر به فرد که نیازهای شما را برطرف می‌کند.`,
          image: [
            `/images/${cat.slug}-${i}-1.jpg`,
            `/images/${cat.slug}-${i}-2.jpg`,
          ],
          price: getRandomInt(200000, 1500000),
          stock: getRandomInt(5, 50),
          rating: getRandomInt(1, 5),
          soldCount: getRandomInt(0, 100),
          categoryId: cat.id,
        },
      });

      // نسبت دادن ویژگی‌ها
      const catAttrs = attributesData.filter((a) => a.category === cat.name);
      for (const a of catAttrs) {
        const value =
          attributeMap[a.name][getRandomInt(0, a.values.length - 1)];
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
  await prisma.shippingMethod.createMany({
    data: [
      { name: "پست پیشتاز", cost: 25000 },
      { name: "تیپاکس", cost: 35000 },
    ],
  });

  console.log("Seed data successfully inserted!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
