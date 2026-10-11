import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/shared/DashboardLayout';
import StatCard from '../../components/shared/StatCard';
import StatusBadge from '../../components/shared/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { 
  GraduationCap, Truck, AlertTriangle, CheckCircle, 
  Map, Phone, Search, Filter, ShieldAlert, ArrowRight, User, Activity, UserCheck, Star, ShieldCheck, Bus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { cn } from '../../lib/utils';

const mockStudents = [
  { id: 1, name: 'Aarav Sharma', grade: '6th', section: 'A', parentName: 'Rajesh Sharma', phone: '9876543210', transportStatus: 'IN_TRANSIT', absent: false },
  { id: 2, name: 'Priya Patel', grade: '6th', section: 'B', parentName: 'Suresh Patel', phone: '9876543211', transportStatus: 'AT_INSTITUTION', absent: false },
  { id: 3, name: 'Rahul Verma', grade: '7th', section: 'A', parentName: 'Manoj Verma', phone: '9876543212', transportStatus: 'AT_HOME', absent: true },
  { id: 4, name: 'Sneha Kumar', grade: '5th', section: 'C', parentName: 'Vijay Kumar', phone: '9876543213', transportStatus: 'PICKED_UP', absent: false },
  { id: 5, name: 'Aryan Singh', grade: '8th', section: 'A', parentName: 'Ravi Singh', phone: '9876543214', transportStatus: 'AT_HOME', absent: false },
];

const attendanceData = [
  { date: 'Mon', present: 95, absent: 5 },
  { date: 'Tue', present: 92, absent: 8 },
  { date: 'Wed', present: 96, absent: 4 },
  { date: 'Thu', present: 89, absent: 11 },
  { date: 'Fri', present: 94, absent: 6 },
];

import { institutionApi } from '../../services/api';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
};

