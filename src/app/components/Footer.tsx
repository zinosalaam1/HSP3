import { Instagram, Facebook, Twitter, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/app/components/ui/button';
import { useAuth } from '@/context/AuthContext';

interface FooterProps {
  onNavigate?: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const { isAdmin } = useAuth();

  const shopLinks = [
    { label: 'Prints', to: '/shop' },
    { label: 'Presets', to: '/shop' },
    { label: 'Services', to: '/services' },
    { label: 'Frames', to: '/shop' },
  ];

  const companyLinks = [
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/about' },
  ];

  const linkClass = 'text-[#8E8E93] hover:text-[#FAFAF9] transition-colors font-[\'Inter\'] text-sm';

  return (
    <footer className="bg-[#1C1C1E] text-[#FAFAF9] mt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Brand */}
          <div>
            <Link to="/" className="font-['Playfair_Display'] text-3xl mb-4 block hover:opacity-80 transition-opacity">HSP</Link>
            <p className="text-[#8E8E93] font-['Inter'] text-sm leading-relaxed">
              Fine art prints and photography services by Hakeem Salaam, based in Lagos, Nigeria.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-['Inter'] font-medium mb-4">Shop</h4>
            <ul className="space-y-3">
              {shopLinks.map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className={linkClass}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-['Inter'] font-medium mb-4">Company</h4>
            <ul className="space-y-3">
              {companyLinks.map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className={linkClass}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-['Inter'] font-medium mb-4">Stay Connected</h4>
            <p className="text-[#8E8E93] font-['Inter'] text-sm mb-4">
              Subscribe for new releases and exclusive content.
            </p>
            <div className="flex gap-3 mb-6">
              <a href="https://www.instagram.com/hspimages/" target="_blank" rel="noopener noreferrer" className="text-[#8E8E93] hover:text-[#FAFAF9] transition-colors p-2"><Instagram className="h-5 w-5" /></a>
              <Button variant="ghost" size="icon" className="text-[#8E8E93] hover:text-[#FAFAF9]"><Facebook className="h-5 w-5" /></Button>
              <Button variant="ghost" size="icon" className="text-[#8E8E93] hover:text-[#FAFAF9]"><Twitter className="h-5 w-5" /></Button>
              <Button variant="ghost" size="icon" className="text-[#8E8E93] hover:text-[#FAFAF9]"><Mail className="h-5 w-5" /></Button>
            </div>
          </div>
        </div>

        <div className="border-t border-[#8E8E93]/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[#8E8E93] font-['Inter'] text-sm">
              © 2026 HSP Images. All rights reserved.
            </p>
            <div className="flex gap-6">
              <button className="text-[#8E8E93] hover:text-[#FAFAF9] transition-colors font-['Inter'] text-sm">Privacy Policy</button>
              <button className="text-[#8E8E93] hover:text-[#FAFAF9] transition-colors font-['Inter'] text-sm">Terms of Service</button>
              {isAdmin && (
                <Link to="/admin" className={linkClass}>Admin</Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
