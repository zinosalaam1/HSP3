import { useState } from 'react';
import { motion } from 'motion/react';
import type { Product } from '@/types';
import { Badge } from '@/app/components/ui/badge';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick(product)}
      className="group cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#F5F5F5] mb-4">
        <ImageWithFallback
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out"
          style={{
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          }}
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {product.bestseller && (
            <Badge className="bg-[#1C1C1E] text-white font-['Inter'] text-xs">
              Bestseller
            </Badge>
          )}
          {product.featured && (
            <Badge className="bg-[#C9A45C] text-white font-['Inter'] text-xs">
              Featured
            </Badge>
          )}
        </div>

        {/* Quick View Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 bg-[#1C1C1E]/20 flex items-center justify-center"
        >
          <span className="text-white font-['Inter'] text-sm tracking-wide px-6 py-2 border border-white/50 backdrop-blur-sm">
            View Details
          </span>
        </motion.div>
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-['Inter'] font-medium text-[#1C1C1E] group-hover:text-[#C9A45C] transition-colors">
            {product.title}
          </h3>
          <span className="font-['Inter'] text-[#1C1C1E] whitespace-nowrap">
            ₦{product.price.toLocaleString('en-NG')}
          </span>
        </div>
        
        <div className="flex items-center gap-3 text-xs text-[#8E8E93] font-['Inter']">
          <span className="capitalize">{product.type}</span>
          <span>•</span>
          <span className="capitalize">{product.category}</span>
        </div>

        {product.photographer && (
          <p className="text-xs text-[#8E8E93] font-['Inter']">
            by {product.photographer}
          </p>
        )}
      </div>
    </motion.div>
  );
}
