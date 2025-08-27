import type {
  Attribute as AttributeModel,
  AttributeValue as AttributeValueModel,
  Product as ProductModel,
} from "@prisma/client";

export type ProductWithAttributes = ProductModel & {
  attributes: {
    value: AttributeValueModel & {
      attribute: AttributeModel;
    };
  }[];
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
