import { useState } from 'react';
import DashboardLayout from '../../components/shared/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertOctagon, AlertTriangle, Info, Bell, Filter, ShieldAlert, Phone, Megaphone, MapPin, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '../../lib/utils';

const mockAlerts = [
  { id: 1, type: 'MISSING_CHILD', title: 'Missing Child Alert', child: 'Rahul Verma', time: '10 min ago', priority: 'CRITICAL', active: true, desc: 'Child marked present at school but failed to board afternoon bus.', location: 'St. Mary\'s School (Gate 2)' },
  { id: 2, type: 'ROUTE_DEVIATION', title: 'Route Deviation', child: 'Aarav Sharma (Bus 1)', time: '1 hour ago', priority: 'HIGH', active: false, desc: 'Vehicle deviated more than 2km from planned route on MG Road.', location: 'MG Road Junction' },
  { id: 3, type: 'LATE_ARRIVAL', title: 'Late Arrival Warning', child: 'Bus 4', time: 'Yesterday', priority: 'NORMAL', active: false, desc: 'Vehicle arrived 25 minutes late for morning pickup.', location: 'Indiranagar' },
];

const priorityConfig = {
  CRITICAL: { color: 'text-red-700 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-500/20 border-red-200 dark:border-red-500/30', icon: AlertOctagon, pulse: true },
  HIGH: { color: 'text-orange-700 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-500/20 border-orange-200 dark:border-orange-500/30', icon: AlertTriangle, pulse: false },
  NORMAL: { color: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-500/20 border-blue-200 dark:border-blue-500/30', icon: Info, pulse: false },
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [filter, setFilter] = useState('ALL');

  const filteredAlerts = filter === 'ALL' ? alerts : alerts.filter(a => a.priority === filter);

  return (
    <DashboardLayout>
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 max-w-4xl mx-auto"
      >
        <div>
          <h1 className="text-2xl font-display font-semibold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-primary-500" /> Platform Alerts
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Real-time safety and operational notifications</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-1 rounded-xl border border-gray-200 dark:border-gray-800">
            {['ALL', 'CRITICAL', 'HIGH', 'NORMAL'].map(f => (
              <button 
                key={f} 
                onClick={() => setFilter(f)} 
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                  filter === f ? "bg-primary-500 text-white shadow-sm" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
              >
                {f}
              </button>
            ))}
          </div>
          <Button onClick={() => toast.error('Emergency Broadcast Initiated', { icon: '🚨' })} variant="destructive" className="shadow-sm font-bold">
            <Megaphone className="w-4 h-4 mr-2" /> Global Broadcast
          </Button>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto">
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 md:left-[35px] top-4 bottom-4 w-px bg-gray-200 dark:bg-gray-800/80 rounded-full" />
          
          <div className="space-y-6">
            <AnimatePresence>
              {filteredAlerts?.map((alert, i) => {
                const config = priorityConfig[alert.priority];
                const Icon = config.icon;
                
                return (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.1 }}
                    key={alert.id} 
                    className="relative flex gap-4 md:gap-6"
                  >
                    {/* Timeline Node */}
                    <div className="relative shrink-0 mt-1">
                      {config.pulse && alert.active && (
                        <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20 scale-150" />
                      )}
                      <div className={cn(
                        "w-[70px] h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-slate-900 shadow-sm border border-white/20 dark:border-black/20 z-10 relative overflow-hidden",
                        alert.priority === 'CRITICAL' ? "bg-gradient-to-br from-red-500 to-rose-600 shadow-red-500/30" : alert.priority === 'HIGH' ? "bg-gradient-to-br from-orange-400 to-amber-600 shadow-orange-500/20" : "bg-gradient-to-br from-blue-400 to-indigo-600 shadow-blue-500/20"
                      )}>
                        {alert.active && <div className="absolute inset-0 bg-white/20 animate-pulse" />}
                        <Icon className="w-6 h-6 md:w-8 md:h-8" />
                      </div>
                    </div>
                    
                    {/* Alert Card */}
                    <Card className={cn(
                      "flex-1 bg-white/70 dark:bg-[#09090b]/70 backdrop-blur-xl border-gray-200/50 dark:border-dark-border/50 overflow-hidden relative transition-all group",
                      alert.active ? "border-l-4 border-l-red-500" : ""
                    )}>
                      {alert.active && alert.priority === 'CRITICAL' && (
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                      )}
                      
                      <div className="p-5 md:p-6">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1.5">
                              <Badge className={cn("px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold border", config.bg, config.color)}>
                                {alert.priority}
                              </Badge>
                              {alert.active && (
                                <Badge className="bg-red-500 text-white border-none animate-pulse px-1.5 py-0.5 text-[10px] uppercase tracking-wider font-bold">
                                  Action Required
                                </Badge>
                              )}
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">{alert.title}</h3>
                          </div>
                          
                          <div className="text-right shrink-0">
                            <p className="text-sm font-bold text-gray-900 dark:text-white">{alert.time}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">TCK-{alert.id.toString().padStart(4, '0')}</p>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50/50 dark:bg-gray-900/30 rounded-xl p-4 border border-gray-100 dark:border-gray-800 mb-4">
                          <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-3">{alert.desc}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-medium text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-2 bg-white dark:bg-gray-800/80 p-2 rounded-lg border border-gray-100 dark:border-gray-700/50">
                              <ShieldAlert className="w-4 h-4 text-slate-500 shrink-0" />
                              <span className="truncate"><strong>Subject:</strong> {alert.child}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white dark:bg-gray-800/80 p-2 rounded-lg border border-gray-100 dark:border-gray-700/50">
                              <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
                              <span className="truncate"><strong>Loc:</strong> {alert.location}</span>
                            </div>
                          </div>
                        </div>
                        
                        {alert.active && (
                          <div className="flex gap-3">
                            <Button variant="default" className="bg-red-600 hover:bg-red-700 text-white font-bold shadow-sm shadow-red-600/20">
                              Acknowledge Alert
                            </Button>
                            <Button variant="outline" className="border-gray-200 dark:border-gray-700 font-bold bg-white/50 dark:bg-gray-900/50">
                              <Phone className="w-4 h-4 mr-2" /> Contact Driver
                            </Button>
                          </div>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            
            {filteredAlerts?.length === 0 && (
              <div className="text-center py-12 ml-8 md:ml-16">
                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4 border border-gray-200 dark:border-gray-700">
                  <ShieldAlert className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">All Clear</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1">No active alerts matching the selected severity.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
