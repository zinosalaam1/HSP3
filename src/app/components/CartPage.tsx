import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { useCart } from '@/context/CartContext';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

interface CartPageProps {
  onNavigate: (page: string) => void;
  onCheckout: () => void;
}

export function CartPage({ onNavigate, onCheckout }: CartPageProps) {
  const { items, updateQuantity, removeFromCart, getTotalPrice } = useCart();

  const subtotal = getTotalPrice();
  const tax = subtotal * 0.08; // 8% tax
  const shipping = subtotal > 200 ? 0 : 15;
  const total = subtotal + tax + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <ShoppingBag className="h-16 w-16 text-[#8E8E93] mx-auto mb-6" />
          <h2 className="font-['Playfair_Display'] text-3xl text-[#1C1C1E] mb-4">
            Your cart is empty
          </h2>
          <p className="font-['Inter'] text-[#8E8E93] mb-8">
            Discover our curated collection of fine art photography
          </p>
          <Button
            onClick={() => onNavigate('shop')}
            className="bg-[#C9A45C] hover:bg-[#B89350] text-white font-['Inter']"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl text-[#1C1C1E] mb-12">
        Shopping Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => {
            const price = item.variant?.price || item.product.price;
            const itemTotal = price * item.quantity;

            return (
              <div
                key={`${item.product.id}-${item.variant?.id || 'default'}`}
                className="flex gap-6 pb-6 border-b border-[#8E8E93]/20"
              >
                {/* Image */}
                <div className="w-32 h-40 flex-shrink-0 bg-[#F5F5F5] overflow-hidden">
                  <ImageWithFallback
                    src={item.product.images[0]}
                    alt={item.product.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-['Inter'] font-medium text-[#1C1C1E] mb-1">
                      {item.product.title}
                    </h3>
                    <p className="text-sm text-[#8E8E93] font-['Inter'] capitalize mb-2">
                      {item.product.type} • {item.product.category}
                    </p>
                    {item.variant && (
                      <p className="text-sm text-[#8E8E93] font-['Inter']">
                        {item.variant.size}
                        {item.variant.format && ` • ${item.variant.format}`}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Quantity */}
                    <div className="flex items-center border border-[#8E8E93]/30 rounded">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.quantity - 1,
                            item.variant?.id
                          )
                        }
                        className="px-3 py-1 font-['Inter'] text-sm text-[#1C1C1E] hover:bg-[#F5F5F5] transition-colors"
                      >
                        −
                      </button>
                      <span className="px-4 py-1 font-['Inter'] text-sm text-[#1C1C1E] border-x border-[#8E8E93]/30">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.quantity + 1,
                            item.variant?.id
                          )
                        }
                        className="px-3 py-1 font-['Inter'] text-sm text-[#1C1C1E] hover:bg-[#F5F5F5] transition-colors"
                      >
                        +
                      </button>
                    </div>

                    {/* Remove */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.product.id, item.variant?.id)}
                      className="text-[#8E8E93] hover:text-red-600 font-['Inter']"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>

                {/* Price */}
                <div className="text-right">
                  <p className="font-['Inter'] text-[#1C1C1E]">
                    ${itemTotal.toFixed(2)}
                  </p>
                  {item.quantity > 1 && (
                    <p className="text-sm text-[#8E8E93] font-['Inter']">
                      ${price} each
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-[#FAFAF9] p-8 rounded-lg sticky top-24">
            <h2 className="font-['Playfair_Display'] text-2xl text-[#1C1C1E] mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between font-['Inter'] text-sm">
                <span className="text-[#8E8E93]">Subtotal</span>
                <span className="text-[#1C1C1E]">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-['Inter'] text-sm">
                <span className="text-[#8E8E93]">Tax (8%)</span>
                <span className="text-[#1C1C1E]">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-['Inter'] text-sm">
                <span className="text-[#8E8E93]">Shipping</span>
                <span className="text-[#1C1C1E]">
                  {shipping === 0 ? 'FREE' : `₦{shipping.toLocaleString(\'en-NG\')}`}
                </span>
              </div>
              {subtotal < 200 && (
                <p className="text-xs text-[#8E8E93] font-['Inter']">
                  Add ${(200 - subtotal).toFixed(2)} more for free shipping
                </p>
              )}
            </div>

            <div className="pt-4 border-t border-[#8E8E93]/20 mb-6">
              <div className="flex justify-between font-['Inter']">
                <span className="text-[#1C1C1E] font-medium">Total</span>
                <span className="text-2xl text-[#1C1C1E] font-medium">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            <Button
              onClick={onCheckout}
              size="lg"
              className="w-full bg-[#C9A45C] hover:bg-[#B89350] text-white font-['Inter'] mb-4"
            >
              Proceed to Checkout
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <Button
              onClick={() => onNavigate('shop')}
              variant="outline"
              size="lg"
              className="w-full font-['Inter']"
            >
              Continue Shopping
            </Button>

            <div className="mt-6 pt-6 border-t border-[#8E8E93]/20 space-y-3 text-xs text-[#8E8E93] font-['Inter']">
              <div className="flex items-start gap-2">
                <span>✓</span>
                <span>Free worldwide shipping on orders over $200</span>
              </div>
              <div className="flex items-start gap-2">
                <span>✓</span>
                <span>30-day return policy</span>
              </div>
              <div className="flex items-start gap-2">
                <span>✓</span>
                <span>Secure payment processing</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
