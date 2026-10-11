import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/shared/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, Navigation, Home, AlertTriangle, PartyPopper, UserCheck, Settings, Info, Circle, Users, Repeat, CreditCard, FileText, XCircle, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '../../lib/utils';
import { parentApi } from '../../services/api';

const notifStyles = {
  CHILD_PICKED_UP: { icon: UserCheck, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
  TRIP_STARTED: { icon: Navigation, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
  CHILD_DROPPED: { icon: Home, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
  ROUTE_DEVIATION: { icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-500/10' },
  TRIP_COMPLETED: { icon: PartyPopper, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
  DRIVER_ASSIGNED: { icon: Users, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/20' },
  DRIVER_CHANGED: { icon: Repeat, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
  EMERGENCY_ALERT: { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-500/10' },
  PAYMENT_REMINDER: { icon: CreditCard, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-500/10' },
  INVOICE_GENERATED: { icon: FileText, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
  TRIP_CANCELLED: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-500/10' },
  SYSTEM: { icon: Settings, color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-800' },
  DEFAULT: { icon: Info, color: 'text-primary-500', bg: 'bg-primary-50 dark:bg-primary-500/10' },
};

const formatTime = (dateString) => {
  const d = new Date(dateString);
  const now = new Date();
  const diff = now - d;
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return Math.floor(diff / 60000) + ' min ago';
  if (diff < 86400000) return Math.floor(diff / 3600000) + ' hours ago';
  return d.toLocaleDateString();
};

const getGroup = (dateString) => {
  const d = new Date(dateString);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) return 'Today';
  const yest = new Date(now);
  yest.setDate(yest.getDate() - 1);
  if (d.toDateString() === yest.toDateString()) return 'Yesterday';
  return 'Earlier';
};

const groupNotificationsByDate = (notifsList) => {
  return notifsList.reduce((acc, notif) => {
    const group = getGroup(notif.createdAt);
    if (!acc[group]) acc[group] = [];
    acc[group].push(notif);
    return acc;
  }, {});
};

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await parentApi.getNotifications().catch(() => ({ data: { data: [] } }));
      
      const mockRichData = [
        { id: 1, type: 'EMERGENCY_ALERT', title: 'Route Deviation Detected', message: 'Vehicle TN 09 AB 1234 has deviated from the assigned route.', read: false, priority: 'HIGH', createdAt: new Date().toISOString() },
        { id: 2, type: 'CHILD_PICKED_UP', title: 'Child Picked Up', message: 'Aarav has boarded the transport safely.', read: false, priority: 'NORMAL', createdAt: new Date(Date.now() - 3600000).toISOString() },
        { id: 3, type: 'TRIP_STARTED', title: 'Trip Started', message: 'The morning pickup trip has started.', read: true, priority: 'NORMAL', createdAt: new Date(Date.now() - 7200000).toISOString() },
        { id: 4, type: 'DRIVER_ASSIGNED', title: 'New Driver Assigned', message: 'Rajesh Kumar is assigned to Route A.', read: true, priority: 'NORMAL', createdAt: new Date(Date.now() - 86400000).toISOString() },
        { id: 5, type: 'INVOICE_GENERATED', title: 'Invoice Generated', message: 'Your monthly transport invoice for October is ready.', read: true, priority: 'NORMAL', createdAt: new Date(Date.now() - 90000000).toISOString() },
        { id: 6, type: 'PAYMENT_REMINDER', title: 'Payment Reminder', message: 'Please clear your transport dues by 5th Nov.', read: true, priority: 'HIGH', createdAt: new Date(Date.now() - 172800000).toISOString() },
        { id: 7, type: 'DRIVER_CHANGED', title: 'Driver Changed', message: 'Driver for Route A was changed due to unavailability.', read: true, priority: 'NORMAL', createdAt: new Date(Date.now() - 259200000).toISOString() },
        { id: 8, type: 'TRIP_CANCELLED', title: 'Trip Cancelled', message: 'Evening trip cancelled due to severe weather warnings.', read: true, priority: 'HIGH', createdAt: new Date(Date.now() - 345600000).toISOString() },
        { id: 9, type: 'CHILD_DROPPED', title: 'Child Dropped Off', message: 'Aarav was successfully dropped at Home.', read: true, priority: 'NORMAL', createdAt: new Date(Date.now() - 432000000).toISOString() },
      ];
      
      setNotifs(mockRichData);
    } catch (err) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const unreadCount = notifs.filter(n => !n.read).length;
  
  const markAll = () => { 
    setNotifs(p => p?.map(n => ({ ...n, read: true }))); 
    toast.success('All notifications marked as read', { icon: '✅' }); 
  };
  
  const clearAll = () => {
    setNotifs([]);
    toast.success('All notifications cleared');
  };
  
  const toggleRead = (id) => {
    setNotifs(p => p?.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const filteredNotifs = filter === 'ALL' ? notifs : notifs.filter(n => filter === 'UNREAD' ? !n.read : n.read);
  const groupedNotifs = groupNotificationsByDate(filteredNotifs);
  const groups = ['Today', 'Yesterday', 'Earlier'].filter(g => groupedNotifs[g] && groupedNotifs[g].length > 0);

  return (
    <DashboardLayout>
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6 max-w-4xl mx-auto"
      >
        <div>
          <h1 className="text-2xl font-display font-semibold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <div className="relative">
              <Bell className="w-6 h-6 text-primary-500" />
              {unreadCount > 0 && <span className="absolute -top-1 -right-1 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white dark:border-gray-950"></span></span>}
            </div>
            Notifications
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Stay updated on your child's transport and platform alerts</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-1 rounded-xl border border-gray-200 dark:border-gray-800">
            {['ALL', 'UNREAD'].map(f => (
              <button 
                key={f} 
                onClick={() => setFilter(f)} 
                className={cn(
                  "px-4 py-2 rounded-lg text-xs font-bold transition-all",
                  filter === f ? "bg-primary-500 text-white shadow-sm" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
              >
                {f} {f === 'UNREAD' && unreadCount > 0 && `(${unreadCount})`}
              </button>
            ))}
          </div>
          {unreadCount > 0 && (
            <Button onClick={markAll} variant="outline" className="h-10 border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm text-gray-600 dark:text-gray-300 hidden sm:flex">
              <Check className="w-4 h-4 mr-2" /> Mark All Read
            </Button>
          )}
          {notifs?.length > 0 && (
            <Button onClick={clearAll} variant="outline" className="h-10 border-red-200 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10 backdrop-blur-sm text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 hidden sm:flex">
              <Trash2 className="w-4 h-4 mr-2" /> Clear All
            </Button>
          )}
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto space-y-8">
        {loading ? (
           <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse flex gap-4 p-4 border border-gray-100 rounded-xl">
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                </div>
              </div>
            ))}
           </div>
        ) : (
          <AnimatePresence>
            {groups?.map((group, groupIndex) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: groupIndex * 0.1 }}
                key={group} 
                className="space-y-4"
              >
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 ml-1">{group}</h3>
                
                <div className="space-y-3">
                  {groupedNotifs[group].map((n, i) => {
                    const Style = notifStyles[n.type] || notifStyles.DEFAULT;
                    const Icon = Style.icon;
                    
                    return (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: (groupIndex * 0.1) + (i * 0.05) }}
                        key={n.id} 
                      >
                        <Card 
                          onClick={() => toggleRead(n.id)}
                          className={cn(
                            "bg-white/70 dark:bg-[#09090b]/70 backdrop-blur-xl border-gray-200/50 dark:border-dark-border/50 p-4 transition-all cursor-pointer group hover:border-primary-500/30",
                            !n.read ? "shadow-sm border-l-4 border-l-primary-500 dark:border-l-primary-500" : "opacity-80 hover:opacity-100",
                            n.priority === 'HIGH' && !n.read && "border-l-orange-500 dark:border-l-orange-500 shadow-orange-500/5"
                          )}
                        >
                          <div className="flex items-start gap-4">
                            <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5", Style.bg, Style.color)}>
                              <Icon className="w-5 h-5" />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <h4 className={cn("text-sm font-semibold truncate", !n.read ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300")}>
                                  {n.title}
                                </h4>
                                <span className="text-[11px] font-medium text-slate-500 dark:text-gray-500 whitespace-nowrap shrink-0">{formatTime(n.createdAt)}</span>
                              </div>
                              
                              <p className={cn("text-sm leading-relaxed", !n.read ? "text-gray-600 dark:text-gray-300" : "text-gray-500 dark:text-gray-400")}>
                                {n.message}
                              </p>
                            </div>
                            
                            <div className="shrink-0 flex items-center justify-center w-6 pt-1">
                              {!n.read ? (
                                <Circle className="w-2.5 h-2.5 fill-primary-500 text-primary-500" />
                              ) : (
                                <Check className="w-4 h-4 text-slate-600 dark:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                              )}
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {!loading && groups?.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">All caught up!</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-1">You have no {filter === 'UNREAD' ? 'unread ' : ''}notifications at this time.</p>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
