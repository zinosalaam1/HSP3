import { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface LoginPageProps {
  onNavigate: (page: string) => void;
  onLoginSuccess: () => void;
}

export function LoginPage({ onNavigate, onLoginSuccess }: LoginPageProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await login(email, password);

    if (error) {
      setError(error);
      toast.error('Login failed. Please check your credentials.');
    } else {
      toast.success('Welcome back!');
      onLoginSuccess();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1C1C1E] items-center justify-center p-12">
        <div className="text-center">
          <h1 className="font-['Playfair_Display'] text-5xl text-white mb-6">HSP</h1>
          <p className="font-['Inter'] text-white/60 text-lg">
            Fine art photography for modern spaces
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-8">
            <button
              onClick={() => onNavigate('home')}
              className="font-['Inter'] text-sm text-[#8E8E93] hover:text-[#1C1C1E] mb-6 flex items-center gap-1"
            >
              ← Back to store
            </button>
            <h2 className="font-['Playfair_Display'] text-3xl text-[#1C1C1E] mb-2">Welcome back</h2>
            <p className="font-['Inter'] text-[#8E8E93] text-sm">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="email" className="font-['Inter']">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="font-['Inter'] mt-1"
              />
            </div>

            <div>
              <Label htmlFor="password" className="font-['Inter']">Password</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="font-['Inter'] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E8E93]"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 font-['Inter']">{error}</p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C9A45C] hover:bg-[#B89350] text-white font-['Inter']"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="font-['Inter'] text-sm text-[#8E8E93]">
              Don't have an account?{' '}
              <button
                onClick={() => onNavigate('register')}
                className="text-[#C9A45C] hover:underline font-medium"
              >
                Sign up
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
