import { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface RegisterPageProps {
  onNavigate: (page: string) => void;
}

export function RegisterPage({ onNavigate }: RegisterPageProps) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) { setError("Passwords don't match"); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);

    const { error } = await register(email, password, name);
    if (error) {
      setError(error);
    } else {
      setSuccess(true);
      toast.success('Account created! Check your email to confirm.');
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-6">✉️</div>
          <h2 className="font-['Playfair_Display'] text-3xl text-[#1C1C1E] mb-4">Check your email</h2>
          <p className="font-['Inter'] text-[#8E8E93] mb-8">
            We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.
          </p>
          <Button onClick={() => onNavigate('login')} className="bg-[#C9A45C] hover:bg-[#B89350] text-white font-['Inter']">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-[#1C1C1E] items-center justify-center p-12">
        <div className="text-center">
          <h1 className="font-['Playfair_Display'] text-5xl text-white mb-6">HSP</h1>
          <p className="font-['Inter'] text-white/60 text-lg">Fine art photography for modern spaces</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="mb-8">
            <button onClick={() => onNavigate('home')} className="font-['Inter'] text-sm text-[#8E8E93] hover:text-[#1C1C1E] mb-6 flex items-center gap-1">
              ← Back to store
            </button>
            <h2 className="font-['Playfair_Display'] text-3xl text-[#1C1C1E] mb-2">Create account</h2>
            <p className="font-['Inter'] text-[#8E8E93] text-sm">Join HSP to start collecting</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="name" className="font-['Inter']">Full Name</Label>
              <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" className="font-['Inter'] mt-1" />
            </div>
            <div>
              <Label htmlFor="email" className="font-['Inter']">Email</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="font-['Inter'] mt-1" />
            </div>
            <div>
              <Label htmlFor="password" className="font-['Inter']">Password</Label>
              <div className="relative mt-1">
                <Input id="password" type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 characters" className="font-['Inter'] pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E8E93]">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <Label htmlFor="confirm" className="font-['Inter']">Confirm Password</Label>
              <Input id="confirm" type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repeat password" className="font-['Inter'] mt-1" />
            </div>
            {error && <p className="text-sm text-red-600 font-['Inter']">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full bg-[#C9A45C] hover:bg-[#B89350] text-white font-['Inter']">
              {loading ? 'Creating account…' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="font-['Inter'] text-sm text-[#8E8E93]">
              Already have an account?{' '}
              <button onClick={() => onNavigate('login')} className="text-[#C9A45C] hover:underline font-medium">
                Sign in
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
