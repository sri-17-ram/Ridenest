import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { ChevronRight, ChevronLeft, Shield, Check, Users, Car, Building, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { cn } from '../../lib/utils';

const roles = [
  { value: 'PARENT', label: 'Parent', icon: Users, desc: 'Track your children and manage their transport' },
  { value: 'DRIVER', label: 'Driver', icon: Car, desc: 'Manage trips and transport children safely' },
  { value: 'INSTITUTION', label: 'Institution', icon: Building, desc: 'Manage student transport and get alerts' },
];

const institutionTypes = [
  'SCHOOL', 'TUITION_CENTER', 'COACHING_CENTER', 'DAYCARE', 'SPORTS_ACADEMY', 'MUSIC_CLASS', 'DANCE_CLASS'
];

const formatType = (t) => t.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    role: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    institutionName: '',
    institutionType: 'SCHOOL',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const update = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const roleRedirects = { PARENT: '/parent/dashboard', DRIVER: '/driver/dashboard', INSTITUTION: '/institution/dashboard' };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const data = await register(form);
      toast.success(`Welcome to RideNest, ${data.firstName}! 🎉`);
      navigate(roleRedirects[data.role] || '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const slideVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#09090b] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-primary-500/10 dark:bg-primary-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="w-full max-w-xl z-10 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-6">
            <Link to="/" className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent flex items-center justify-center shadow-lg shadow-primary-500/30 hover:scale-105 transition-transform duration-300">
              <Shield className="w-8 h-8 text-slate-900" />
            </Link>
            <div className="text-left">
              <h1 className="font-display font-extrabold text-2xl tracking-tighter text-secondary dark:text-white leading-tight">
                Ride<span className="text-accent">Nest</span>
              </h1>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Create your account</p>
            </div>
          </div>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-4 max-w-xs mx-auto">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex items-center gap-3">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300",
                  step >= s 
                    ? "bg-primary-600 text-white shadow-md shadow-primary-500/20" 
                    : "bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border/50 text-gray-400 dark:text-gray-500"
                )}>
                  {step > s ? <Check className="w-4 h-4" /> : s}
                </div>
                {s < 3 && (
                  <div className="w-12 h-0.5 rounded-full bg-gray-200 dark:bg-dark-border/50 overflow-hidden">
                    <div 
                      className="h-full bg-primary-600 transition-all duration-500 ease-in-out" 
                      style={{ width: step > s ? '100%' : '0%' }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-4 h-5">
            {['Choose your role', 'Personal Information', 'Additional Details'][step - 1]}
          </p>
        </div>

        <Card className="glass shadow-2xl border-white/50 dark:border-white/10 rounded-3xl overflow-hidden">
          <CardContent className="p-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="p-6 md:p-8"
              >
                {/* Step 1: Role selection */}
                {step === 1 && (
                  <div className="space-y-4">
                    {roles?.map(r => (
                      <button
                        key={r.value}
                        onClick={() => setForm(f => ({ ...f, role: r.value }))}
                        className={cn(
                          "w-full flex items-start gap-4 p-5 rounded-xl border transition-all text-left relative overflow-hidden group",
                          form.role === r.value
                            ? "border-primary-500 bg-primary-50 dark:bg-primary-500/10 shadow-sm"
                            : "border-gray-200 dark:border-dark-border/50 hover:border-primary-200 dark:hover:border-primary-900 bg-white/50 dark:bg-[#09090b]/50"
                        )}
                      >
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                          form.role === r.value ? "bg-primary-600 text-white" : "bg-gray-100 dark:bg-dark-surface text-gray-500 group-hover:text-primary-600 dark:group-hover:text-primary-400"
                        )}>
                          <r.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className={cn("font-semibold", form.role === r.value ? "text-primary-700 dark:text-primary-300" : "text-gray-900 dark:text-white")}>{r.label}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{r.desc}</p>
                        </div>
                        {form.role === r.value && (
                          <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            <Check className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                          </div>
                        )}
                      </button>
                    ))}
                    <div className="pt-4">
                      <Button
                        onClick={() => form.role && setStep(2)}
                        disabled={!form.role}
                        className="w-full h-11 text-base"
                      >
                        Continue <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 2: Personal info */}
                {step === 2 && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>First Name</Label>
                        <Input value={form.firstName} onChange={update('firstName')} placeholder="Arjun" className="h-11" required />
                      </div>
                      <div className="space-y-2">
                        <Label>Last Name</Label>
                        <Input value={form.lastName} onChange={update('lastName')} placeholder="Sharma" className="h-11" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Email Address</Label>
                      <Input type="email" value={form.email} onChange={update('email')} placeholder="arjun@example.com" className="h-11" required />
                    </div>
                    <div className="space-y-2">
                      <Label>Password</Label>
                      <Input type="password" value={form.password} onChange={update('password')} placeholder="Min 8 characters" className="h-11" required />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <Input value={form.phoneNumber} onChange={update('phoneNumber')} placeholder="9876543210" pattern="[6-9]\d{9}" className="h-11" required />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button variant="outline" onClick={() => setStep(1)} className="flex-1 h-11">
                        <ChevronLeft className="w-4 h-4 mr-2" /> Back
                      </Button>
                      <Button
                        onClick={() => form.firstName && form.email && form.password && setStep(3)}
                        disabled={!form.firstName || !form.email || !form.password}
                        className="flex-1 h-11"
                      >
                        Continue <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 3: Additional details */}
                {step === 3 && (
                  <div className="space-y-5">
                    {form.role === 'INSTITUTION' && (
                      <>
                        <div className="space-y-2">
                          <Label>Institution Name</Label>
                          <Input value={form.institutionName} onChange={update('institutionName')} placeholder="St. Mary's School" className="h-11" required />
                        </div>
                        <div className="space-y-2">
                          <Label>Institution Type</Label>
                          <select 
                            className="flex h-11 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:border-dark-border/50 dark:bg-dark-surface dark:text-dark-text" 
                            value={form.institutionType} 
                            onChange={update('institutionType')}
                          >
                            {institutionTypes?.map(t => (
                              <option key={t} value={t}>{formatType(t)}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label>Registration Number</Label>
                          <Input value={form.registrationNumber} onChange={update('registrationNumber')} placeholder="REG123456" className="h-11" required />
                        </div>
                      </>
                    )}

                    <div className="space-y-2">
                      <Label>Address</Label>
                      <Input value={form.address} onChange={update('address')} placeholder="123 MG Road" className="h-11" required />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-2">
                        <Label>City</Label>
                        <Input value={form.city} onChange={update('city')} placeholder="Bangalore" className="h-11" required />
                      </div>
                      <div className="space-y-2">
                        <Label>State</Label>
                        <Input value={form.state} onChange={update('state')} placeholder="Karnataka" className="h-11" required />
                      </div>
                      <div className="space-y-2">
                        <Label>Pincode</Label>
                        <Input value={form.pincode} onChange={update('pincode')} placeholder="560001" className="h-11" required />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button variant="outline" onClick={() => setStep(2)} className="flex-1 h-11">
                        <ChevronLeft className="w-4 h-4 mr-2" /> Back
                      </Button>
                      <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex-1 h-11 shadow-glow-blue"
                      >
                        {loading ? (
                          <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...</>
                        ) : (
                          'Complete Setup'
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-gray-100 dark:border-dark-border/50 p-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
