import { useState, useMemo } from 'react';
import { SlidersHorizontal, Loader2 } from 'lucide-react';
import { ProductCard } from '@/app/components/ProductCard';
import { Button } from '@/app/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/app/components/ui/sheet';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Label } from '@/app/components/ui/label';
import { useProducts } from '@/hooks/useProducts';
import type { Product, ProductType, ProductCategory, ProductOrientation } from '@/types';

interface ShopPageProps {
  onProductClick: (product: Product) => void;
}

type SortOption = 'popularity' | 'price-low' | 'price-high' | 'newest';

export function ShopPage({ onProductClick }: ShopPageProps) {
  const { products, loading } = useProducts();
  const [selectedTypes, setSelectedTypes] = useState<ProductType[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<ProductCategory[]>([]);
  const [selectedOrientations, setSelectedOrientations] = useState<ProductOrientation[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState<SortOption>('popularity');

  const types: ProductType[] = ['print', 'digital', 'service', 'preset', 'frame'];
  const categories: ProductCategory[] = ['landscape', 'portrait', 'abstract', 'urban', 'nature', 'editorial'];
  const orientations: ProductOrientation[] = ['landscape', 'portrait', 'square'];

  const toggleFilter = <T,>(value: T, selected: T[], setter: (values: T[]) => void) => {
    setter(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]);
  };

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];
    if (selectedTypes.length > 0) filtered = filtered.filter((p) => selectedTypes.includes(p.type));
    if (selectedCategories.length > 0) filtered = filtered.filter((p) => selectedCategories.includes(p.category));
    if (selectedOrientations.length > 0) filtered = filtered.filter((p) => selectedOrientations.includes(p.orientation));
    filtered = filtered.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    switch (sortBy) {
      case 'price-low': filtered.sort((a, b) => a.price - b.price); break;
      case 'price-high': filtered.sort((a, b) => b.price - a.price); break;
      case 'newest': filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); break;
      default: filtered.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0));
    }
    return filtered;
  }, [products, selectedTypes, selectedCategories, selectedOrientations, priceRange, sortBy]);

  const clearFilters = () => { setSelectedTypes([]); setSelectedCategories([]); setSelectedOrientations([]); setPriceRange([0, 1000]); };
  const hasActiveFilters = selectedTypes.length > 0 || selectedCategories.length > 0 || selectedOrientations.length > 0 || priceRange[0] > 0 || priceRange[1] < 1000;

  const FilterContent = () => (
    <div className="space-y-8">
      <div>
        <h3 className="font-['Inter'] font-medium text-[#1C1C1E] mb-4">Type</h3>
        <div className="space-y-3">
          {types.map((type) => (
            <div key={type} className="flex items-center">
              <Checkbox id={`type-${type}`} checked={selectedTypes.includes(type)} onCheckedChange={() => toggleFilter(type, selectedTypes, setSelectedTypes)} />
              <Label htmlFor={`type-${type}`} className="ml-3 font-['Inter'] text-sm capitalize text-[#1C1C1E] cursor-pointer">{type}</Label>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-['Inter'] font-medium text-[#1C1C1E] mb-4">Category</h3>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category} className="flex items-center">
              <Checkbox id={`cat-${category}`} checked={selectedCategories.includes(category)} onCheckedChange={() => toggleFilter(category, selectedCategories, setSelectedCategories)} />
              <Label htmlFor={`cat-${category}`} className="ml-3 font-['Inter'] text-sm capitalize text-[#1C1C1E] cursor-pointer">{category}</Label>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-['Inter'] font-medium text-[#1C1C1E] mb-4">Orientation</h3>
        <div className="space-y-3">
          {orientations.map((orientation) => (
            <div key={orientation} className="flex items-center">
              <Checkbox id={`ori-${orientation}`} checked={selectedOrientations.includes(orientation)} onCheckedChange={() => toggleFilter(orientation, selectedOrientations, setSelectedOrientations)} />
              <Label htmlFor={`ori-${orientation}`} className="ml-3 font-['Inter'] text-sm capitalize text-[#1C1C1E] cursor-pointer">{orientation}</Label>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-['Inter'] font-medium text-[#1C1C1E] mb-4">Price Range</h3>
        <div className="flex items-center gap-4">
          <input type="number" value={priceRange[0]} onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])} className="w-24 px-3 py-2 border border-[#8E8E93]/30 rounded font-['Inter'] text-sm" placeholder="Min" />
          <span className="text-[#8E8E93]">–</span>
          <input type="number" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 1000])} className="w-24 px-3 py-2 border border-[#8E8E93]/30 rounded font-['Inter'] text-sm" placeholder="Max" />
        </div>
      </div>
      {hasActiveFilters && <Button onClick={clearFilters} variant="outline" className="w-full font-['Inter']">Clear All Filters</Button>}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl text-[#1C1C1E] mb-4">Shop</h1>
        <p className="font-['Inter'] text-[#8E8E93]">Browse our curated collection of fine art photography</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-['Inter'] font-medium text-[#1C1C1E]">Filters</h2>
              {hasActiveFilters && <button onClick={clearFilters} className="text-[#8E8E93] hover:text-[#1C1C1E] font-['Inter'] text-sm">Clear</button>}
            </div>
            <FilterContent />
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden font-['Inter']">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />Filters
                    {hasActiveFilters && <span className="ml-2 bg-[#C9A45C] text-white text-xs px-2 py-0.5 rounded-full">{selectedTypes.length + selectedCategories.length + selectedOrientations.length}</span>}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader><SheetTitle className="font-['Inter']">Filters</SheetTitle></SheetHeader>
                  <div className="mt-8"><FilterContent /></div>
                </SheetContent>
              </Sheet>
              {loading ? (
                <span className="flex items-center gap-2 font-['Inter'] text-sm text-[#8E8E93]"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</span>
              ) : (
                <p className="font-['Inter'] text-sm text-[#8E8E93]">{filteredAndSortedProducts.length} {filteredAndSortedProducts.length === 1 ? 'product' : 'products'}</p>
              )}
            </div>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
              <SelectTrigger className="w-48 font-['Inter']"><SelectValue placeholder="Sort by" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Popularity</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/5] bg-[#F5F5F5] rounded mb-4" />
                  <div className="h-4 bg-[#F5F5F5] rounded w-3/4 mb-2" />
                  <div className="h-3 bg-[#F5F5F5] rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredAndSortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAndSortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} onClick={onProductClick} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="font-['Inter'] text-[#8E8E93] mb-4">No products found matching your filters.</p>
              <Button onClick={clearFilters} variant="outline" className="font-['Inter']">Clear Filters</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
