import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Shield, QrCode, MapPin, AlertTriangle, Users, Building, Car, MoveRight, CheckCircle, Smartphone, Phone, Key, Lock, PlayCircle, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { cn } from '../../lib/utils';

const features = [
  { icon: QrCode, title: 'QR Pickup Verification', desc: 'Each child gets a unique QR code. Driver scans it for verified pickup. Parents get instant notification.', color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { icon: MapPin, title: 'Live GPS Tracking', desc: 'Track your child\'s vehicle in real-time on an interactive map with ETA and route visibility.', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { icon: AlertTriangle, title: 'Accident Detection', desc: 'Smartphone accelerometer detects impacts. Auto-alerts if driver doesn\'t confirm safety.', color: 'text-red-500', bg: 'bg-red-500/10' },
  { icon: Users, title: 'Trusted Pickup Persons', desc: 'Pre-authorize grandparents or relatives. System verifies their identity via OTP.', color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { icon: Car, title: 'Smart Contingency', desc: 'If a driver is unavailable, admin automatically assigns a verified backup driver without delay.', color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { icon: Building, title: 'Multi-Institution', desc: 'Schools, Tuition Centers, Coaching, Daycare, Sports Academies, Music & Dance classes.', color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
];

const securityWorkflows = [];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 15 } }
};

export default function LandingPage() {
  const { isDark, toggle } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = ["Home", "Features", "How It Works", "Security", "Pricing", "About", "Contact"];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#09090b] selection:bg-primary-500/30 font-sans overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-xl border-b border-gray-200 dark:border-dark-border/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center shadow-glow-blue">
              <Shield className="w-5 h-5 text-slate-900" />
            </div>
            <span className="font-display font-bold text-gray-900 dark:text-white text-xl tracking-tighter block leading-tight">
              Ride<span className="text-accent">Nest</span>
            </span>
          </div>
          
          <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-400">
            {navLinks?.map(link => (
              <a key={link} href={`#${link.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                {link}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <button onClick={toggle} className="p-2 rounded-full bg-gray-100 dark:bg-dark-surface hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-slate-600 dark:text-slate-400">
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Link to="/login">
              <Button variant="ghost" size="sm" className="font-semibold text-slate-700 dark:text-slate-300">Login</Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="rounded-full px-6 font-semibold shadow-glow-blue">Get Started</Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center gap-4">
            <button onClick={toggle} className="p-2 rounded-full bg-gray-100 dark:bg-dark-surface text-slate-600 dark:text-slate-400">
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-900 dark:text-white">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden bg-white dark:bg-[#09090b] border-b border-gray-200 dark:border-dark-border/50 overflow-hidden"
            >
              <div className="px-6 py-4 flex flex-col gap-4">
                {navLinks?.map(link => (
                  <a key={link} href={`#${link.toLowerCase().replace(/\s+/g, '-')}`} onClick={() => setMobileMenuOpen(false)} className="text-base font-medium text-slate-700 dark:text-slate-300">
                    {link}
                  </a>
                ))}
                <div className="h-px bg-gray-100 dark:bg-dark-border/50 my-2" />
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-center">Login</Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full justify-center">Register</Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-40 pb-24 px-6 relative overflow-hidden flex items-center min-h-[90vh]">
        {/* Abstract background shapes */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-r from-primary-500/20 to-accent/20 dark:from-primary-500/10 dark:to-accent/10 blur-[120px] rounded-full pointer-events-none -z-10" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-500/10 dark:bg-blue-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />
        
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <motion.div 
            className="text-center max-w-5xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <Badge variant="secondary" className="mb-8 py-2 px-5 text-sm rounded-full border border-primary-200 dark:border-primary-900/50 bg-white/60 dark:bg-dark-surface/60 backdrop-blur-md text-primary-700 dark:text-primary-300 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse mr-2 inline-block"></span>
                Smart School Transportation Platform
              </Badge>
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl lg:text-8xl font-display font-extrabold text-slate-900 dark:text-white leading-[1.05] tracking-tight mb-8">
              Ensuring Every Child Reaches Their <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent dark:from-primary-400 dark:to-accent">
                Destination Safely.
              </span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              The modern, end-to-end transportation ecosystem connecting parents, drivers, and institutions through real-time GPS tracking and QR-verified handoffs.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/register">
                <Button size="lg" className="rounded-full px-8 h-14 text-lg shadow-glow-blue w-full sm:w-auto font-semibold">
                  Get Started <MoveRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="rounded-full px-8 h-14 text-lg w-full sm:w-auto bg-white/70 dark:bg-dark-surface/70 backdrop-blur-md border-gray-200 dark:border-dark-border/50 text-slate-900 dark:text-white font-semibold hover:bg-gray-50 dark:hover:bg-dark-border">
                  Login
                </Button>
              </Link>
              <Link to="/workflow">
                <Button variant="ghost" size="lg" className="rounded-full px-6 h-14 text-lg w-full sm:w-auto text-slate-700 dark:text-slate-300 font-semibold hover:bg-gray-100 dark:hover:bg-dark-surface border border-transparent hover:border-gray-200 dark:hover:border-dark-border/50">
                  <PlayCircle className="mr-2 w-5 h-5 text-primary-500" /> Watch Workflow Demo
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Account Security & Recovery Section */}
      <section id="security" className="py-24 px-6 relative bg-white dark:bg-[#09090b] overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-blue-500/10 to-transparent blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-purple-500/10 to-transparent blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <Badge className="bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 border-0 hover:bg-primary-200 mb-6 py-1.5 px-4 shadow-sm text-sm">Enterprise-Grade Protection</Badge>
            <h2 className="text-4xl md:text-5xl font-display font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
              Account Security & Recovery
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Your family's information is protected using enterprise-grade security mechanisms. We ensure that only authorized individuals have access.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Card 1: New Device Login */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-white/60 dark:bg-dark-surface/60 backdrop-blur-xl border border-gray-200 dark:border-dark-border/50 rounded-3xl p-8 shadow-xl shadow-gray-200/20 dark:shadow-none"
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30">
                <Shield className="w-7 h-7 text-slate-900" />
              </div>
              <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-4">New Device Login</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Whenever a Parent or Driver logs in from a new device, the system automatically sends a One-Time Password (OTP) to the registered mobile number or email before granting access.
              </p>
            </motion.div>

            {/* Card 2: Lost Phone / SIM */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white/60 dark:bg-dark-surface/60 backdrop-blur-xl border border-gray-200 dark:border-dark-border/50 rounded-3xl p-8 shadow-xl shadow-gray-200/20 dark:shadow-none"
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br from-orange-500 to-red-600 shadow-lg shadow-orange-500/30">
                <Phone className="w-7 h-7 text-slate-900" />
              </div>
              <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-4">Lost Phone / SIM</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                If users lose access to their mobile device or SIM card, they can still recover their account using trusted recovery options such as backup codes, trusted devices, or another verified mobile number.
              </p>
            </motion.div>

            {/* Card 3: Secure Identity Recovery (SIR) */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -5 }}
              className="bg-white/60 dark:bg-dark-surface/60 backdrop-blur-xl border border-gray-200 dark:border-dark-border/50 rounded-3xl p-8 shadow-xl shadow-gray-200/20 dark:shadow-none md:col-span-2 lg:col-span-1"
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg shadow-purple-500/30">
                <Users className="w-7 h-7 text-slate-900" />
              </div>
              <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-4">Secure Identity Recovery (SIR)</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                If all recovery methods fail, users can submit a Secure Identity Recovery request. The request is reviewed and verified by the RideNest Administrator before account restoration.
              </p>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gray-50/50 dark:bg-[#09090b]/50 p-4 rounded-2xl border border-gray-100 dark:border-dark-border">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 flex items-center justify-center text-xs font-bold">1</div>
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Request</span>
                </div>
                <MoveRight className="w-4 h-4 text-slate-500 hidden sm:block" />
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center text-xs font-bold">2</div>
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Verify</span>
                </div>
                <MoveRight className="w-4 h-4 text-slate-500 hidden sm:block" />
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 flex items-center justify-center text-xs font-bold">3</div>
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Approve</span>
                </div>
                <MoveRight className="w-4 h-4 text-slate-500 hidden sm:block" />
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 flex items-center justify-center text-xs font-bold">4</div>
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Restore</span>
                </div>
              </div>
            </motion.div>

            {/* Card 4: End-to-End Security */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -5 }}
              className="bg-white/60 dark:bg-dark-surface/60 backdrop-blur-xl border border-gray-200 dark:border-dark-border/50 rounded-3xl p-8 shadow-xl shadow-gray-200/20 dark:shadow-none md:col-span-2 lg:col-span-1"
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br from-emerald-400 to-teal-600 shadow-lg shadow-emerald-500/30">
                <Lock className="w-7 h-7 text-slate-900" />
              </div>
              <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-6">End-to-End Security</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-2">
                {[
                  "JWT Authentication",
                  "BCrypt Password Encryption",
                  "OTP Verification",
                  "Role-Based Access Control",
                  "Secure Identity Recovery",
                  "Protected APIs"
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center shrink-0">
                      <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 bg-white dark:bg-[#09090b]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
              Features Built for Peace of Mind
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features?.map((f, i) => (
              <motion.div 
                key={f.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-8 rounded-3xl bg-slate-50 dark:bg-dark-surface/50 border border-slate-200 dark:border-dark-border/50 hover:bg-white dark:hover:bg-dark-surface transition-all shadow-sm hover:shadow-xl hover:-translate-y-1"
              >
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6", f.bg, f.color)}>
                  <f.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-3">{f.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-dark-border/50 py-12 px-6 bg-white dark:bg-[#09090b]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary-600 dark:text-primary-500" />
            <span className="font-display font-bold text-slate-900 dark:text-white text-xl tracking-tight">
              RideNest
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} RideNest. Ensuring Every Child Reaches Their Destination Safely.
          </p>
        </div>
      </footer>
    </div>
  );
}

