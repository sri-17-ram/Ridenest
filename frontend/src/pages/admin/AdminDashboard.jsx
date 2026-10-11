import { useState } from 'react';
import DashboardLayout from '../../components/shared/DashboardLayout';
import StatCard from '../../components/shared/StatCard';
import { useAuth } from '../../context/AuthContext';
import { Users, ShieldCheck, Building, Truck, AlertTriangle, ClipboardList, Activity, CheckCircle, Bell, ChevronRight, X, Check, Map, Route } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import toast from 'react-hot-toast';
import { useAlerts } from '../../context/AlertContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { cn } from '../../lib/utils';

const stats = {
  totalParents: 1247, totalDrivers: 89, totalInstitutions: 42, totalChildren: 2891,
  activeTrips: 23, pendingDriverVerifications: 8, pendingInstitutionApprovals: 3,
  openComplaints: 12, completedTrips: 15643, emergencyAlerts: 2, pendingVehicleVerifications: 5,
};

const weeklyTrips = [
  { day: 'Mon', trips: 45 }, { day: 'Tue', trips: 52 }, { day: 'Wed', trips: 38 },
  { day: 'Thu', trips: 61 }, { day: 'Fri', trips: 55 }, { day: 'Sat', trips: 22 }, { day: 'Sun', trips: 8 },
];

const institutionBreakdown = [
  { name: 'Schools', value: 18, color: '#3b82f6' },
  { name: 'Tuition', value: 10, color: '#8b5cf6' },
  { name: 'Daycare', value: 7, color: '#10b981' },
  { name: 'Sports', value: 4, color: '#f97316' },
  { name: 'Others', value: 3, color: '#eab308' },
];

