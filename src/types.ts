import type {
  Attribute,
  Attribute as AttributeModel,
  AttributeValue,
  AttributeValue as AttributeValueModel,
  Brand,
  Category,
  Prisma,
  Product,
  ProductAttribute,
  Review,
  User,
} from "@prisma/client";

export type ProductWithAttributes = Product & {
  attributes: (ProductAttribute & {
    value: AttributeValue & { attribute: Attribute };
  })[];
  reviews: (Review & {
    user: Pick<User, "displayName">;
  })[];
  category: Pick<Category, "id" | "name" | "slug">;
  brand: Pick<Brand, "id" | "name" | "slug"> | null;
};

export type AttributeWithValues = AttributeModel & {
  values: AttributeValueModel[];
};

export interface Address {
  id: string;
  userId: string;
  title: string;
  fullName: string;
  phone: string;
  province: string;
  city: string;
  address: string;
  postalCode: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  name: string;
  slug: string;
  priceToman: number;
  quantity: number;
  image?: string;
  bundleId?: string;
  bundleLabel?: string;
}

export type OrderStep = "address" | "cart" | "review" | "payment" | "success";

export type BlogPostCardProps = {
  categorySlug: string;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  imageUrl?: string;
  authorAvatarUrl?: string;
  onClick?: () => void;
};

export type AdminOrderForDetails = {
  id: string;
  fullName: string;
  address: string;
  discountAmount: number;
  finalPrice: number;
  status: string;
  paymentStatus: string;

  user: User;

  //handle later
  province: string;
  city: string;
  createdAt: Date;
  //////////////
  items: {
    id: string;
    quantity: number;
    priceToman: number;
    bundleId?: string | null;
    bundleLabel?: string | null;
    productName: string;
    productSlug: string;
  }[];

  ShippingMethod: {
    id: string;
    name: string;
    cost: number; // Decimal → number
  } | null;

  OrderLog: {
    id: string;
    status: string;
    createdAt: Date;
  }[];
};

export type OrderWithUserAndShipping = Prisma.OrderGetPayload<{
  include: {
    user: { select: { firstName: true; lastName: true; phone: true } };
    ShippingMethod: { select: { id: true; name: true; cost: true } };
    items: true;
  };
}>;

export type StandardizedProduct = {
  id: string;
  name: string;
  slug: string;
  summary: string;
  description: string;
  image: string[];
  badge: string | null;
  oldPrice: number | null; // Decimal -> number
  oldPriceToman: number | null;
  price: number; // Decimal -> number
  priceToman: number;
  rating: number | null;
  stock: number;
  soldCount: number;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;

  attributes: {
    id: string;
    value: {
      id: string;
      value: string;
      attribute: {
        id: string;
        name: string;
        slug: string;
      };
    };
  }[];

  reviews: {
    id: string;
    rating: number;
    comment: string;
    user: {
      displayName: string;
    };
  }[];

  category: {
    id: string;
    name: string;
    slug: string;
  };

  brand: {
    id: string;
    name: string;
    slug: string;
  } | null;
};

export type OrderForDetails = {
  id: string;
  status: string;
  paymentStatus: string;
  createdAt: Date;
  finalPrice: number; // you’re formatting this
  trackingCode?: string | null;
  discountAmount: number;
  fullName: string;
  phone: string;
  province: string;
  city: string;
  address: string;
  postalCode?: string | null;

  items: {
    id: string;
    priceToman: number;
    quantity: number;
    bundleId?: string | null;
    bundleLabel?: string | null;
    productId: string;
    productName: string;
  }[];

  ShippingMethod: {
    id: string;
    name: string;
    cost: number; // converted from Decimal
  } | null;

  discount?: {
    code?: string | null;
  } | null;
};

export type OrderWithItems = Prisma.OrderGetPayload<{
  include: {
    items: true;
  };
}>;

export type StandardizedCartProduct = {
  id: string;
  name: string;
  price: number; // Decimal -> number
  priceToman: number;
  image?: string;
  slug?: string;
  quantity?: number;
  bundleId?: string;
  bundleLabel?: string;
};

export type DiscountType = "PERCENTAGE" | "FIXED";

export interface Discount {
  id: string;
  code: string;
  description?: string | null;
  type: DiscountType;
  value: number;
  isActive: boolean;
  isFirstTimeBuyer: boolean;
  isGlobal: boolean;
  startsAt?: string | null;
  expiresAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DiscountInput {
  code: string;
  description?: string;
  type: DiscountType;
  value: number;
  isGlobal: boolean;
  isFirstTimeBuyer: boolean;
  startsAt?: string | null;
  expiresAt?: string | null;
}
