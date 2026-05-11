import { useState, useEffect } from 'react';
import { getProducts } from '@/services/products';
import { mockProducts } from '@/data/mockData';
import type { Product } from '@/types';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getProducts();
        if (data.length > 0) {
          setProducts(data);
          setIsLive(true);
        }
      } catch {
        // Silently fall back to mock data when Supabase not configured
        setError(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return { products, loading, error, isLive };
}
