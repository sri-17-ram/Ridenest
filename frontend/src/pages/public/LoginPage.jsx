import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Sun, Moon, Shield, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardFooter } from '../../components/ui/card';

const roleRedirects = {
  PARENT: '/parent/dashboard',
  DRIVER: '/driver/dashboard',
  INSTITUTION: '/institution/dashboard',
  ADMIN: '/admin/dashboard',
};

export default function LoginPage() {
  const { login } = useAuth();
  const { isDark, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(email, password);
      toast.success(`Welcome back, ${data.firstName}! 👋`);
      navigate(from || roleRedirects[data.role] || '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Quick login shortcuts for demo
  const demoLogins = [
    { role: 'Parent', email: 'parent@demo.com', icon: '👨‍👩‍👧', password: 'Demo@1234' },
    { role: 'Driver', email: 'driver@demo.com', icon: '🚗', password: 'Demo@1234' },
    { role: 'Institution', email: 'school@demo.com', icon: '🏫', password: 'Demo@1234' },
    { role: 'Admin', email: 'sriapral@gmail.com', icon: '🛡️', password: 'sriapral1726' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 dark:bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration - Startup Style */}
      <div className="absolute inset-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary-500 opacity-20 blur-[100px]"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 dark:bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-500/20 dark:bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="w-full max-w-[420px] z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <Link to="/" className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent flex items-center justify-center shadow-lg shadow-primary-500/30 mb-6 hover:scale-105 transition-transform duration-300">
            <Shield className="w-8 h-8 text-slate-900" />
          </Link>
          <h1 className="text-4xl font-display font-extrabold tracking-tight text-slate-900 mb-1">
            Ride<span className="text-accent">Nest</span>
          </h1>
          <p className="text-sm font-medium text-slate-400 mt-2">Secure access for parents and drivers</p>
        </div>

        <Card className="bg-white/10 dark:bg-[#09090b]/40 backdrop-blur-2xl shadow-2xl border-white/20 dark:border-white/10 rounded-3xl overflow-hidden">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-900">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="bg-white/60 dark:bg-[#09090b]/60 backdrop-blur-md h-12 text-slate-900 border-white/20 focus:border-primary-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-slate-900">Password</Label>
                  <Link to="#" className="text-xs font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="bg-white/60 dark:bg-[#09090b]/60 backdrop-blur-md h-12 pr-10 text-slate-900 border-white/20 focus:border-primary-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-gray-600 dark:hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 mt-2 text-base shadow-glow-blue"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-8 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-transparent px-2 text-slate-400 font-medium backdrop-blur-sm">Quick Demo Access</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              {demoLogins?.map(d => (
                <button
                  key={d.role}
                  onClick={() => { setEmail(d.email); setPassword(d.password); }}
                  className="flex items-center gap-2 p-2.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 transition-colors text-xs font-medium text-slate-900 shadow-sm backdrop-blur-md"
                >
                  <span className="text-base">{d.icon}</span>
                  {d.role}
                </button>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col border-t border-white/10 p-6 bg-black/20">
            <p className="text-center text-sm text-slate-300">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                Register here
              </Link>
            </p>
          </CardFooter>
        </Card>

        <div className="flex justify-center mt-8">
          <button onClick={toggle} className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-slate-900 transition-colors bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
            {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            {isDark ? 'Light mode' : 'Dark mode'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