const pendingDrivers = [
  { id: 1, name: 'Suresh Kumar', phone: '9876543210', submittedDays: 2, city: 'Bangalore' },
  { id: 2, name: 'Mohan Rao', phone: '9876543211', submittedDays: 4, city: 'Mysore' },
  { id: 3, name: 'Ramesh Nair', phone: '9876543212', submittedDays: 1, city: 'Bangalore' },
];

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const { alerts } = useAlerts();
  const [drivers, setDrivers] = useState(pendingDrivers);

  const activeAlertsCount = alerts.filter(a => !a.resolved).length;
  const recentAlerts = alerts.slice(0, 5);

  const verifyDriver = (id, approved) => {
    setDrivers(prev => prev.filter(d => d.id !== id));
    toast.success(approved ? 'Driver approved! Notification sent.' : 'Driver application rejected.');
  };

  return (
    <DashboardLayout>
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-2xl font-display font-semibold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            Admin Control Center
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Platform overview and management — {new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}</p>
        </div>
        <Link to="/admin/emergency">
          <Button 
            variant="destructive" 
            className={cn("shadow-glow-red hover:scale-105 transition-transform", activeAlertsCount > 0 && "animate-pulse")}
          >
            <AlertTriangle className="w-4 h-4 mr-2" /> Emergency Monitor
          </Button>
        </Link>
      </motion.div>

      {/* Emergency alerts banner */}
      <AnimatePresence>
        {activeAlertsCount > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0, mb: 0 }}
            animate={{ opacity: 1, height: 'auto', mb: 32 }}
            exit={{ opacity: 0, height: 0, mb: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 backdrop-blur-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center relative">
                    <div className="absolute inset-0 rounded-full border border-red-500 animate-ping opacity-20"></div>
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-red-600 dark:text-red-400">
                      {activeAlertsCount} Active Emergency Alert{activeAlertsCount > 1 ? 's' : ''} Require Attention
                    </p>
                    <p className="text-sm text-red-500/80 dark:text-red-400/80 mt-0.5">Please review the emergency monitor immediately.</p>
                  </div>
                </div>
                <Link to="/admin/emergency">
                  <Button variant="destructive" className="w-full sm:w-auto shadow-glow-red">
                    View Monitor <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* KPI Stats Grid */}
      <motion.div 
        variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        <motion.div variants={itemVariants}>
          <StatCard title="Total Parents" value={stats.totalParents.toLocaleString()} icon={Users}
            iconBg="bg-blue-100/50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20" trend={12} trendLabel="this month" />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard title="Verified Drivers" value={stats.totalDrivers} icon={ShieldCheck}
            iconBg="bg-emerald-100/50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20"
            subtitle={`${stats.pendingDriverVerifications} pending`} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard title="Institutions" value={stats.totalInstitutions} icon={Building}
            iconBg="bg-purple-100/50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20"
            subtitle={`${stats.pendingInstitutionApprovals} pending approval`} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard title="Children Enrolled" value={stats.totalChildren.toLocaleString()} icon={Users}
            iconBg="bg-pink-100/50 text-pink-600 dark:bg-pink-500/10 dark:text-pink-400 border border-pink-200 dark:border-pink-500/20" trend={8} trendLabel="this month" />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard title="Active Trips" value={stats.activeTrips} icon={Truck}
            iconBg="bg-orange-100/50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20"
            subtitle="Right now" />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard title="Total Trips" value={stats.completedTrips.toLocaleString()} icon={CheckCircle}
            iconBg="bg-teal-100/50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400 border border-teal-200 dark:border-teal-500/20" trend={5} trendLabel="this week" />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard title="Open Complaints" value={stats.openComplaints} icon={ClipboardList}
            iconBg="bg-red-100/50 text-red-600 dark:bg-red-500/10 dark:text-red-400 border border-red-200 dark:border-red-500/20" />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard title="Emergencies" value={activeAlertsCount} icon={AlertTriangle}
            iconBg="bg-red-100/50 text-red-700 dark:bg-red-500/20 dark:text-red-400 border border-red-200 dark:border-red-500/30"
            subtitle="Active alerts" />
        </motion.div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Weekly trips chart */}
        <div className="lg:col-span-2">
          <Card className="bg-white/50 dark:bg-[#09090b]/50 backdrop-blur-xl border-gray-200/50 dark:border-dark-border/50 h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Weekly Trip Volume</CardTitle>
              <CardDescription>Platform activity over the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyTrips} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="tripGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="day" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 12, fill: '#6b7280' }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '8px', color: '#f9fafb' }}
                      itemStyle={{ color: '#60a5fa' }}
                    />
                    <Area type="monotone" dataKey="trips" stroke="#3b82f6" strokeWidth={3} fill="url(#tripGrad)" activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Institution breakdown */}
        <div>
          <Card className="bg-white/50 dark:bg-[#09090b]/50 backdrop-blur-xl border-gray-200/50 dark:border-dark-border/50 h-full flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Institutions by Type</CardTitle>
              <CardDescription>Distribution of partnered organizations</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-center">
              <div className="h-[180px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={institutionBreakdown} 
                      dataKey="value" 
                      cx="50%" 
                      cy="50%" 
                      innerRadius={60}
                      outerRadius={80} 
                      paddingAngle={5}
                      stroke="none"
                    >
                      {institutionBreakdown?.map(entry => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '8px', color: '#f9fafb' }}
                      itemStyle={{ color: '#f9fafb' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2.5 mt-4">
                {institutionBreakdown?.map(item => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2.5">
                      <div className="w-3 h-3 rounded-full shadow-sm" style={{ background: item.color }} />
                      <span className="text-gray-600 dark:text-gray-400 font-medium">{item.name}</span>
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pending Driver Verifications */}
        <Card className="bg-white/50 dark:bg-[#09090b]/50 backdrop-blur-xl border-gray-200/50 dark:border-dark-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg">Pending Verifications</CardTitle>
              <CardDescription>Drivers waiting for manual approval</CardDescription>
            </div>
            {drivers?.length > 0 && <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-0 dark:bg-orange-500/20 dark:text-orange-400">{drivers?.length}</Badge>}
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              <AnimatePresence>
                {drivers?.map((driver, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.05 }}
                    key={driver.id} 
                    className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-border/50 hover:border-primary-200 dark:hover:border-primary-900/30 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold shadow-sm">
                      {driver.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{driver.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                        <Map className="w-3 h-3" /> {driver.city} <span className="text-slate-600 dark:text-gray-600">•</span> {driver.submittedDays}d ago
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="icon" 
                        variant="outline" 
                        onClick={() => verifyDriver(driver.id, true)} 
                        className="w-8 h-8 rounded-full border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:border-emerald-500/20 dark:text-emerald-400 dark:hover:bg-emerald-500/10"
                        title="Approve"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="outline" 
                        onClick={() => verifyDriver(driver.id, false)} 
                        className="w-8 h-8 rounded-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-500/20 dark:text-red-400 dark:hover:bg-red-500/10"
                        title="Reject"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {drivers?.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8 text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-dark-surface/50 rounded-xl border border-gray-100 dark:border-dark-border/50"
                >
                  <CheckCircle className="w-12 h-12 mx-auto mb-3 text-emerald-500/50" />
                  <p className="text-sm font-medium">All caught up!</p>
                  <p className="text-xs mt-1">No pending driver verifications.</p>
                </motion.div>
              )}
            </div>
            <Link to="/admin/drivers" className="mt-6 block">
              <Button variant="outline" className="w-full h-10 text-sm">View All Drivers <ChevronRight className="w-4 h-4 ml-1" /></Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card className="bg-white/50 dark:bg-[#09090b]/50 backdrop-blur-xl border-gray-200/50 dark:border-dark-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg">Recent System Alerts</CardTitle>
              <CardDescription>Security and operational notifications</CardDescription>
            </div>
            <Link to="/admin/emergency">
              <Button variant="ghost" size="sm" className="text-primary-600 dark:text-primary-400">View All</Button>
            </Link>
          </CardHeader>
          <CardContent className="pt-4 flex flex-col h-[calc(100%-4rem)] justify-between">
            <div className="space-y-3 mb-6">
              {recentAlerts?.map((alert, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={alert.id} 
                  className={cn(
                    "p-3.5 rounded-xl border-l-4 transition-all hover:bg-gray-50 dark:hover:bg-gray-800/50",
                    alert.priority === 'CRITICAL' 
                      ? "border-red-500 bg-red-50/50 dark:bg-red-500/5 border-t border-r border-b border-t-red-100 border-r-red-100 border-b-red-100 dark:border-t-red-900/30 dark:border-r-red-900/30 dark:border-b-red-900/30" 
                      : "border-orange-500 bg-orange-50/50 dark:bg-orange-500/5 border-t border-r border-b border-t-orange-100 border-r-orange-100 border-b-orange-100 dark:border-t-orange-900/30 dark:border-r-orange-900/30 dark:border-b-orange-900/30"
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                      {alert.priority === 'CRITICAL' ? <AlertTriangle className="w-4 h-4 text-red-500" /> : <Bell className="w-4 h-4 text-orange-500" />}
                      {alert.type}
                    </p>
                    <Badge variant="outline" className={cn(
                      "text-[10px] uppercase tracking-wider font-bold border-0 px-2 py-0 h-5",
                      alert.priority === 'CRITICAL' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400'
                    )}>
                      {alert.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between pl-6">
                    <span>{alert.trip}</span>
                    <span className="font-medium text-slate-500 dark:text-gray-500">{alert.time}</span>
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Quick management links */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-auto">
              <Link to="/admin/users">
                <Button variant="outline" className="w-full h-12 flex flex-col justify-center items-center gap-0.5 hover:border-primary-200 dark:hover:border-primary-900/50 hover:bg-primary-50 dark:hover:bg-primary-500/5 transition-colors">
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Users</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">Manage All</span>
                </Button>
              </Link>
              <Link to="/admin/routes">
                <Button variant="outline" className="w-full h-12 flex flex-col justify-center items-center gap-0.5 hover:border-primary-200 dark:hover:border-primary-900/50 hover:bg-primary-50 dark:hover:bg-primary-500/5 transition-colors">
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1.5"><Route className="w-3.5 h-3.5" /> Routes</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">Configure</span>
                </Button>
              </Link>
              <Link to="/admin/trips">
                <Button variant="outline" className="w-full h-12 flex flex-col justify-center items-center gap-0.5 hover:border-primary-200 dark:hover:border-primary-900/50 hover:bg-primary-50 dark:hover:bg-primary-500/5 transition-colors">
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1.5"><Truck className="w-3.5 h-3.5" /> Trips</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{stats.activeTrips} Active</span>
                </Button>
              </Link>
              <Link to="/admin/complaints" className="md:col-span-1">
                <Button variant="outline" className="w-full h-12 flex flex-col justify-center items-center gap-0.5 hover:border-primary-200 dark:hover:border-primary-900/50 hover:bg-primary-50 dark:hover:bg-primary-500/5 transition-colors">
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1.5"><ClipboardList className="w-3.5 h-3.5" /> Complaints</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{stats.openComplaints} Open</span>
                </Button>
              </Link>
              <Link to="/admin/institutions" className="md:col-span-2">
                <Button variant="outline" className="w-full h-12 flex flex-col justify-center items-center gap-0.5 hover:border-primary-200 dark:hover:border-primary-900/50 hover:bg-primary-50 dark:hover:bg-primary-500/5 transition-colors">
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1.5"><Building className="w-3.5 h-3.5" /> Institutions</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{stats.pendingInstitutionApprovals} Pending</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
