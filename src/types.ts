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
