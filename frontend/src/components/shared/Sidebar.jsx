import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Home, Users, MapPin, Bell, ClipboardList, ShieldCheck, Truck, GraduationCap, BarChart3, AlertTriangle, Users2, FileText, Sun, Moon, LogOut, Menu, X, QrCode, Heart, Star, Building, Shield, Clock, CreditCard, Wallet } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const roleMenus = {
  PARENT: [
    { label: 'Dashboard', icon: Home, path: '/parent/dashboard' },
    { label: 'My Children', icon: Users, path: '/parent/children' },
    { label: 'Live Tracking', icon: MapPin, path: '/parent/tracking' },
    { label: 'Driver Details', icon: Truck, path: '/parent/driver-details' },
    { label: 'Trip History', icon: ClipboardList, path: '/parent/trips' },
    { label: 'Locations', icon: MapPin, path: '/parent/locations' },
    { label: 'Billing', icon: CreditCard, path: '/parent/billing' },
    { label: 'Notifications', icon: Bell, path: '/parent/notifications', badge: true },
    { label: 'Trusted Persons', icon: ShieldCheck, path: '/parent/trusted-persons' },
    { label: 'Emergency Contacts', icon: Heart, path: '/parent/emergency-contacts' },
    { label: 'Complaints', icon: FileText, path: '/parent/complaints' },
  ],
  DRIVER: [
    { label: 'Dashboard', icon: Home, path: '/driver/dashboard' },
    { label: 'Today\'s Trips', icon: ClipboardList, path: '/driver/trips' },
    { label: 'QR Scanner', icon: QrCode, path: '/driver/scanner' },
    { label: 'My Vehicles', icon: Truck, path: '/driver/vehicles' },
    { label: 'Wallet', icon: Wallet, path: '/driver/wallet' },
    { label: 'Availability', icon: Clock, path: '/driver/availability' },
    { label: 'Documents', icon: FileText, path: '/driver/documents' },
    { label: 'Schedule', icon: Star, path: '/driver/schedule' },
  ],
  INSTITUTION: [
    { label: 'Dashboard', icon: Home, path: '/institution/dashboard' },
    { label: 'Students', icon: GraduationCap, path: '/institution/students' },
    { label: 'Active Transport', icon: Truck, path: '/institution/transport' },
    { label: 'Alerts', icon: AlertTriangle, path: '/institution/alerts' },
    { label: 'Reports', icon: BarChart3, path: '/institution/reports' },
  ],
  ADMIN: [
    { label: 'Dashboard', icon: Home, path: '/admin/dashboard' },
    { label: 'Driver Verification', icon: ShieldCheck, path: '/admin/drivers' },
    { label: 'Institutions', icon: Building, path: '/admin/institutions' },
    { label: 'Vehicles', icon: Truck, path: '/admin/vehicles' },
    { label: 'Users', icon: Users2, path: '/admin/users' },
    { label: 'Trips Monitor', icon: MapPin, path: '/admin/trips' },
    { label: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
    { label: 'Complaints', icon: FileText, path: '/admin/complaints' },
    { label: 'Emergency', icon: AlertTriangle, path: '/admin/emergency' },
  ],
};

export default function Sidebar({ collapsed, setCollapsed, mobileMenuOpen, setMobileMenuOpen }) {
  const { user, logout } = useAuth();
  const { isDark, toggle } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const menu = roleMenus[user?.role] || [];

  const roleLabel = {
    PARENT: 'Parent Portal',
    DRIVER: 'Driver Portal',
    INSTITUTION: 'Institution Portal',
    ADMIN: 'Admin Portal',
  }[user?.role];

  const roleColor = {
    PARENT: 'from-primary-500 to-indigo-600',
    DRIVER: 'from-emerald-500 to-teal-600',
    INSTITUTION: 'from-purple-500 to-violet-600',
    ADMIN: 'from-orange-500 to-red-600',
  }[user?.role];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavClick = () => {
    if (window.innerWidth < 768) {
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <motion.aside
        layout
        className={cn(
          "fixed top-0 left-0 h-full z-50 flex flex-col bg-white/95 dark:bg-dark-surface/95 backdrop-blur-xl border-r border-gray-200/50 dark:border-dark-border/50 shadow-2xl md:shadow-none transition-transform duration-300 ease-in-out",
          collapsed ? "md:w-16" : "md:w-64",
          "w-64", // Fixed width on mobile
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className={cn("flex items-center gap-3 p-4 border-b border-gray-100 dark:border-dark-border/50", collapsed ? "md:justify-center" : "")}>
          <div className={cn(`w-8 h-8 rounded-lg bg-gradient-to-br ${roleColor} flex items-center justify-center flex-shrink-0 shadow-sm`)}>
            <Shield className="w-5 h-5 text-slate-900" />
          </div>
          <AnimatePresence>
            {(!collapsed || mobileMenuOpen) && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden whitespace-nowrap"
              >
                <span className="font-display font-bold text-gray-900 dark:text-white text-lg tracking-tighter block leading-tight">
                  Ride<span className="text-accent">Nest</span>
                </span>
                <span className="text-[10px] font-bold text-gray-500 dark:text-dark-muted uppercase tracking-widest">{roleLabel}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Collapse toggle (Desktop only) */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex absolute -right-3 top-5 w-6 h-6 rounded-full bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border shadow-sm items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors z-50 text-gray-500 hover:text-gray-900 dark:text-dark-muted dark:hover:text-white"
        >
          {collapsed ? <Menu className="w-3 h-3" /> : <X className="w-3 h-3" />}
        </button>

        {/* Close toggle (Mobile only) */}
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="md:hidden absolute right-4 top-5 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin mt-2">
          {menu?.map(({ label, icon: Icon, path, badge }) => {
            const isActive = location.pathname === path || location.pathname.startsWith(path + '/');
            return (
              <Link
                key={path}
                to={path}
                onClick={handleNavClick}
                className={cn(
                  "group flex items-center gap-3 px-3 py-2.5 md:py-2 rounded-lg md:rounded-md text-[15px] md:text-sm font-medium transition-all duration-200 relative",
                  isActive 
                    ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-500/10 shadow-sm" 
                    : "text-gray-600 dark:text-dark-muted hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50",
                  collapsed && !mobileMenuOpen && "md:justify-center md:px-2"
                )}
                title={collapsed && !mobileMenuOpen ? label : undefined}
              >
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-primary-600 dark:bg-primary-500 rounded-r-full"
                  />
                )}
                <Icon className={cn("w-5 h-5 flex-shrink-0 transition-colors", isActive ? "text-primary-600 dark:text-primary-400" : "text-gray-500 dark:text-dark-muted group-hover:text-gray-900 dark:group-hover:text-white")} />
                <AnimatePresence>
                  {(!collapsed || mobileMenuOpen) && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="whitespace-nowrap flex-1"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {(!collapsed || mobileMenuOpen) && badge && (
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Profile / Actions */}
        <div className={cn("p-3 border-t border-gray-100 dark:border-dark-border/50 space-y-1", collapsed && !mobileMenuOpen && "md:flex md:flex-col md:items-center")}>
          <button
            onClick={toggle}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 md:py-2 rounded-lg md:rounded-md text-[15px] md:text-sm font-medium w-full text-gray-600 dark:text-dark-muted hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors",
              collapsed && !mobileMenuOpen && "md:justify-center md:px-2"
            )}
            title={collapsed && !mobileMenuOpen ? (isDark ? 'Light mode' : 'Dark mode') : undefined}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            <AnimatePresence>
              {(!collapsed || mobileMenuOpen) && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="whitespace-nowrap"
                >
                  {isDark ? 'Light Mode' : 'Dark Mode'}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 md:py-2 rounded-lg md:rounded-md text-[15px] md:text-sm font-medium w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors",
              collapsed && !mobileMenuOpen && "md:justify-center md:px-2"
            )}
            title={collapsed && !mobileMenuOpen ? 'Logout' : undefined}
          >
            <LogOut className="w-5 h-5" />
            <AnimatePresence>
              {(!collapsed || mobileMenuOpen) && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="whitespace-nowrap"
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>
    </>
  );
}
