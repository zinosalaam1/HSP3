import { supabase } from '@/lib/supabase';
import type { CartItem, Order, ShippingAddress } from '@/types';

export interface CreateOrderInput {
  userId?: string;
  guestEmail?: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
}

function generateOrderRef(): string {
  return `HSP-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const subtotal = input.items.reduce((sum, item) => {
    const price = item.variant?.price ?? item.product.price;
    return sum + price * item.quantity;
  }, 0);

  const shipping = subtotal > 120000 ? 0 : 5000; // Free delivery over ₦120,000
  const tax = 0; // No VAT shown separately
  const total = subtotal + shipping + tax;

  const orderRef = generateOrderRef();

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: input.userId ?? null,
      guest_email: input.guestEmail ?? null,
      status: 'pending',
      subtotal,
      tax,
      shipping_cost: shipping,
      total_price: total,
      shipping_address: input.shippingAddress as unknown as Record<string, string>,
      payment_reference: orderRef,
      payment_status: 'pending',
    })
    .select()
    .single();

  if (orderError) throw orderError;

  const orderItems = input.items.map((item) => ({
    order_id: order.id,
    product_id: item.product.id,
    variant_id: item.variant?.id ?? null,
    quantity: item.quantity,
    unit_price: item.variant?.price ?? item.product.price,
    total_price: (item.variant?.price ?? item.product.price) * item.quantity,
    product_snapshot: {
      title: item.product.title,
      image: item.product.images[0],
      variant: item.variant ? { size: item.variant.size, format: item.variant.format } : null,
    },
  }));

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
  if (itemsError) throw itemsError;

  // Update inventory
  for (const item of input.items) {
    await supabase.rpc('decrement_inventory', {
      p_product_id: item.product.id,
      p_quantity: item.quantity,
    }).catch(() => {/* non-blocking */});
  }

  return {
    id: order.id,
    user_id: order.user_id ?? '',
    status: order.status,
    total_price: order.total_price,
    items: input.items,
    shipping_address: input.shippingAddress,
    payment_reference: order.payment_reference ?? undefined,
    created_at: order.created_at,
  };
}

export async function confirmPayment(orderId: string): Promise<void> {
  const { error } = await supabase
    .from('orders')
    .update({ status: 'paid', payment_status: 'paid' })
    .eq('id', orderId);
  if (error) throw error;
}

export async function getUserOrders(userId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items(
        *,
        products(title, images)
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getAllOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items(*),
      profiles!orders_user_id_fkey(name, email)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function updateOrderStatus(
  orderId: string,
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
): Promise<void> {
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId);
  if (error) throw error;
}

export async function getAdminStats() {
  const [ordersRes, usersRes] = await Promise.all([
    supabase.from('orders').select('total_price, status, created_at'),
    supabase.from('profiles').select('id', { count: 'exact' }).eq('role', 'customer'),
  ]);

  const orders = ordersRes.data ?? [];
  const totalRevenue = orders
    .filter((o) => ['paid', 'shipped', 'delivered'].includes(o.status))
    .reduce((sum, o) => sum + o.total_price, 0);

  return {
    totalRevenue,
    totalOrders: orders.length,
    totalCustomers: usersRes.count ?? 0,
    recentOrders: orders.slice(0, 5),
  };
}
