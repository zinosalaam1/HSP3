import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Download, MapPin, Settings, Loader2, ExternalLink } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { getUserOrders } from '@/services/orders';
import { toast } from 'sonner';

export function AccountPage() {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => { await logout(); navigate('/'); };
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [name, setName] = useState(user?.name || '');
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (!user) return;
    getUserOrders(user.id)
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoadingOrders(false));
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    const { error } = await updateProfile({ name });
    if (error) toast.error('Failed to update profile');
    else toast.success('Profile updated');
    setSavingProfile(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-50';
      case 'shipped': return 'text-blue-600 bg-blue-50';
      case 'paid': return 'text-purple-600 bg-purple-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'cancelled': return 'text-red-600 bg-red-50';
      default: return 'text-[#8E8E93] bg-[#F5F5F5]';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12 flex items-start justify-between">
        <div>
          <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl text-[#1C1C1E] mb-2">My Account</h1>
          <p className="font-['Inter'] text-[#8E8E93]">Welcome back, {user?.name}</p>
        </div>
        <Button onClick={handleLogout} variant="outline" className="font-['Inter'] text-sm">Sign out</Button>
      </div>

      <Tabs defaultValue="orders" className="space-y-8">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 lg:w-auto">
          <TabsTrigger value="orders" className="font-['Inter']"><Package className="h-4 w-4 mr-2" />Orders</TabsTrigger>
          <TabsTrigger value="downloads" className="font-['Inter']"><Download className="h-4 w-4 mr-2" />Downloads</TabsTrigger>
          <TabsTrigger value="addresses" className="font-['Inter']"><MapPin className="h-4 w-4 mr-2" />Addresses</TabsTrigger>
          <TabsTrigger value="profile" className="font-['Inter']"><Settings className="h-4 w-4 mr-2" />Settings</TabsTrigger>
        </TabsList>

        {/* Orders */}
        <TabsContent value="orders" className="space-y-6">
          <h2 className="font-['Playfair_Display'] text-2xl text-[#1C1C1E]">Order History</h2>
          {loadingOrders ? (
            <div className="flex items-center gap-3 text-[#8E8E93] font-['Inter']">
              <Loader2 className="h-5 w-5 animate-spin" /> Loading orders…
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 bg-[#FAFAF9] rounded-lg">
              <Package className="h-12 w-12 text-[#8E8E93] mx-auto mb-4" />
              <p className="font-['Inter'] text-[#8E8E93]">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border border-[#8E8E93]/20 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-['Inter'] font-medium text-[#1C1C1E]">#{order.payment_reference}</p>
                      <p className="font-['Inter'] text-sm text-[#8E8E93]">
                        {new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-['Inter'] capitalize ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <p className="font-['Inter'] font-medium text-[#1C1C1E] mt-2">${order.total_price.toFixed(2)}</p>
                    </div>
                  </div>
                  {order.order_items?.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-3 text-sm font-['Inter'] text-[#8E8E93]">
                      <span>• {item.product_snapshot?.title || 'Product'} ×{item.quantity}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Downloads */}
        <TabsContent value="downloads">
          <h2 className="font-['Playfair_Display'] text-2xl text-[#1C1C1E] mb-6">Digital Downloads</h2>
          <div className="text-center py-16 bg-[#FAFAF9] rounded-lg">
            <Download className="h-12 w-12 text-[#8E8E93] mx-auto mb-4" />
            <p className="font-['Inter'] text-[#8E8E93]">Digital purchases will appear here</p>
          </div>
        </TabsContent>

        {/* Addresses */}
        <TabsContent value="addresses">
          <h2 className="font-['Playfair_Display'] text-2xl text-[#1C1C1E] mb-6">Saved Addresses</h2>
          {orders.filter(o => o.shipping_address?.address_line1).slice(0, 1).map((order) => (
            <div key={order.id} className="border border-[#8E8E93]/20 rounded-lg p-6 max-w-sm">
              <p className="font-['Inter'] font-medium text-[#1C1C1E] mb-1">{order.shipping_address.full_name}</p>
              <p className="font-['Inter'] text-sm text-[#8E8E93]">{order.shipping_address.address_line1}</p>
              <p className="font-['Inter'] text-sm text-[#8E8E93]">{order.shipping_address.city}, {order.shipping_address.state}</p>
              <p className="font-['Inter'] text-sm text-[#8E8E93]">{order.shipping_address.country}</p>
            </div>
          ))}
          {orders.length === 0 && (
            <div className="text-center py-16 bg-[#FAFAF9] rounded-lg">
              <MapPin className="h-12 w-12 text-[#8E8E93] mx-auto mb-4" />
              <p className="font-['Inter'] text-[#8E8E93]">No saved addresses yet</p>
            </div>
          )}
        </TabsContent>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <h2 className="font-['Playfair_Display'] text-2xl text-[#1C1C1E] mb-6">Profile Settings</h2>
          <form onSubmit={handleSaveProfile} className="max-w-md space-y-5">
            <div>
              <Label className="font-['Inter']">Full Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} className="font-['Inter'] mt-1" />
            </div>
            <div>
              <Label className="font-['Inter']">Email</Label>
              <Input value={user?.email} readOnly className="font-['Inter'] mt-1 bg-[#FAFAF9]" />
              <p className="text-xs text-[#8E8E93] font-['Inter'] mt-1">Email cannot be changed here</p>
            </div>
            <Button type="submit" disabled={savingProfile} className="bg-[#C9A45C] hover:bg-[#B89350] text-white font-['Inter']">
              {savingProfile ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Saving…</> : 'Save Changes'}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
