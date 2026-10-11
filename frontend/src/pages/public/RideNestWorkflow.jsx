import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Smartphone, QrCode, Bus, CheckCircle2, ShieldCheck, Map, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';

const steps = [
  {
    id: 1,
    title: "1. Parent Registration & Profile Creation",
    description: "Parents sign up, add their children's details, and set up safe pickup/drop-off zones.",
    icon: Smartphone,
    color: "from-blue-500 to-indigo-600",
    image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=600",
    alignment: "left"
  },
  {
    id: 2,
    title: "2. Unique Digital QR Pass",
    description: "The system generates a unique, secure QR code token for each child. This QR is stored securely and linked to the child's profile.",
    icon: QrCode,
    color: "from-emerald-500 to-teal-600",
    image: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&q=80&w=600",
    alignment: "right"
  },
  {
    id: 3,
    title: "3. Driver Verification & Boarding",
    description: "During pickup, the verified driver uses the RideNest Driver App to scan the child's QR code. Boarding is authenticated instantly.",
    icon: ShieldCheck,
    color: "from-purple-500 to-violet-600",
    image: "https://images.unsplash.com/photo-1516222338250-863216ce01ea?auto=format&fit=crop&q=80&w=600",
    alignment: "left"
  },
  {
    id: 4,
    title: "4. Live Telemetry & Tracking",
    description: "Parents receive a push notification the moment the child boards. They can track the vehicle's exact GPS location in real-time.",
    icon: Map,
    color: "from-orange-500 to-red-600",
    image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=600",
    alignment: "right"
  },
  {
    id: 5,
    title: "5. Safe Arrival & Confirmation",
    description: "Upon reaching the school or home, the driver scans the QR again. A 'Safe Arrival' confirmation is dispatched to parents and the school.",
    icon: CheckCircle2,
    color: "from-primary-500 to-blue-600",
    image: "https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&q=80&w=600",
    alignment: "left"
  }
];

export default function RideNestWorkflow() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  return (
    <div className="min-h-screen bg-[#09090b] selection:bg-primary-500/30 selection:text-white flex flex-col font-sans overflow-x-hidden">
      {/* Simple Header */}
      <nav className="fixed top-0 w-full z-50 bg-[#09090b]/80 backdrop-blur-xl border-b border-dark-border/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center shadow-glow-blue">
              <ShieldCheck className="w-5 h-5 text-slate-900" />
            </div>
            <span className="font-display font-bold text-slate-900 text-xl tracking-tighter block leading-tight">
              Ride<span className="text-primary-400">Nest</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="font-semibold text-slate-300">Login</Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="rounded-full px-6 font-semibold shadow-glow-blue">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>
      
      <main className="flex-grow pt-32 pb-20">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto px-4 mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-display font-bold tracking-tight text-slate-900 mb-6"
          >
            How <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-indigo-400">RideNest</span> Works
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-slate-500 leading-relaxed"
          >
            Experience the complete journey of our secure transportation ecosystem, designed for ultimate safety and transparency.
          </motion.p>
        </div>

        {/* Workflow Timeline */}
        <div ref={containerRef} className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Center line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-gray-800 -translate-x-1/2 hidden md:block" />
          
          <motion.div 
            className="absolute left-4 md:left-1/2 top-0 w-1 bg-gradient-to-b from-primary-500 via-indigo-500 to-emerald-500 -translate-x-1/2 hidden md:block origin-top"
            style={{ scaleY: scrollYProgress }}
          />

          <div className="space-y-24 md:space-y-40">
            {steps?.map((step, index) => (
              <motion.div 
                key={step.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className={`relative flex flex-col md:flex-row items-center gap-8 md:gap-16 ${step.alignment === 'right' ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Timeline node */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-[#09090b] border-4 border-gray-800 items-center justify-center z-10 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                  <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${step.color}`} />
                </div>

                {/* Content */}
                <div className={`w-full md:w-1/2 ${step.alignment === 'left' ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'}`}>
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br ${step.color} mb-6 shadow-lg`}>
                    <step.icon className="w-6 h-6 text-slate-900" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-4">{step.title}</h3>
                  <p className="text-slate-500 text-lg leading-relaxed">{step.description}</p>
                </div>

                {/* Visual/Image */}
                <div className="w-full md:w-1/2 px-4 md:px-0">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-gray-800/50"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-[#09090b]/80 to-transparent z-10" />
                    <img src={step.image} alt={step.title} className="absolute inset-0 w-full h-full object-cover" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center max-w-2xl mx-auto mt-40 px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-10 rounded-3xl bg-gradient-to-b from-gray-900 to-[#09090b] border border-gray-800 shadow-2xl"
          >
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-4">Ready to experience RideNest?</h2>
            <p className="text-slate-500 mb-8 text-lg">Join thousands of parents and schools trusting us for secure daily commutes.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register">
                <Button className="w-full sm:w-auto h-14 px-8 text-lg bg-white text-[#09090b] hover:bg-gray-100 rounded-full shadow-glow-white">
                  Get Started Now <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="border-t border-dark-border/50 py-12 px-6 bg-[#09090b]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-primary-500" />
            <span className="font-display font-bold text-slate-900 text-xl tracking-tight">RideNest</span>
          </div>
          <p className="text-sm text-slate-400">© {new Date().getFullYear()} RideNest. Ensuring Every Child Reaches Their Destination Safely.</p>
        </div>
      </footer>
    </div>
  );
}
