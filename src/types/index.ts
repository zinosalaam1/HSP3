export type ProductType = 'print' | 'digital' | 'service' | 'preset' | 'frame';

export type ProductCategory = 'landscape' | 'portrait' | 'abstract' | 'urban' | 'nature' | 'editorial';

export type ProductOrientation = 'landscape' | 'portrait' | 'square';

export interface ProductVariant {
  id: string;
  size: string;
  format?: string;
  price: number;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  type: ProductType;
  category: ProductCategory;
  images: string[];
  orientation: ProductOrientation;
  inventory_count: number;
  variants?: ProductVariant[];
  featured?: boolean;
  bestseller?: boolean;
  photographer?: string;
  created_at: string;
}

export interface CartItem {
  product: Product;
  variant?: ProductVariant;
  quantity: number;
}

export interface Order {
  id: string;
  user_id: string;
  status: 'pending' | 'paid' | 'shipped' | 'delivered';
  total_price: number;
  items: CartItem[];
  shipping_address?: ShippingAddress;
  payment_reference?: string;
  created_at: string;
}

export interface ShippingAddress {
  full_name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'customer';
  created_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar?: string;
}
