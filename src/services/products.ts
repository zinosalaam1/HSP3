import { supabase } from '@/lib/supabase';
import type { Product, ProductVariant } from '@/types';

export interface DBProduct {
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
  product_variants?: DBVariant[];
}

export interface DBVariant {
  id: string;
  product_id: string;
  size: string;
  format: string | null;
  price: number;
  created_at: string;
}

function toProduct(row: DBProduct): Product {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    price: row.price,
    type: row.type as Product['type'],
    category: row.category as Product['category'],
    orientation: row.orientation as Product['orientation'],
    images: row.images,
    inventory_count: row.inventory_count,
    featured: row.featured,
    bestseller: row.bestseller,
    photographer: row.photographer ?? undefined,
    created_at: row.created_at,
    variants: row.product_variants?.map((v) => ({
      id: v.id,
      size: v.size,
      format: v.format ?? undefined,
      price: v.price,
    })),
  };
}

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*, product_variants(*)')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data as DBProduct[]).map(toProduct);
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*, product_variants(*)')
    .eq('id', id)
    .single();

  if (error) return null;
  return toProduct(data as DBProduct);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*, product_variants(*)')
    .eq('featured', true)
    .limit(3);

  if (error) throw error;
  return (data as DBProduct[]).map(toProduct);
}

export async function createProduct(
  product: Omit<Product, 'id' | 'created_at'> & { variants?: Omit<ProductVariant, 'id'>[] }
): Promise<Product> {
  const { variants, ...productData } = product;

  const { data, error } = await supabase
    .from('products')
    .insert({
      title: productData.title,
      description: productData.description,
      price: productData.price,
      type: productData.type,
      category: productData.category,
      orientation: productData.orientation,
      images: productData.images,
      inventory_count: productData.inventory_count,
      featured: productData.featured ?? false,
      bestseller: productData.bestseller ?? false,
      photographer: productData.photographer ?? null,
    })
    .select()
    .single();

  if (error) throw error;

  if (variants && variants.length > 0) {
    await supabase.from('product_variants').insert(
      variants.map((v) => ({
        product_id: data.id,
        size: v.size,
        format: v.format ?? null,
        price: v.price,
      }))
    );
  }

  return getProductById(data.id) as Promise<Product>;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return getProductById(data.id) as Promise<Product>;
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}

export async function uploadProductImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop();
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from('product-images')
    .upload(filename, file, { cacheControl: '3600', upsert: false });

  if (error) throw error;

  const { data } = supabase.storage.from('product-images').getPublicUrl(filename);
  return data.publicUrl;
}
