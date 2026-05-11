import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Menu, X, Search, LogOut, UserCircle, Shield } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/app/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/app/components/ui/dropdown-menu';
import { toast } from 'sonner';

// Keep onNavigate prop for legacy callers but prefer useNavigate internally
interface NavbarProps {
  onNavigate?: (page: string) => void;
  currentPage?: string;
}

export function Navbar({ onNavigate }: NavbarProps) {
  const { getTotalItems } = useCart();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const go = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Services', path: '/services' },
    { name: 'About', path: '/about' },
  ];

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `font-['Inter'] text-sm tracking-wide transition-colors ${
      isActive ? 'text-[#1C1C1E]' : 'text-[#8E8E93] hover:text-[#1C1C1E]'
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-[#FAFAF9]/95 backdrop-blur-md border-b border-[#1C1C1E]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to="/" className="font-['Playfair_Display'] text-2xl tracking-tight text-[#1C1C1E] hover:opacity-70 transition-opacity">
            HSP
          </NavLink>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink key={link.path} to={link.path} end={link.path === '/'} className={linkClass}>
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="hidden md:flex text-[#1C1C1E]">
              <Search className="h-5 w-5" />
            </Button>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-[#1C1C1E]">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 font-['Inter']">
                  <div className="px-2 py-2 border-b border-[#8E8E93]/20">
                    <p className="text-sm font-medium text-[#1C1C1E]">{user?.name}</p>
                    <p className="text-xs text-[#8E8E93]">{user?.email}</p>
                  </div>
                  {isAdmin && (
                    <>
                      <DropdownMenuItem onClick={() => go('/admin')} className="gap-2 cursor-pointer">
                        <Shield className="h-4 w-4" />Admin Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem onClick={() => go('/account')} className="gap-2 cursor-pointer">
                    <UserCircle className="h-4 w-4" />My Account
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="gap-2 cursor-pointer text-red-600">
                    <LogOut className="h-4 w-4" />Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => go('/login')} className="text-[#1C1C1E]">
                <User className="h-5 w-5" />
              </Button>
            )}

            <Button variant="ghost" size="icon" onClick={() => go('/cart')} className="relative text-[#1C1C1E]">
              <ShoppingBag className="h-5 w-5" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C9A45C] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-['Inter']">
                  {getTotalItems()}
                </span>
              )}
            </Button>

            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-[#1C1C1E]">
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#1C1C1E]/10">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block w-full text-left py-3 font-['Inter'] text-sm tracking-wide transition-colors ${
                    isActive ? 'text-[#1C1C1E]' : 'text-[#8E8E93] hover:text-[#1C1C1E]'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            {isAuthenticated && (
              <div className="border-t border-[#1C1C1E]/10 my-2 pt-2">
                {isAdmin && (
                  <button onClick={() => go('/admin')} className="block w-full text-left py-3 font-['Inter'] text-sm text-[#8E8E93] hover:text-[#1C1C1E]">
                    Admin Dashboard
                  </button>
                )}
                <button onClick={() => go('/account')} className="block w-full text-left py-3 font-['Inter'] text-sm text-[#8E8E93] hover:text-[#1C1C1E]">
                  My Account
                </button>
                <button onClick={handleLogout} className="block w-full text-left py-3 font-['Inter'] text-sm text-red-600 hover:text-red-700">
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
