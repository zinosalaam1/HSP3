import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ShoppingBag, Heart, Share2, Check } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { useCart } from '@/context/CartContext';
import { ProductCard } from '@/app/components/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import type { Product, ProductVariant } from '@/types';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { toast } from 'sonner';

interface ProductDetailPageProps {
  product: Product;
  onBack: () => void;
  onProductClick: (product: Product) => void;
}

export function ProductDetailPage({ product, onBack, onProductClick }: ProductDetailPageProps) {
  const { addToCart } = useCart();
  const { products } = useProducts();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(product.variants?.[0]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [added, setAdded] = useState(false);

  const relatedProducts = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3);
  const currentPrice = selectedVariant?.price || product.price;

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, quantity);
    setAdded(true);
    toast.success(`${product.title} added to cart`);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => toast.success('Link copied to clipboard'));
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Button variant="ghost" onClick={onBack} className="font-['Inter'] text-[#8E8E93] hover:text-[#1C1C1E]">
          <ArrowLeft className="h-4 w-4 mr-2" />Back to Shop
        </Button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Images */}
          <div className="space-y-4">
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-[4/5] bg-[#F5F5F5] overflow-hidden"
            >
              <ImageWithFallback src={product.images[selectedImage]} alt={product.title} className="w-full h-full object-cover" />
            </motion.div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 bg-[#F5F5F5] overflow-hidden flex-shrink-0 border-2 transition-colors ${selectedImage === i ? 'border-[#C9A45C]' : 'border-transparent'}`}
                  >
                    <ImageWithFallback src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-8">
            <div>
              {product.photographer && (
                <p className="font-['Inter'] text-sm text-[#8E8E93] mb-2">by {product.photographer}</p>
              )}
              <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl text-[#1C1C1E] mb-4">{product.title}</h1>
              <p className="font-['Inter'] text-3xl text-[#1C1C1E]">${currentPrice}</p>
            </div>

            <p className="font-['Inter'] text-[#8E8E93] leading-relaxed">{product.description}</p>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div>
                <h3 className="font-['Inter'] font-medium text-[#1C1C1E] mb-3">
                  Size & Format — <span className="text-[#C9A45C]">{selectedVariant?.size} {selectedVariant?.format}</span>
                </h3>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-4 py-2 border font-['Inter'] text-sm transition-all ${
                        selectedVariant?.id === variant.id
                          ? 'border-[#1C1C1E] bg-[#1C1C1E] text-white'
                          : 'border-[#8E8E93]/30 text-[#1C1C1E] hover:border-[#1C1C1E]'
                      }`}
                    >
                      {variant.size} {variant.format && `• ${variant.format}`}
                      <span className="ml-2 text-xs opacity-70">₦{variant.price.toLocaleString('en-NG')}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="font-['Inter'] font-medium text-[#1C1C1E] mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-[#8E8E93]/30">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center font-['Inter'] hover:bg-[#F5F5F5]"
                  >−</button>
                  <span className="w-12 text-center font-['Inter']">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.inventory_count, quantity + 1))}
                    className="w-10 h-10 flex items-center justify-center font-['Inter'] hover:bg-[#F5F5F5]"
                  >+</button>
                </div>
                <span className="font-['Inter'] text-sm text-[#8E8E93]">
                  {product.inventory_count > 0 ? `${product.inventory_count} in stock` : 'Out of stock'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                onClick={handleAddToCart}
                disabled={product.inventory_count === 0}
                size="lg"
                className="flex-1 bg-[#C9A45C] hover:bg-[#B89350] text-white font-['Inter']"
              >
                {added ? (
                  <span className="flex items-center gap-2"><Check className="h-4 w-4" /> Added!</span>
                ) : (
                  <span className="flex items-center gap-2"><ShoppingBag className="h-4 w-4" /> Add to Cart</span>
                )}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`px-4 ${isWishlisted ? 'text-red-500 border-red-200' : ''}`}
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button variant="outline" size="lg" className="px-4" onClick={handleShare}>
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Details */}
            <div className="border-t border-[#8E8E93]/20 pt-6 space-y-3">
              <div className="flex gap-2 font-['Inter'] text-sm">
                <span className="text-[#8E8E93] w-24">Type</span>
                <span className="text-[#1C1C1E] capitalize">{product.type}</span>
              </div>
              <div className="flex gap-2 font-['Inter'] text-sm">
                <span className="text-[#8E8E93] w-24">Category</span>
                <span className="text-[#1C1C1E] capitalize">{product.category}</span>
              </div>
              <div className="flex gap-2 font-['Inter'] text-sm">
                <span className="text-[#8E8E93] w-24">Orientation</span>
                <span className="text-[#1C1C1E] capitalize">{product.orientation}</span>
              </div>
              {product.type === 'print' && (
                <div className="flex gap-2 font-['Inter'] text-sm">
                  <span className="text-[#8E8E93] w-24">Ships in</span>
                  <span className="text-[#1C1C1E]">5–10 business days</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-24">
            <h2 className="font-['Playfair_Display'] text-3xl text-[#1C1C1E] mb-10">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} onClick={onProductClick} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
