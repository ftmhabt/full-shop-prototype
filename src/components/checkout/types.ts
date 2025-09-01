import { CartItem } from "@/types";
import { Address, ShippingMethod } from "@prisma/client";

export interface CheckoutStepperProps {
  addresses: Address[];
}

export interface AddressStepProps {
  addresses: Address[];
  selectedAddress: Address | null;
  setSelectedAddress: (address: Address) => void;
  onNext: () => void;
}

export interface ShippingStepProps {
  shippingMethod: ShippingMethod | null;
  setShippingMethod: (method: ShippingMethod) => void;
  onNext: () => void;
  onBack: () => void;
}

export interface ReviewStepProps {
  cart: CartItem[];
  selectedAddressId: string | null;
  shippingMethod: string;
  onNext: () => void;
  onBack: () => void;
}

export interface PaymentStepProps {
  orderId: string;
  onSuccess: (trackingCode: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export interface SuccessStepProps {
  trackingCode: string;
}

export interface AddressSnapshot {
  fullName: string;
  phone: string;
  province: string;
  city: string;
  address: string;
  postalCode?: string;
}
