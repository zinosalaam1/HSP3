import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Star, Loader2, Instagram, MapPin } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { ProductCard } from '@/app/components/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { supabase } from '@/lib/supabase';
import { mockTestimonials } from '@/data/mockData';
import type { Product } from '@/types';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { toast } from 'sonner';

interface HomePageProps {
  onNavigate: (page: string) => void;
  onProductClick: (product: Product) => void;
}

export function HomePage({ onNavigate, onProductClick }: HomePageProps) {
  const { products, loading } = useProducts();
  const [testimonials, setTestimonials] = useState(mockTestimonials);
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  const featuredProducts = products.filter((p) => p.featured).slice(0, 3);
  const bestsellerProducts = products.filter((p) => p.bestseller).slice(0, 4);

  useEffect(() => {
    supabase.from('testimonials').select('*').eq('is_published', true).then(({ data }) => {
      if (data && data.length > 0) {
        setTestimonials(data.map((t) => ({ id: t.id, name: t.name, role: t.role, content: t.content })));
      }
    });
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribing(true);
    try {
      await supabase.from('newsletter_subscribers').insert({ email });
      toast.success('You\'re subscribed! Welcome to HSP Images.');
      setEmail('');
    } catch {
      toast.error('Already subscribed or invalid email.');
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-[#1C1C1E]">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1609829962897-74e376b71572?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 text-white/70 font-['Inter'] text-sm mb-6">
            <MapPin className="h-4 w-4" /> Lagos, Nigeria
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            className="font-['Playfair_Display'] text-5xl md:text-7xl text-white mb-6 leading-tight">
            Finding Uncommon<br />Beauty Through the Lens
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="font-['Inter'] text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Fine art prints, editorial photography, and photography services by Hakeem Salaam — 
            one of Nigeria's most imaginative photographers.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => onNavigate('shop')} size="lg" className="bg-[#C9A45C] hover:bg-[#B89350] text-white font-['Inter'] px-8">
              Shop Prints <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button onClick={() => onNavigate('services')} size="lg" className="bg-white/10 hover:bg-white/20 text-white border border-white/30 font-['Inter'] px-8 backdrop-blur-sm">
              Book a Session
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl text-[#1C1C1E] mb-4">Featured Collections</h2>
          <p className="font-['Inter'] text-[#8E8E93] max-w-2xl mx-auto">
            Curated selections from Hakeem's most celebrated series — available as limited edition fine art prints
          </p>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => <div key={i} className="animate-pulse"><div className="aspect-[4/5] bg-[#F5F5F5] rounded mb-4" /><div className="h-4 bg-[#F5F5F5] rounded w-3/4 mb-2" /><div className="h-3 bg-[#F5F5F5] rounded w-1/2" /></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onClick={onProductClick} />
            ))}
          </div>
        )}
        <div className="text-center mt-12">
          <Button onClick={() => onNavigate('shop')} variant="outline" className="font-['Inter'] px-8">View All Collections</Button>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="bg-[#FAFAF9] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl text-[#1C1C1E] mb-4">Bestsellers</h2>
            <p className="font-['Inter'] text-[#8E8E93] max-w-2xl mx-auto">
              Most loved pieces — in Nigerian homes, offices, and galleries
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {bestsellerProducts.map((product) => (
              <ProductCard key={product.id} product={product} onClick={onProductClick} />
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Artist — Hakeem's real bio */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="aspect-[4/5] bg-[#F5F5F5] overflow-hidden">
            <ImageWithFallback
              src="/hakeem-field.jpg"
              alt="Hakeem Salaam — HSP Images"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="font-['Inter'] text-sm text-[#C9A45C] tracking-widest uppercase mb-3">About the Photographer</p>
            <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl text-[#1C1C1E] mb-6">Hakeem Salaam</h2>
            <p className="font-['Inter'] text-[#8E8E93] leading-relaxed mb-4">
              One of the most imaginative minds working the camera in Nigeria today. Hakeem began making 
              images in his mind as a child, and started capturing them in 1989. He is the recipient of the 
              <strong className="text-[#1C1C1E]"> Fashion Photographer of the Year Award</strong>, and his work has been 
              exhibited in Lagos, Abuja, and London.
            </p>
            <p className="font-['Inter'] text-[#8E8E93] leading-relaxed mb-6 italic border-l-2 border-[#C9A45C] pl-4">
              "I seek the uncommon beauty in the viewing lens of the camera — beyond the sociocultural trappings, 
              my work carries pedagogical merit."
            </p>
            <div className="flex items-center gap-4">
              <Button onClick={() => onNavigate('about')} className="bg-[#1C1C1E] hover:bg-[#2C2C2E] text-white font-['Inter']">
                Full Biography
              </Button>
              <a href="https://www.instagram.com/hspimages/" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 font-['Inter'] text-sm text-[#8E8E93] hover:text-[#1C1C1E] transition-colors">
                <Instagram className="h-4 w-4" /> @hspimages
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[#1C1C1E] text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl mb-4">What Clients Say</h2>
            <p className="font-['Inter'] text-white/60">From collectors, brands, and collaborators across Nigeria</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white/5 backdrop-blur-sm p-8 rounded-lg border border-white/10">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-[#C9A45C] text-[#C9A45C]" />)}
                </div>
                <p className="font-['Inter'] text-white/90 leading-relaxed mb-6">"{testimonial.content}"</p>
                <div>
                  <p className="font-['Inter'] font-medium text-white">{testimonial.name}</p>
                  <p className="font-['Inter'] text-sm text-white/60">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Exhibitions Banner */}
      <section className="bg-[#C9A45C]/10 border-y border-[#C9A45C]/20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="font-['Inter'] text-xs text-[#C9A45C] tracking-widest uppercase mb-1">Recent Exhibition</p>
              <h3 className="font-['Playfair_Display'] text-2xl text-[#1C1C1E]">EKOMO — Pancras Library, Camden, London · 2023</h3>
              <p className="font-['Inter'] text-sm text-[#8E8E93] mt-1">An exploration of African Musical heritage through traditional instruments</p>
            </div>
            <Button onClick={() => onNavigate('about')} variant="outline" className="font-['Inter'] whitespace-nowrap flex-shrink-0">
              View All Exhibitions
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl text-[#1C1C1E] mb-4">Stay Connected</h2>
        <p className="font-['Inter'] text-[#8E8E93] mb-8">
          New prints, exhibition announcements, and photography insights — delivered to your inbox.
        </p>
        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="flex-1 px-4 py-3 border border-[#8E8E93]/30 rounded font-['Inter'] text-sm focus:outline-none focus:border-[#C9A45C]"
          />
          <Button type="submit" disabled={subscribing} className="bg-[#C9A45C] hover:bg-[#B89350] text-white font-['Inter'] px-8">
            {subscribing ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Subscribe'}
          </Button>
        </form>
      </section>
    </div>
  );
}
