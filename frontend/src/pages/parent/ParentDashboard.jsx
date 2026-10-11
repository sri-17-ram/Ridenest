import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/shared/DashboardLayout';
import StatCard from '../../components/shared/StatCard';
import { useAuth } from '../../context/AuthContext';
import {
  Users, MapPin, Bell, ShieldCheck,
  Clock, AlertTriangle, CheckCircle, Heart,
  Bus, Map, Activity, ArrowRight, QrCode, FileText,
  UserCircle, CreditCard, Calendar
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAlerts } from '../../context/AlertContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { cn } from '../../lib/utils';
import { parentApi } from '../../services/api';
import api from '../../services/api';

const childStatusColors = {
  AT_HOME: 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700/50',
  PICKED_UP: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
  IN_TRANSIT: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20',
  AT_INSTITUTION: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
  DROPPED: 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700/50',
};

const childStatusLabel = {
  AT_HOME: 'At Home',
  PICKED_UP: 'Picked Up',
  IN_TRANSIT: 'In Transit',
  AT_INSTITUTION: 'At Institution',
  DROPPED: 'Dropped Home',
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
};

const formatTime = (dateString) => {
  if (!dateString) return '';
  const d = new Date(dateString);
  const now = new Date();
  const diff = now - d;
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return Math.floor(diff / 60000) + ' min ago';
  if (diff < 86400000) return Math.floor(diff / 3600000) + ' hours ago';
  return d.toLocaleDateString();
};

