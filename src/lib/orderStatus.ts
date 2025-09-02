export const orderStatusLabel: Record<string, string> = {
  PENDING: "در انتظار",
  PAID: "در انتظار ارسال",
  SHIPPED: "ارسال شده",
  COMPLETED: "تکمیل شده",
  CANCELED: "لغو شده",
};

export const orderStatusColor: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAID: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELED: "bg-red-100 text-red-800",
};

export const paymentStatusLabel: Record<string, string> = {
  PENDING: "در انتظار پرداخت",
  PAID: "پرداخت موفق",
  FAILED: "پرداخت ناموفق",
};

export const paymentStatusColor: Record<string, string> = {
  PENDING: "bg-gray-100 text-gray-700",
  PAID: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
};
