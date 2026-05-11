import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: 'admin' | 'customer';
          phone: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      products: {
        Row: {
          id: string;
          title: string;
          description: string;
          price: number;
          type: string;
          category: string;
          orientation: string;
          images: string[];
          inventory_count: number;
          featured: boolean;
          bestseller: boolean;
          photographer: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['products']['Insert']>;
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          size: string;
          format: string | null;
          price: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['product_variants']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['product_variants']['Insert']>;
      };
      orders: {
        Row: {
          id: string;
          user_id: string | null;
          guest_email: string | null;
          status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
          subtotal: number;
          tax: number;
          shipping_cost: number;
          total_price: number;
          shipping_address: Record<string, string>;
          payment_reference: string | null;
          payment_status: 'pending' | 'paid' | 'failed';
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['orders']['Insert']>;
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          variant_id: string | null;
          quantity: number;
          unit_price: number;
          total_price: number;
          product_snapshot: Record<string, unknown>;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['order_items']['Row'], 'id' | 'created_at'>;
        Update: never;
      };
      testimonials: {
        Row: {
          id: string;
          name: string;
          role: string;
          content: string;
          avatar_url: string | null;
          is_published: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['testimonials']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['testimonials']['Insert']>;
      };
      newsletter_subscribers: {
        Row: {
          id: string;
          email: string;
          subscribed_at: string;
        };
        Insert: Pick<Database['public']['Tables']['newsletter_subscribers']['Row'], 'email'>;
        Update: never;
      };
    };
  };
};
