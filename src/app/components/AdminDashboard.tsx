import { useState, useEffect, useRef } from 'react';
import { Upload, Package, TrendingUp, DollarSign, Users, Plus, Loader2, Trash2, Check, X } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Badge } from '@/app/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { getAllOrders, updateOrderStatus, getAdminStats } from '@/services/orders';
import { getProducts, createProduct, deleteProduct, uploadProductImage } from '@/services/products';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const STATUS_OPTIONS = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'] as const;

export function AdminDashboard() {
  const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, totalCustomers: 0 });
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    title: '', description: '', price: '', inventory_count: '50',
    type: 'print', category: 'landscape', orientation: 'landscape',
    featured: false, bestseller: false, photographer: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getAdminStats().then(setStats).finally(() => setLoadingStats(false));
    getAllOrders().then(setOrders).catch(() => setOrders([])).finally(() => setLoadingOrders(false));
    getProducts().then(setProducts).catch(() => setProducts([])).finally(() => setLoadingProducts(false));
  }, []);

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleUploadProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile && !imagePreview) { toast.error('Please select an image'); return; }
    setUploading(true);

    try {
      let imageUrl = imagePreview || '';
      if (imageFile) {
        imageUrl = await uploadProductImage(imageFile);
      }

      await createProduct({
        title: uploadForm.title,
        description: uploadForm.description,
        price: parseFloat(uploadForm.price),
        inventory_count: parseInt(uploadForm.inventory_count),
        type: uploadForm.type as any,
        category: uploadForm.category as any,
        orientation: uploadForm.orientation as any,
        images: [imageUrl],
        featured: uploadForm.featured,
        bestseller: uploadForm.bestseller,
        photographer: uploadForm.photographer || undefined,
      });

      toast.success('Product published!');
      setUploadForm({ title: '', description: '', price: '', inventory_count: '50', type: 'print', category: 'landscape', orientation: 'landscape', featured: false, bestseller: false, photographer: '' });
      setImageFile(null);
      setImagePreview(null);
      const refreshed = await getProducts();
      setProducts(refreshed);
    } catch (err) {
      toast.error('Failed to publish product. Are you connected to Supabase?');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    try {
      await deleteProduct(id);
      setProducts((p) => p.filter((x) => x.id !== id));
      toast.success('Product deleted');
    } catch {
      toast.error('Failed to delete product');
    }
  };

  const handleOrderStatusChange = async (orderId: string, status: typeof STATUS_OPTIONS[number]) => {
    try {
      await updateOrderStatus(orderId, status);
      setOrders((o) => o.map((x) => x.id === orderId ? { ...x, status } : x));
      toast.success('Order status updated');
    } catch {
      toast.error('Failed to update order');
    }
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
      <div className="mb-12">
        <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl text-[#1C1C1E] mb-2">Admin Dashboard</h1>
        <p className="font-['Inter'] text-[#8E8E93]">Manage your photography store</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 lg:w-auto">
          <TabsTrigger value="overview" className="font-['Inter']">Overview</TabsTrigger>
          <TabsTrigger value="products" className="font-['Inter']">Products</TabsTrigger>
          <TabsTrigger value="orders" className="font-['Inter']">Orders</TabsTrigger>
          <TabsTrigger value="upload" className="font-['Inter']">Upload</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="font-['Inter'] text-sm font-medium text-[#8E8E93]">Total Revenue</CardTitle>
                <DollarSign className="h-5 w-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <p className="font-['Playfair_Display'] text-3xl text-[#1C1C1E]">${stats.totalRevenue.toFixed(2)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="font-['Inter'] text-sm font-medium text-[#8E8E93]">Total Orders</CardTitle>
                <Package className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <p className="font-['Playfair_Display'] text-3xl text-[#1C1C1E]">{stats.totalOrders}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="font-['Inter'] text-sm font-medium text-[#8E8E93]">Total Customers</CardTitle>
                <Users className="h-5 w-5 text-purple-600" />
              </CardHeader>
              <CardContent>
                <p className="font-['Playfair_Display'] text-3xl text-[#1C1C1E]">{stats.totalCustomers}</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent orders table */}
          <div>
            <h2 className="font-['Playfair_Display'] text-2xl text-[#1C1C1E] mb-6">Recent Orders</h2>
            {loadingOrders ? (
              <div className="flex items-center gap-2 text-[#8E8E93] font-['Inter']"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div>
            ) : (
              <div className="border border-[#8E8E93]/30 rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-['Inter']">Reference</TableHead>
                      <TableHead className="font-['Inter']">Customer</TableHead>
                      <TableHead className="font-['Inter']">Amount</TableHead>
                      <TableHead className="font-['Inter']">Status</TableHead>
                      <TableHead className="font-['Inter']">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.slice(0, 8).map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-['Inter'] font-medium">#{order.payment_reference}</TableCell>
                        <TableCell className="font-['Inter']">{order.profiles?.name || order.guest_email || 'Guest'}</TableCell>
                        <TableCell className="font-['Inter']">${order.total_price?.toFixed(2)}</TableCell>
                        <TableCell>
                          <span className={`px-3 py-1 rounded-full text-xs font-['Inter'] capitalize ${getStatusColor(order.status)}`}>{order.status}</span>
                        </TableCell>
                        <TableCell className="font-['Inter'] text-sm text-[#8E8E93]">
                          {new Date(order.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                    {orders.length === 0 && (
                      <TableRow><TableCell colSpan={5} className="text-center text-[#8E8E93] font-['Inter'] py-8">No orders yet</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Products */}
        <TabsContent value="products" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-['Playfair_Display'] text-2xl text-[#1C1C1E]">Product Inventory</h2>
            <Badge className="font-['Inter']">{products.length} products</Badge>
          </div>
          {loadingProducts ? (
            <div className="flex items-center gap-2 text-[#8E8E93] font-['Inter']"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div>
          ) : (
            <div className="border border-[#8E8E93]/30 rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-['Inter']">Product</TableHead>
                    <TableHead className="font-['Inter']">Type</TableHead>
                    <TableHead className="font-['Inter']">Price</TableHead>
                    <TableHead className="font-['Inter']">Stock</TableHead>
                    <TableHead className="font-['Inter']">Featured</TableHead>
                    <TableHead className="font-['Inter']">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-['Inter'] font-medium">{product.title}</TableCell>
                      <TableCell className="font-['Inter'] capitalize">{product.type}</TableCell>
                      <TableCell className="font-['Inter']">₦{product.price.toLocaleString('en-NG')}</TableCell>
                      <TableCell className="font-['Inter']">{product.inventory_count}</TableCell>
                      <TableCell>
                        {product.featured ? <Check className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4 text-[#8E8E93]" />}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteProduct(product.id)} className="text-red-500 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        {/* Orders Management */}
        <TabsContent value="orders" className="space-y-6">
          <h2 className="font-['Playfair_Display'] text-2xl text-[#1C1C1E]">All Orders</h2>
          {loadingOrders ? (
            <div className="flex items-center gap-2 text-[#8E8E93] font-['Inter']"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div>
          ) : (
            <div className="border border-[#8E8E93]/30 rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-['Inter']">Reference</TableHead>
                    <TableHead className="font-['Inter']">Customer</TableHead>
                    <TableHead className="font-['Inter']">Items</TableHead>
                    <TableHead className="font-['Inter']">Total</TableHead>
                    <TableHead className="font-['Inter']">Status</TableHead>
                    <TableHead className="font-['Inter']">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-['Inter'] font-medium">#{order.payment_reference}</TableCell>
                      <TableCell className="font-['Inter']">{order.profiles?.name || order.guest_email || 'Guest'}</TableCell>
                      <TableCell className="font-['Inter']">{order.order_items?.length || 0}</TableCell>
                      <TableCell className="font-['Inter']">${order.total_price?.toFixed(2)}</TableCell>
                      <TableCell>
                        <Select
                          value={order.status}
                          onValueChange={(v) => handleOrderStatusChange(order.id, v as any)}
                        >
                          <SelectTrigger className="w-32 font-['Inter'] text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUS_OPTIONS.map((s) => (
                              <SelectItem key={s} value={s} className="font-['Inter'] capitalize">{s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="font-['Inter'] text-sm text-[#8E8E93]">
                        {new Date(order.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                  {orders.length === 0 && (
                    <TableRow><TableCell colSpan={6} className="text-center text-[#8E8E93] font-['Inter'] py-8">No orders yet</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        {/* Upload Product */}
        <TabsContent value="upload" className="space-y-6">
          <h2 className="font-['Playfair_Display'] text-2xl text-[#1C1C1E] mb-6">Upload New Product</h2>
          <form onSubmit={handleUploadProduct} className="max-w-2xl space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label className="font-['Inter']">Product Title</Label>
                <Input required value={uploadForm.title} onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})} placeholder="e.g., Mountain Landscape" className="font-['Inter'] mt-1" />
              </div>
              <div className="col-span-2">
                <Label className="font-['Inter']">Description</Label>
                <Textarea required value={uploadForm.description} onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})} rows={3} className="font-['Inter'] mt-1" />
              </div>
              <div>
                <Label className="font-['Inter']">Price ($)</Label>
                <Input type="number" min="0" step="0.01" required value={uploadForm.price} onChange={(e) => setUploadForm({...uploadForm, price: e.target.value})} className="font-['Inter'] mt-1" />
              </div>
              <div>
                <Label className="font-['Inter']">Inventory Count</Label>
                <Input type="number" min="0" value={uploadForm.inventory_count} onChange={(e) => setUploadForm({...uploadForm, inventory_count: e.target.value})} className="font-['Inter'] mt-1" />
              </div>
              <div>
                <Label className="font-['Inter']">Type</Label>
                <Select value={uploadForm.type} onValueChange={(v) => setUploadForm({...uploadForm, type: v})}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['print','digital','preset','service','frame'].map((t) => (
                      <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="font-['Inter']">Category</Label>
                <Select value={uploadForm.category} onValueChange={(v) => setUploadForm({...uploadForm, category: v})}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['landscape','portrait','abstract','urban','nature','editorial'].map((c) => (
                      <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="font-['Inter']">Orientation</Label>
                <Select value={uploadForm.orientation} onValueChange={(v) => setUploadForm({...uploadForm, orientation: v})}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['landscape','portrait','square'].map((o) => (
                      <SelectItem key={o} value={o} className="capitalize">{o}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="font-['Inter']">Photographer</Label>
                <Input value={uploadForm.photographer} onChange={(e) => setUploadForm({...uploadForm, photographer: e.target.value})} placeholder="Photographer name" className="font-['Inter'] mt-1" />
              </div>
              <div className="col-span-2 flex gap-6">
                <label className="flex items-center gap-2 font-['Inter'] text-sm cursor-pointer">
                  <input type="checkbox" checked={uploadForm.featured} onChange={(e) => setUploadForm({...uploadForm, featured: e.target.checked})} className="rounded" />
                  Featured
                </label>
                <label className="flex items-center gap-2 font-['Inter'] text-sm cursor-pointer">
                  <input type="checkbox" checked={uploadForm.bestseller} onChange={(e) => setUploadForm({...uploadForm, bestseller: e.target.checked})} className="rounded" />
                  Bestseller
                </label>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <Label className="font-['Inter']">Product Image</Label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="mt-2 border-2 border-dashed border-[#8E8E93]/30 rounded-lg p-8 text-center hover:border-[#C9A45C] transition-colors cursor-pointer"
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="h-40 object-cover mx-auto rounded" />
                ) : (
                  <>
                    <Upload className="h-10 w-10 text-[#8E8E93] mx-auto mb-3" />
                    <p className="font-['Inter'] text-sm text-[#1C1C1E]">Click to upload image</p>
                    <p className="font-['Inter'] text-xs text-[#8E8E93] mt-1">PNG, JPG up to 10MB</p>
                  </>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImagePick} className="hidden" />
            </div>

            <div className="flex gap-4 pt-2">
              <Button type="submit" disabled={uploading} className="bg-[#C9A45C] hover:bg-[#B89350] text-white font-['Inter']">
                {uploading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Publishing…</> : 'Publish Product'}
              </Button>
              <Button type="button" variant="outline" className="font-['Inter']" onClick={() => {
                setUploadForm({ title: '', description: '', price: '', inventory_count: '50', type: 'print', category: 'landscape', orientation: 'landscape', featured: false, bestseller: false, photographer: '' });
                setImageFile(null); setImagePreview(null);
              }}>
                Reset
              </Button>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
