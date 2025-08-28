import { CartItem } from "@/types";
import { Address } from "@prisma/client";

export interface CheckoutStepperProps {
  addresses: Address[];
}

export interface AddressStepProps {
  addresses: Address[];
  onNext: () => void;
  selectedAddressId: string | null;
  setSelectedAddressId: (id: string) => void;
}

export interface CartStepProps {
  cart: CartItem[];
  onNext: () => void;
}

export interface ReviewStepProps {
  onNext: () => void;
  onBack: () => void;
}

export interface PaymentStepProps {
  orderId: string;
  onSuccess: () => void;
}

export interface SuccessStepProps {
  orderId: string;
}

export interface AddressSnapshot {
  fullName: string;
  phone: string;
  province: string;
  city: string;
  address: string;
  postalCode?: string;
}
