import type {
  Attribute,
  Attribute as AttributeModel,
  AttributeValue,
  AttributeValue as AttributeValueModel,
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
  price: number;
  quantity: number;
  image?: string;
}

export type OrderStep = "address" | "cart" | "review" | "payment" | "success";
