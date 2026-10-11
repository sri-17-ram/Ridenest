import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { motion } from 'framer-motion';
import { Menu, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';

export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const roleColor = {
    PARENT: 'from-primary-500 to-indigo-600',
    DRIVER: 'from-emerald-500 to-teal-600',
    INSTITUTION: 'from-purple-500 to-violet-600',
    ADMIN: 'from-orange-500 to-red-600',
  }[user?.role] || 'from-primary-500 to-blue-600';

  return (
    <div className="flex h-screen bg-gray-50/50 dark:bg-dark-bg text-gray-900 dark:text-dark-text overflow-hidden selection:bg-primary-500/30">
      <Sidebar 
        collapsed={collapsed} 
        setCollapsed={setCollapsed} 
        mobileMenuOpen={mobileMenuOpen} 
        setMobileMenuOpen={setMobileMenuOpen} 
      />
      
      <main
        className={cn(
          "flex-1 flex flex-col h-screen overflow-hidden transition-all duration-300 ease-in-out w-full",
          collapsed ? "md:ml-16" : "md:ml-64"
        )}
      >
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white/80 dark:bg-dark-surface/80 backdrop-blur-md border-b border-gray-200/50 dark:border-dark-border/50 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div className={cn(`w-8 h-8 rounded-lg bg-gradient-to-br ${roleColor} flex items-center justify-center flex-shrink-0 shadow-sm`)}>
              <Shield className="w-5 h-5 text-slate-900" />
            </div>
            <span className="font-display font-bold text-gray-900 dark:text-white text-lg tracking-tighter block leading-tight">
              Ride<span className="text-accent">Nest</span>
            </span>
          </div>
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"
          >
            <Menu className="w-5 h-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto w-full">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto min-h-full"
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