export default function InstitutionDashboard() {
  const { user } = useAuth();
  const [students, setStudents] = useState(mockStudents);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [activeTransport, setActiveTransport] = useState([]);
  const [todayTransport, setTodayTransport] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [activeRes, todayRes] = await Promise.all([
          institutionApi.getActiveTransport(),
          institutionApi.getTodayTransport()
        ]);
        setActiveTransport(activeRes.data?.data || []);
        setTodayTransport(todayRes.data?.data || []);
      } catch (err) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // Poll every 30 seconds for live updates
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const markAbsent = (id) => {
    setStudents(prev => prev?.map(s => s.id === id ? { ...s, absent: !s.absent } : s));
    toast.success('Absence status updated. Parents notified.');
  };

  const raiseMissingAlert = (student) => {
    toast.error(`Missing child alert raised for ${student.name}! Emergency contacts notified.`, { style: { background: '#ef4444', color: '#fff' } });
  };

  const filteredStudents = students.filter(s => {
    const matchesFilter = 
      filter === 'all' ? true :
      filter === 'transit' ? ['IN_TRANSIT', 'PICKED_UP'].includes(s.transportStatus) :
      filter === 'absent' ? s.absent : true;
      
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.parentName.toLowerCase().includes(searchQuery.toLowerCase());
                          
    return matchesFilter && matchesSearch;
  });

  return (
    <DashboardLayout>
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-2xl font-display font-semibold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            Institution Dashboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">St. Mary's School · Student Transport Management</p>
        </div>
        <Button 
          variant="destructive"
          onClick={() => toast.error('Emergency alert raised for all active trips!', { style: { background: '#ef4444', color: '#fff' } })} 
          className="shadow-glow-red hover:scale-105 transition-transform"
        >
          <ShieldAlert className="w-4 h-4 mr-2" /> Global Emergency Alert
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div 
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        <motion.div variants={itemVariants}>
          <StatCard title="Active Students" value="1,245" icon={UserCheck}
            iconBg="bg-blue-100/50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20" />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard title="Active Buses" value={activeTransport?.length.toString() || '12'} icon={Bus}
            iconBg="bg-emerald-100/50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20" />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard title="Drivers Online" value="28 / 30" icon={Activity}
            iconBg="bg-purple-100/50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20" />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard title="Trips Today" value={todayTransport?.length.toString() || '45'} icon={Map} trend="98% On Time" trendUp />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <StatCard title="Attendance %" value="94.5%" icon={CheckCircle} trend="+1.2% from last week" trendUp />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard title="Avg Driver Rating" value="4.8" icon={Star} trend="Top 10% Regional" trendUp />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard title="Safety Incidents" value="0" icon={ShieldCheck} trend="Zero Incidents MTD" trendUp 
            iconBg="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard title="Emergency Alerts" value="0" icon={ShieldAlert} trend="All Systems Normal" 
            iconBg="bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400" />
        </motion.div>
      </motion.div>

      {/* Analytics Chart */}
      <div className="mb-8">
        <Card className="bg-white/50 dark:bg-[#09090b]/50 backdrop-blur-xl border-gray-200/50 dark:border-dark-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Weekly Attendance Trend</CardTitle>
            <CardDescription>Present vs Absent students across all grades</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="presentGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="absentGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '8px', color: '#f9fafb' }} />
                  <Area type="monotone" dataKey="present" stroke="#10b981" strokeWidth={3} fill="url(#presentGrad)" activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }} name="Present %" />
                  <Area type="monotone" dataKey="absent" stroke="#f59e0b" strokeWidth={3} fill="url(#absentGrad)" activeDot={{ r: 6, fill: '#f59e0b', stroke: '#fff', strokeWidth: 2 }} name="Absent %" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Active Transport */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-white/50 dark:bg-[#09090b]/50 backdrop-blur-xl border-gray-200/50 dark:border-dark-border/50 h-full flex flex-col">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary-500" /> Active Vehicles
              </CardTitle>
              <CardDescription>Live status of fleet operations</CardDescription>
            </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            {loading ? (
                <div className="p-8 text-center text-gray-500">Loading live status...</div>
            ) : activeTransport?.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No active transport vehicles currently.</div>
            ) : (
                <div className="space-y-4 flex-1">
                  {activeTransport?.map((vehicle, i) => (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      key={vehicle.tripId} 
                      className={cn(
                        "p-4 rounded-xl border transition-all",
                        vehicle.tripStatus === 'IN_PROGRESS' 
                          ? "border-primary-200 dark:border-primary-900/50 bg-primary-50/50 dark:bg-primary-500/5" 
                          : "border-gray-100 dark:border-dark-border/50 bg-white dark:bg-dark-surface"
                      )}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="outline" className="font-mono bg-white dark:bg-[#09090b] border-gray-200 dark:border-gray-800">
                          {vehicle.vehicleNumber}
                        </Badge>
                        <StatusBadge status={vehicle.tripStatus} />
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{vehicle.driverName}</p>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1.5 font-medium">
                          <span>{vehicle.pickedUp}/{vehicle.totalStudents} Students</span>
                          <span className={vehicle.tripStatus === 'IN_PROGRESS' ? 'text-primary-600 dark:text-primary-400' : ''}>ETA: {vehicle.eta}</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(vehicle.pickedUp / Math.max(vehicle.totalStudents, 1)) * 100}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={cn(
                              "h-full rounded-full transition-colors",
                              vehicle.tripStatus === 'IN_PROGRESS' ? 'bg-primary-500' : 'bg-emerald-500'
                            )}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
            )}
            <Link to="/institution/transport" className="mt-6 block">
              <Button className="w-full shadow-glow-blue h-11">
                <Map className="w-4 h-4 mr-2" /> View Live Map Fleet
              </Button>
            </Link>
          </CardContent>
          </Card>
        </div>

        {/* Student List */}
        <div className="lg:col-span-2">
          <Card className="bg-white/50 dark:bg-[#09090b]/50 backdrop-blur-xl border-gray-200/50 dark:border-dark-border/50 h-full flex flex-col">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-lg">Student Transport Status</CardTitle>
                  <CardDescription>Manage and monitor all students</CardDescription>
                </div>
                <div className="flex items-center gap-2 bg-gray-100/50 dark:bg-gray-800/50 p-1 rounded-lg border border-gray-200/50 dark:border-gray-700/50">
                  {['all','transit','absent'].map(f => (
                    <button 
                      key={f} 
                      onClick={() => setFilter(f)}
                      className={cn(
                        "px-3 py-1.5 rounded-md text-xs font-medium transition-all capitalize",
                        filter === f 
                          ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm" 
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                      )}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <div className="relative mt-4">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <Input 
                  placeholder="Search students or parents..." 
                  className="pl-9 bg-white dark:bg-[#09090b] border-gray-200 dark:border-dark-border"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-hidden flex-1">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-800/50 uppercase border-y border-gray-200 dark:border-dark-border/50">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Student</th>
                      <th className="px-6 py-4 font-semibold">Grade</th>
                      <th className="px-6 py-4 font-semibold">Parent Contact</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-dark-border/50">
                    <AnimatePresence>
                      {filteredStudents?.map((student, i) => (
                        <motion.tr 
                          key={student.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ delay: i * 0.05 }}
                          className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                "w-9 h-9 rounded-full flex items-center justify-center text-slate-900 text-sm font-bold shadow-sm",
                                student.absent ? "bg-gray-400 dark:bg-gray-600" : "bg-gradient-to-br from-indigo-400 to-purple-500"
                              )}>
                                {student.name[0]}
                              </div>
                              <div>
                                <p className={cn("font-medium", student.absent ? "text-gray-500 dark:text-gray-400" : "text-gray-900 dark:text-white")}>{student.name}</p>
                                {student.absent && <span className="text-[10px] font-semibold uppercase tracking-wider text-orange-500">Absent Today</span>}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{student.grade}-{student.section}</td>
                          <td className="px-6 py-4">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{student.parentName}</p>
                            <a href={`tel:${student.phone}`} className="text-xs text-primary-600 dark:text-primary-400 hover:underline">{student.phone}</a>
                          </td>
                          <td className="px-6 py-4">
                            {!student.absent ? <StatusBadge status={student.transportStatus} /> : <span className="text-slate-500">-</span>}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => markAbsent(student.id)}
                                className={cn(
                                  "h-8 px-3 text-xs font-medium border",
                                  student.absent 
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20" 
                                    : "hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200 dark:hover:bg-orange-500/10 dark:hover:text-orange-400 dark:hover:border-orange-500/20"
                                )}
                              >
                                {student.absent ? 'Mark Present' : 'Mark Absent'}
                              </Button>
                              {!student.absent && (
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => raiseMissingAlert(student)}
                                  className="h-8 px-3 text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 border-0 dark:bg-red-500/20 dark:text-red-400 dark:hover:bg-red-500/30"
                                >
                                  <ShieldAlert className="w-3.5 h-3.5 mr-1" /> Alert
                                </Button>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                    {filteredStudents?.length === 0 && (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                          No students found matching your criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
