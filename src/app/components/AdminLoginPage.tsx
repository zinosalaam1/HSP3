import { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff, Shield, AlertCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';

export function AdminLoginPage() {
  const { adminLogin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await adminLogin(email, password);

    if (error) {
      setError(error);
      setLoading(false);
    } else {
      toast.success('Welcome to the admin panel');
      navigate('/admin', { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-[#1C1C1E] flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#C9A45C]/10 border border-[#C9A45C]/30 mb-5">
            <Shield className="h-6 w-6 text-[#C9A45C]" />
          </div>
          <h1 className="font-['Playfair_Display'] text-3xl text-white mb-2">Admin Access</h1>
          <p className="font-['Inter'] text-sm text-white/50">HSP Photography — Restricted area</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="email" className="font-['Inter'] text-white/70 text-sm">Email address</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@yourdomain.com"
                className="font-['Inter'] mt-1.5 bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-[#C9A45C] focus:ring-[#C9A45C]"
              />
            </div>

            <div>
              <Label htmlFor="password" className="font-['Inter'] text-white/70 text-sm">Password</Label>
              <div className="relative mt-1.5">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="font-['Inter'] bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-[#C9A45C] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2.5">
                <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="font-['Inter'] text-sm text-red-400">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C9A45C] hover:bg-[#B89350] text-white font-['Inter'] h-11 mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying…
                </span>
              ) : (
                'Sign in to Admin'
              )}
            </Button>
          </form>
        </div>

        {/* Back to store */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="font-['Inter'] text-sm text-white/30 hover:text-white/60 transition-colors"
          >
            ← Back to store
          </Link>
        </div>

        {/* Security note */}
        <p className="text-center font-['Inter'] text-xs text-white/20 mt-4">
          Only accounts with admin privileges can access this area.
          <br />Unauthorised access attempts are logged.
        </p>
      </motion.div>
    </div>
  );
}
