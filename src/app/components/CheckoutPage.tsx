import { useState } from 'react';
import { Lock, CheckCircle, Loader2, CreditCard, Smartphone } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { createOrder, confirmPayment } from '@/services/orders';
import { toast } from 'sonner';
import type { ShippingAddress } from '@/types';

interface CheckoutPageProps {
  onNavigate: (page: string) => void;
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

export function CheckoutPage({ onNavigate }: CheckoutPageProps) {
  const { items, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderRef, setOrderRef] = useState('');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('dummy-card');

  const subtotal = getTotalPrice();
  const tax = 0; // No VAT display for Nigeria
  const shipping = subtotal > 120000 ? 0 : 5000;
  const total = subtotal + tax + shipping;

  const [shippingData, setShippingData] = useState<ShippingAddress>({
    full_name: user?.name || '',
    address_line1: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'Nigeria',
    phone: '',
  });

  const [guestEmail, setGuestEmail] = useState(user?.email || '');

  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentProcessing(true);

    try {
      // Create order in Supabase
      const order = await createOrder({
        userId: user?.id,
        guestEmail: user ? undefined : guestEmail,
        items,
        shippingAddress: shippingData,
      });

      setOrderId(order.id);
      setOrderRef(order.payment_reference || '');

      // Simulate payment processing (replace with Paystack later)
      await sleep(2000);
      await confirmPayment(order.id);

      clearCart();
      setStep('confirmation');
      toast.success('Order placed successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setPaymentProcessing(false);
    }
  };

  if (step === 'confirmation') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center max-w-lg mx-auto px-4">
          <CheckCircle className="h-20 w-20 text-green-600 mx-auto mb-6" />
          <h2 className="font-['Playfair_Display'] text-4xl text-[#1C1C1E] mb-4">Order Confirmed!</h2>
          <p className="font-['Inter'] text-[#8E8E93] mb-2">
            Thank you for your order. A confirmation has been sent to{' '}
            <span className="text-[#1C1C1E]">{guestEmail || user?.email}</span>
          </p>
          <p className="font-['Inter'] text-sm text-[#8E8E93] mb-8">Order reference: <strong>#{orderRef}</strong></p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => onNavigate('account')} className="bg-[#C9A45C] hover:bg-[#B89350] text-white font-['Inter']">
              View Order Details
            </Button>
            <Button onClick={() => onNavigate('shop')} variant="outline" className="font-['Inter']">
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl text-[#1C1C1E] mb-12">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          {/* Progress */}
          <div className="flex items-center gap-4 mb-12">
            {['Shipping', 'Payment'].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                {i > 0 && <div className="flex-1 h-px bg-[#8E8E93]/30 w-12" />}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-['Inter'] text-sm ${
                  (i === 0 && step === 'shipping') || (i === 1 && step === 'payment') ? 'bg-[#C9A45C] text-white' :
                  (i === 0 && step === 'payment') ? 'bg-[#1C1C1E] text-white' : 'bg-[#8E8E93]/30 text-[#8E8E93]'
                }`}>{i + 1}</div>
                <span className="font-['Inter'] text-sm text-[#1C1C1E]">{s}</span>
              </div>
            ))}
          </div>

          {/* Shipping Form */}
          {step === 'shipping' && (
            <form onSubmit={handleShippingSubmit} className="space-y-6">
              {!user && (
                <div>
                  <Label htmlFor="guestEmail" className="font-['Inter']">Email (for order confirmation)</Label>
                  <Input id="guestEmail" type="email" required value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} className="font-['Inter'] mt-1" placeholder="you@example.com" />
                </div>
              )}
              <h2 className="font-['Playfair_Display'] text-2xl text-[#1C1C1E]">Shipping Information</h2>
              <div className="space-y-4">
                <div>
                  <Label className="font-['Inter']">Full Name</Label>
                  <Input required value={shippingData.full_name} onChange={(e) => setShippingData({...shippingData, full_name: e.target.value})} className="font-['Inter'] mt-1" />
                </div>
                <div>
                  <Label className="font-['Inter']">Phone</Label>
                  <Input type="tel" required value={shippingData.phone} onChange={(e) => setShippingData({...shippingData, phone: e.target.value})} className="font-['Inter'] mt-1" />
                </div>
                <div>
                  <Label className="font-['Inter']">Address</Label>
                  <Input required value={shippingData.address_line1} onChange={(e) => setShippingData({...shippingData, address_line1: e.target.value})} className="font-['Inter'] mt-1" />
                </div>
                {shippingData.address_line2 !== undefined && (
                  <div>
                    <Label className="font-['Inter']">Address Line 2 (optional)</Label>
                    <Input value={shippingData.address_line2 || ''} onChange={(e) => setShippingData({...shippingData, address_line2: e.target.value})} className="font-['Inter'] mt-1" />
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-['Inter']">City</Label>
                    <Input required value={shippingData.city} onChange={(e) => setShippingData({...shippingData, city: e.target.value})} className="font-['Inter'] mt-1" />
                  </div>
                  <div>
                    <Label className="font-['Inter']">State</Label>
                    <Input required value={shippingData.state} onChange={(e) => setShippingData({...shippingData, state: e.target.value})} className="font-['Inter'] mt-1" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-['Inter']">Postal Code</Label>
                    <Input value={shippingData.postal_code} onChange={(e) => setShippingData({...shippingData, postal_code: e.target.value})} className="font-['Inter'] mt-1" />
                  </div>
                  <div>
                    <Label className="font-['Inter']">Country</Label>
                    <Input required value={shippingData.country} onChange={(e) => setShippingData({...shippingData, country: e.target.value})} className="font-['Inter'] mt-1" />
                  </div>
                </div>
              </div>
              <Button type="submit" size="lg" className="w-full bg-[#C9A45C] hover:bg-[#B89350] text-white font-['Inter']">
                Continue to Payment
              </Button>
            </form>
          )}

          {/* Payment Form */}
          {step === 'payment' && (
            <form onSubmit={handlePaymentSubmit} className="space-y-6">
              <h2 className="font-['Playfair_Display'] text-2xl text-[#1C1C1E] mb-6">Payment Method</h2>

              {/* Paystack coming soon notice */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <p className="font-['Inter'] text-sm text-amber-800">
                  <strong>🚧 Test Mode:</strong> Paystack integration coming soon. Use the test options below to simulate payment.
                </p>
              </div>

              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                <div className={`border rounded-lg p-4 cursor-pointer ${paymentMethod === 'dummy-card' ? 'border-[#C9A45C]' : 'border-[#8E8E93]/30'}`}>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="dummy-card" id="dummy-card" />
                    <Label htmlFor="dummy-card" className="font-['Inter'] flex items-center gap-2 cursor-pointer">
                      <CreditCard className="h-4 w-4" /> Dummy Card (Test)
                    </Label>
                  </div>
                  {paymentMethod === 'dummy-card' && (
                    <div className="pl-7 mt-4 space-y-3">
                      <div>
                        <Label className="font-['Inter'] text-xs text-[#8E8E93]">Card Number (test)</Label>
                        <Input defaultValue="4111 1111 1111 1111" readOnly className="font-['Inter'] mt-1 bg-[#FAFAF9]" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="font-['Inter'] text-xs text-[#8E8E93]">Expiry</Label>
                          <Input defaultValue="12/28" readOnly className="font-['Inter'] mt-1 bg-[#FAFAF9]" />
                        </div>
                        <div>
                          <Label className="font-['Inter'] text-xs text-[#8E8E93]">CVV</Label>
                          <Input defaultValue="123" readOnly className="font-['Inter'] mt-1 bg-[#FAFAF9]" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className={`border rounded-lg p-4 cursor-pointer ${paymentMethod === 'dummy-transfer' ? 'border-[#C9A45C]' : 'border-[#8E8E93]/30'}`}>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="dummy-transfer" id="dummy-transfer" />
                    <Label htmlFor="dummy-transfer" className="font-['Inter'] flex items-center gap-2 cursor-pointer">
                      <Smartphone className="h-4 w-4" /> Bank Transfer (Test)
                    </Label>
                  </div>
                  {paymentMethod === 'dummy-transfer' && (
                    <div className="pl-7 mt-4 bg-[#FAFAF9] p-3 rounded text-sm font-['Inter'] space-y-1">
                      <p className="text-[#8E8E93]">Test Bank: <strong>HSP Test Bank</strong></p>
                      <p className="text-[#8E8E93]">Account: <strong>0123456789</strong></p>
                      <p className="text-[#8E8E93]">Amount: <strong>₦{total.toLocaleString('en-NG')}</strong></p>
                    </div>
                  )}
                </div>
              </RadioGroup>

              <div className="flex items-center gap-2 text-sm text-[#8E8E93] font-['Inter']">
                <Lock className="h-4 w-4" />
                <span>Your order is processed securely. Paystack live payments coming soon.</span>
              </div>

              <div className="flex gap-4">
                <Button type="button" variant="outline" size="lg" onClick={() => setStep('shipping')} className="flex-1 font-['Inter']">
                  Back
                </Button>
                <Button type="submit" size="lg" disabled={paymentProcessing} className="flex-1 bg-[#C9A45C] hover:bg-[#B89350] text-white font-['Inter']">
                  {paymentProcessing ? (
                    <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Processing…</span>
                  ) : (
                    `Place Order • ₦${total.toLocaleString('en-NG', {minimumFractionDigits: 0})}`
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-[#FAFAF9] p-6 rounded-lg sticky top-24">
            <h3 className="font-['Playfair_Display'] text-xl text-[#1C1C1E] mb-4">Order Summary</h3>
            <div className="space-y-3 mb-6">
              {items.map((item) => (
                <div key={`${item.product.id}-${item.variant?.id || 'default'}`} className="flex justify-between text-sm font-['Inter']">
                  <span className="text-[#8E8E93]">{item.product.title} ×{item.quantity}</span>
                  <span className="text-[#1C1C1E]">₦{((item.variant?.price || item.product.price) * item.quantity).toLocaleString('en-NG')}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2 mb-4 pb-4 border-b border-[#8E8E93]/20">
              <div className="flex justify-between text-sm font-['Inter']"><span className="text-[#8E8E93]">Subtotal</span><span>₦{subtotal.toLocaleString('en-NG')}</span></div>
              <div className="flex justify-between text-sm font-['Inter']"><span className="text-[#8E8E93]">Delivery fee</span><span>₦{tax.toLocaleString('en-NG')}</span></div>
              <div className="flex justify-between text-sm font-['Inter']"><span className="text-[#8E8E93]">Shipping</span><span>{shipping === 0 ? 'FREE' : `₦${shipping.toLocaleString('en-NG')}`}</span></div>
            </div>
            <div className="flex justify-between font-['Inter']">
              <span className="text-[#1C1C1E] font-medium">Total</span>
              <span className="text-xl text-[#1C1C1E] font-medium">₦{total.toLocaleString('en-NG')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
