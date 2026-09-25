export interface DeliveryMethod {
  id: string;
  name: string;
  description: string;
  estimatedDays: string;
  price: number;
  freeAbove?: number;
  isPopular?: boolean;
}

export const deliveryMethods: readonly DeliveryMethod[] = [
  {
    id: "standard",
    name: "Standard Artisan Delivery",
    description: "Carefully packed in eco-friendly protective packaging. Dispatched via carbon-neutral ground shipping.",
    estimatedDays: "3–5 business days",
    price: 49,
    freeAbove: 1499,
    isPopular: true,
  },
  {
    id: "express",
    name: "Express Priority Dispatch",
    description: "Fast-tracked dispatch directly from regional master weaver/craftsman workshops.",
    estimatedDays: "1–2 business days",
    price: 149,
  },
  {
    id: "gift",
    name: "Artisan Gift Packaging & Delivery",
    description: "Includes a handcrafted banana-fibre gift box, hand-pressed flower gift card, and priority shipping.",
    estimatedDays: "2–3 business days",
    price: 249,
  },
];

export const defaultDeliveryMethod = deliveryMethods[0];
