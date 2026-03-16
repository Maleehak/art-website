export interface Artwork {
  _id: string;
  title: string;
  slug: string;
  description: string;
  medium: string;
  dimensions: string;
  year: number;
  price: number;
  currency: string;
  status: "available" | "sold" | "reserved";
  collection: {
    _id: string;
    title: string;
    slug: string;
  };
  image: SanityImage;
  images: SanityImage[];
  featured: boolean;
  salePrice?: number;
  saleStart?: string;
  saleDurationHours?: number;
  reservedAt?: string;
}

export function isArtworkOnSale(artwork: Artwork): boolean {
  if (!artwork.salePrice || !artwork.saleStart || !artwork.saleDurationHours) {
    return false;
  }
  const saleEnd =
    new Date(artwork.saleStart).getTime() +
    artwork.saleDurationHours * 3600000;
  return Date.now() < saleEnd;
}

export function getSaleEndTime(artwork: Artwork): number | null {
  if (!artwork.saleStart || !artwork.saleDurationHours) return null;
  return (
    new Date(artwork.saleStart).getTime() +
    artwork.saleDurationHours * 3600000
  );
}

export function getEffectivePrice(artwork: Artwork): number {
  return isArtworkOnSale(artwork) ? artwork.salePrice! : artwork.price;
}

export interface Collection {
  _id: string;
  title: string;
  slug: string;
  description: string;
  image: SanityImage;
  artworkCount: number;
}

export interface Artist {
  name: string;
  bio: string;
  statement: string;
  photo: SanityImage;
  studioPhotos: SanityImage[];
  socialLinks: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
}

export interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
    url?: string;
  };
  alt?: string;
}

export interface CartItem {
  artwork: Artwork;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  customerEmail: string;
  customerName: string;
  shippingAddress: ShippingAddress;
  totalAmount: number;
  currency: string;
  paymentMethod: "stripe" | "jazzcash" | "easypaisa" | "bank_transfer";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  orderStatus: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
}

export interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: unknown[];
  coverImage: SanityImage;
  publishedAt: string;
  tags: string[];
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface CommissionFormData {
  name: string;
  email: string;
  phone: string;
  description: string;
  budget: string;
  preferredSize: string;
  referenceImages?: File[];
}

export type Currency = "PKR" | "USD" | "EUR" | "GBP";

export interface CurrencyRate {
  code: Currency;
  symbol: string;
  rate: number;
}
