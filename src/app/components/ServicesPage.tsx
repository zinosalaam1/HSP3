import { useState } from 'react';
import { motion } from 'motion/react';
import { Camera, Clock, Image, Package, Check } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { toast } from 'sonner';

export function ServicesPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    date: '',
    message: '',
  });

  const services = [
    {
      id: 'portrait',
      title: 'Portrait Photography',
      description: 'Professional portrait sessions for personal branding, editorial work, and creative projects.',
      price: 'From ₦265,000',
      duration: '2-3 hours',
      deliverables: '20-30 edited images',
      features: [
        'Pre-shoot consultation',
        'Lagos studio or location of your choice',
        'Wardrobe guidance',
        'High-resolution edited images',
        'Online gallery for 90 days',
        'Print release included',
      ],
      image: 'https://images.unsplash.com/photo-1669789758542-8b7746dd0612?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHBob3RvZ3JhcGh5JTIwc2Vzc2lvbnxlbnwxfHx8fDE3NjkzMjg3MTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      icon: Camera,
    },
    {
      id: 'commercial',
      title: 'Commercial Photography',
      description: 'Brand photography for businesses, product shoots, and commercial campaigns.',
      price: 'From ₦500,000',
      duration: 'Half or full day',
      deliverables: '50-100 edited images',
      features: [
        'Creative direction and planning',
        'Professional lighting setup',
        'Multiple locations if needed',
        'Product styling assistance',
        'Fast turnaround (3-5 days)',
        'Commercial usage rights',
      ],
      image: 'https://images.unsplash.com/photo-1660557989690-d09a28f6356e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tZXJjaWFsJTIwcGhvdG9ncmFwaHl8ZW58MXx8fHwxNzY5MzAyNjYyfDA&ixlib=rb-4.1.0&q=80&w=1080',
      icon: Package,
    },
    {
      id: 'event',
      title: 'Event Photography',
      description: 'Coverage for corporate events, exhibitions, launches, and special occasions.',
      price: 'From ₦380,000',
      duration: '3-6 hours',
      deliverables: '100-200 edited images',
      features: [
        'Full event coverage',
        'Candid and posed shots',
        'Multiple photographers available',
        'Quick preview selection',
        '7-day turnaround',
        'Online sharing gallery',
      ],
      image: 'https://images.unsplash.com/photo-1614607653708-0777e6d003b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldmVudCUyMHBob3RvZ3JhcGh5fGVufDF8fHx8MTc2OTMwNzQ2Nnww&ixlib=rb-4.1.0&q=80&w=1080',
      icon: Camera,
    },
    {
      id: 'editorial',
      title: 'Editorial & Fashion',
      description: 'High-end editorial shoots for magazines, lookbooks, and fashion campaigns.',
      price: 'From ₦700,000',
      duration: 'Full day',
      deliverables: '30-50 retouched images',
      features: [
        'Concept development',
        'Team coordination (MUA, stylist)',
        'Location scouting',
        'Professional retouching',
        'Magazine-ready quality',
        'Portfolio usage rights',
      ],
      image: 'https://images.unsplash.com/photo-1704208316515-a32f81e373ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwcGhvdG9ncmFwaHl8ZW58MXx8fHwxNzY5MjcyNDIxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      icon: Image,
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.service) {
      toast.error('Please fill in all required fields');
      return;
    }

    toast.success('Booking request submitted! We will contact you within 24 hours.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      service: '',
      date: '',
      message: '',
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-[#1C1C1E]">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1761426952799-108385c4753d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwaG90b2dyYXBoZXIlMjB3b3JraW5nfGVufDF8fHx8MTc2OTMyODcwOXww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Photography Services"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-['Playfair_Display'] text-5xl md:text-6xl text-white mb-6 leading-tight"
          >
            Photography Services
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-['Inter'] text-lg text-white/90 max-w-2xl mx-auto"
          >
            Professional photography in Lagos and across Nigeria — documentary, portrait, editorial, and commercial work by Hakeem Salaam.
            Let's create something exceptional together.
          </motion.p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white border border-[#8E8E93]/20 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <ImageWithFallback
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              
              <div className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-[#C9A45C]/10 rounded-lg">
                    <service.icon className="h-6 w-6 text-[#C9A45C]" />
                  </div>
                  <div className="text-right">
                    <p className="font-['Playfair_Display'] text-2xl text-[#1C1C1E]">{service.price}</p>
                  </div>
                </div>

                <h3 className="font-['Playfair_Display'] text-3xl text-[#1C1C1E] mb-3">
                  {service.title}
                </h3>
                
                <p className="font-['Inter'] text-[#8E8E93] mb-6">
                  {service.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-[#8E8E93]/20">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-4 w-4 text-[#8E8E93]" />
                      <p className="font-['Inter'] text-xs text-[#8E8E93] uppercase tracking-wide">Duration</p>
                    </div>
                    <p className="font-['Inter'] text-[#1C1C1E]">{service.duration}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Image className="h-4 w-4 text-[#8E8E93]" />
                      <p className="font-['Inter'] text-xs text-[#8E8E93] uppercase tracking-wide">Deliverables</p>
                    </div>
                    <p className="font-['Inter'] text-[#1C1C1E]">{service.deliverables}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-[#C9A45C] mt-0.5 flex-shrink-0" />
                      <p className="font-['Inter'] text-sm text-[#1C1C1E]">{feature}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Booking Form */}
      <section className="bg-[#1C1C1E] text-white py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl mb-4">
              Book a Session
            </h2>
            <p className="font-['Inter'] text-white/80">
              Tell us about your project. We respond within 24 hours and are based in Lagos, Nigeria.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name" className="font-['Inter'] text-white mb-2">
                  Full Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#C9A45C] font-['Inter']"
                />
              </div>
              
              <div>
                <Label htmlFor="email" className="font-['Inter'] text-white mb-2">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#C9A45C] font-['Inter']"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="phone" className="font-['Inter'] text-white mb-2">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+234 800 000 0000"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#C9A45C] font-['Inter']"
                />
              </div>
              
              <div>
                <Label htmlFor="service" className="font-['Inter'] text-white mb-2">
                  Service Type *
                </Label>
                <Select value={formData.service} onValueChange={(value) => setFormData({ ...formData, service: value })}>
                  <SelectTrigger id="service" className="bg-white/10 border-white/20 text-white focus:border-[#C9A45C]">
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="portrait">Portrait Photography</SelectItem>
                    <SelectItem value="commercial">Commercial Photography</SelectItem>
                    <SelectItem value="event">Event Photography</SelectItem>
                    <SelectItem value="editorial">Editorial & Fashion</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="date" className="font-['Inter'] text-white mb-2">
                Preferred Date
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#C9A45C] font-['Inter']"
              />
            </div>

            <div>
              <Label htmlFor="message" className="font-['Inter'] text-white mb-2">
                Project Details
              </Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell us about your project, vision, and any specific requirements..."
                rows={6}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#C9A45C] font-['Inter'] resize-none"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full bg-[#1C1C1E] hover:bg-[#2C2C2E] text-white border-2 border-white font-['Inter'] py-6"
            >
              Submit Booking Request
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