export default function ParentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addAlert } = useAlerts();
  
  const [children, setChildren] = useState([]);
  const [trips, setTrips] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeTrip, setActiveTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [childrenRes, tripsRes, notifRes, activeRes] = await Promise.all([
          api.get('/parent/children').catch(() => ({ data: { data: [] } })),
          parentApi.getTripHistory().catch(() => ({ data: { data: [] } })),
          parentApi.getNotifications().catch(() => ({ data: { data: [] } })),
          parentApi.getActiveTrip().catch(() => ({ data: { data: null } }))
        ]);
        setChildren(childrenRes.data?.data || []);
        setTrips(tripsRes.data?.data || []);
        setNotifications(notifRes.data?.data || []);
        setActiveTrip(activeRes.data?.data || null);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Calculate today's trips
  const todayStr = new Date().toISOString().split('T')[0];
  const todayTripsCount = trips.filter(t => t.date === todayStr).length;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col justify-center items-center h-[50vh] space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          <p className="text-gray-500 font-medium">Loading your dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-2xl font-display font-semibold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            Good Morning, {user?.firstName}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Here is your children's live transport status</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="destructive"
            onClick={() => {
              toast.error('Emergency Alert Sent! Police and Admin notified.', { style: { background: '#ef4444', color: '#fff' } });
              addAlert({ type: 'SOS', title: 'Parent SOS Alert', child: user?.firstName || 'Parent', priority: 'CRITICAL' });
            }} 
            className="shadow-glow-red hover:scale-105 transition-transform"
          >
            <AlertTriangle className="w-4 h-4 mr-2" /> SOS
          </Button>
          <Button 
            onClick={() => navigate('/parent/tracking')} 
            className="shadow-glow-blue hover:scale-105 transition-transform"
          >
            <MapPin className="w-4 h-4 mr-2" /> Live Track
          </Button>
        </div>
      </motion.div>

      {/* Active Trip Alert (Live View) */}
      <AnimatePresence>
        {activeTrip && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 p-1 rounded-2xl bg-gradient-to-r from-primary-500 via-indigo-500 to-primary-500 bg-[length:200%_auto] animate-gradient shadow-glow-blue overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500 via-indigo-500 to-primary-500 bg-[length:200%_auto] animate-gradient opacity-50 blur-xl"></div>
            
            <div className="bg-gray-900 dark:bg-[#09090b] rounded-xl p-5 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-500/20 border border-primary-500/30 flex items-center justify-center relative">
                  <div className="absolute inset-0 rounded-full border border-primary-500 animate-ping opacity-20"></div>
                  <Bus className="w-6 h-6 text-primary-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <h3 className="font-semibold text-slate-900 tracking-tight">Active Trip in Progress</h3>
                  </div>
                  <p className="text-slate-500 text-sm flex items-center gap-2">
                    <span className="text-slate-600 font-medium">{activeTrip.driver?.name || 'Driver'}</span> 
                    <span className="text-gray-600">•</span> 
                    Vehicle: {activeTrip.vehicle?.number || 'Unknown'}
                  </p>
                </div>
              </div>
              <Button 
                onClick={() => navigate('/parent/tracking')} 
                className="w-full md:w-auto bg-white text-gray-900 hover:bg-gray-100 rounded-full px-6"
              >
                Live Track <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats */}
      <motion.div 
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        <motion.div variants={itemVariants}>
          <StatCard title="Upcoming Pickup" value={todayTripsCount > 0 ? "08:30 AM" : "None"} icon={Clock}
            iconBg="bg-blue-100/50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20"
            subtitle="Next scheduled trip" />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard title="Current Driver" value={activeTrip?.driver?.name || "Not Assigned"} icon={UserCircle}
            iconBg="bg-emerald-100/50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20"
            subtitle={activeTrip?.vehicle?.number || "Waiting for trip"} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard title="Monthly Bill" value="₹2,450" icon={CreditCard}
            iconBg="bg-orange-100/50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20"
            subtitle="Due in 5 days" />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard title="Today's Status" value={todayTripsCount > 0 ? "Scheduled" : "Off"} icon={Calendar}
            iconBg="bg-purple-100/50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20"
            subtitle="1 Pickup, 1 Drop" />
        </motion.div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Children Status */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white/50 dark:bg-[#09090b]/50 backdrop-blur-xl border-gray-200/50 dark:border-dark-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg">Children Status</CardTitle>
                <CardDescription>Live location and transport state</CardDescription>
              </div>
              <Link to="/parent/children">
                <Button variant="ghost" size="sm" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
                  Manage <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3 pt-2">
              {children?.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  No children registered yet. Add a child to view their status.
                </div>
              ) : children?.map((child, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={child.id} 
                  className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-dark-border/50 bg-white dark:bg-dark-surface hover:border-gray-200 dark:hover:border-gray-700 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
                    {child.firstName?.[0] || 'C'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white tracking-tight">{child.firstName} {child.lastName}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate flex items-center gap-1">
                      {child.grade || 'Class'} <span className="text-slate-600 dark:text-gray-600">•</span> {child.institution || 'School'}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5",
                      childStatusColors[child.transportStatus || 'AT_HOME']
                    )}>
                      {child.transportStatus === 'IN_TRANSIT' && (
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                      )}
                      {childStatusLabel[child.transportStatus || 'AT_HOME']}
                    </span>
                    {child.transportStatus === 'IN_TRANSIT' && (
                      <button onClick={() => navigate('/parent/tracking')} className="text-[11px] uppercase tracking-wider font-semibold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-none p-0">
                        <Activity className="w-3 h-3" /> Track Live
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'View Driver', icon: UserCircle, path: '/parent/driver-details', color: 'from-blue-500 to-indigo-600', hover: 'hover:shadow-blue-500/20' },
              { label: 'Live Map', icon: MapPin, path: '/parent/tracking', color: 'from-emerald-500 to-teal-600', hover: 'hover:shadow-emerald-500/20' },
              { label: 'Emergency', icon: Heart, path: '/parent/emergency-contacts', color: 'from-red-500 to-pink-600', hover: 'hover:shadow-red-500/20' },
              { label: 'Billing', icon: CreditCard, path: '/parent/billing', color: 'from-orange-500 to-amber-600', hover: 'hover:shadow-orange-500/20' },
            ].map((action, i) => (
              <div key={action.label} onClick={() => navigate(action.path)} className="cursor-pointer">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + (i * 0.05) }}
                  className={cn(
                    "flex flex-col items-center justify-center gap-3 p-4 rounded-2xl bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-border/50 transition-all hover:-translate-y-1 hover:shadow-lg group h-full",
                    action.hover
                  )}
                >
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-slate-900 bg-gradient-to-br transition-transform group-hover:scale-110", action.color)}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{action.label}</span>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Timeline & Notifications */}
        <div className="space-y-6">
          <Card className="bg-white/50 dark:bg-[#09090b]/50 backdrop-blur-xl border-gray-200/50 dark:border-dark-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Recent Timeline</CardTitle>
              <Link to="/parent/trips">
                <Button variant="ghost" size="sm" className="h-8 text-primary-600 dark:text-primary-400">View All</Button>
              </Link>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="relative pl-6 border-l-2 border-gray-100 dark:border-gray-800 space-y-6 pb-2">
                {trips?.length === 0 ? (
                  <div className="text-sm text-gray-500 -ml-6 text-center py-4">No recent trips.</div>
                ) : trips.slice(0, 3).map((trip) => (
                  <div key={trip.id} className="relative">
                    <div className={cn(
                      "absolute -left-[31px] w-4 h-4 rounded-full border-4 border-white dark:border-[#09090b]",
                      trip.status === 'IN_PROGRESS' ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
                    )} />
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        {trip.type === 'PICKUP' ? 'School Pickup' : 'Home Drop'}
                        {trip.status === 'IN_PROGRESS' && <Badge variant="secondary" className="bg-primary-100 text-primary-700 hover:bg-primary-100 dark:bg-primary-900/30 dark:text-primary-400 border-0 h-5 px-1.5 text-[10px]">Active</Badge>}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {new Date(trip.date).toLocaleDateString()} • {trip.scheduledTime || 'Scheduled'}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-gray-500 mt-1 flex items-center gap-1">
                        <Users className="w-3 h-3" /> {trip.children?.map(c => c.name).join(', ') || 'No children'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/50 dark:bg-[#09090b]/50 backdrop-blur-xl border-gray-200/50 dark:border-dark-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">Notifications</CardTitle>
                {unreadCount > 0 && <Badge className="bg-red-500 text-white hover:bg-red-600 border-0">{unreadCount}</Badge>}
              </div>
            </CardHeader>
            <CardContent className="pt-2 space-y-3">
              {notifications?.length === 0 ? (
                <div className="text-sm text-gray-500 text-center py-4">No new notifications.</div>
              ) : notifications.slice(0, 3).map(n => (
                <div key={n.id} className={cn(
                  "p-3 rounded-xl border transition-colors flex items-start gap-3",
                  n.read 
                    ? "border-transparent bg-gray-50/50 dark:bg-dark-surface/50" 
                    : "border-primary-100 dark:border-primary-900/30 bg-primary-50/50 dark:bg-primary-500/5"
                )}>
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                    n.priority === 'HIGH' ? "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400" : "bg-primary-100 text-primary-600 dark:bg-primary-500/20 dark:text-primary-400"
                  )}>
                    {n.type === 'CHILD_PICKED_UP' ? <CheckCircle className="w-4 h-4" /> : n.type === 'TRIP_STARTED' ? <Bus className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={cn("text-sm font-semibold tracking-tight", n.read ? "text-gray-700 dark:text-gray-300" : "text-gray-900 dark:text-white")}>{n.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">{n.message}</p>
                    <p className="text-[10px] uppercase tracking-wider font-medium text-slate-500 mt-1.5">{formatTime(n.createdAt)}</p>
                  </div>
                </div>
              ))}
              <Link to="/parent/notifications" className="block pt-2">
                <Button variant="outline" className="w-full h-9 text-xs">View All Activity</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
