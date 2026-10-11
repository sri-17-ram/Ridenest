import DashboardLayout from '../../components/shared/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { motion } from 'framer-motion';
import { BarChart as BarChartIcon, Download, TrendingUp, TrendingDown, Activity, Clock, CheckCircle, FileText, Calendar, Star, Truck } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area, LineChart, Line } from 'recharts';
import { cn } from '../../lib/utils';
import toast from 'react-hot-toast';

const weeklyData = [
  { week: 'W1', present: 412, absent: 38 },
  { week: 'W2', present: 435, absent: 15 },
  { week: 'W3', present: 398, absent: 52 },
  { week: 'W4', present: 442, absent: 8 },
];

const hourlyData = [
  { time: '6AM', vehicles: 2 },
  { time: '7AM', vehicles: 12 },
  { time: '8AM', vehicles: 8 },
  { time: '1PM', vehicles: 3 },
  { time: '3PM', vehicles: 14 },
  { time: '4PM', vehicles: 5 },
];

const driverPerformance = [
  { name: 'Ramesh', rating: 4.8, safety: 99 },
  { name: 'Suresh', rating: 4.5, safety: 96 },
  { name: 'Vijay', rating: 4.9, safety: 100 },
  { name: 'Mohan', rating: 4.2, safety: 92 },
  { name: 'Anil', rating: 4.7, safety: 98 },
];

const tripSuccess = [
  { day: 'Mon', success: 98, delayed: 2 },
  { day: 'Tue', success: 99, delayed: 1 },
  { day: 'Wed', success: 97, delayed: 3 },
  { day: 'Thu', success: 96, delayed: 4 },
  { day: 'Fri', success: 99, delayed: 1 },
];

const kpis = [
  { label: 'Total Trips Completed', value: '1,284', trend: '+12%', isPositive: true, icon: Activity },
  { label: 'Average Attendance', value: '94.2%', trend: '+2.4%', isPositive: true, icon: CheckCircle },
  { label: 'On-Time Performance', value: '97.8%', trend: '-0.5%', isPositive: false, icon: Clock },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload?.length) {
    return (
      <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md p-3 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="text-sm font-bold text-gray-900 dark:text-white mb-2">{label}</p>
        {payload?.map((entry, index) => (
          <p key={index} className="text-xs font-semibold flex items-center justify-between gap-4" style={{ color: entry.color }}>
            <span>{entry.name}:</span>
            <span>{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function InstitutionReports() {
  const handleExport = () => {
    toast.success('Report generation started. We will email you the PDF.', { icon: '📊' });
  };

  return (
    <DashboardLayout>
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 max-w-6xl mx-auto"
      >
        <div>
          <h1 className="text-2xl font-display font-semibold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <BarChartIcon className="w-6 h-6 text-primary-500" /> Operational Analytics
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Monthly performance KPIs, attendance metrics, and compliance reports</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-medium bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-800">
            <Calendar className="w-4 h-4 text-primary-500" /> June 2024
          </div>
          <Button onClick={handleExport} className="bg-primary-600 hover:bg-primary-700 text-white shadow-sm">
            <Download className="w-4 h-4 mr-2" /> Export PDF
          </Button>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto space-y-6">
        <div className="grid md:grid-cols-3 gap-5">
          {kpis?.map((kpi, i) => {
            const Icon = kpi.icon;
            return (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={kpi.label}>
                <Card className="p-5 md:p-6 bg-white/70 dark:bg-[#09090b]/70 backdrop-blur-xl border-gray-200/50 dark:border-dark-border/50 relative overflow-hidden group hover:shadow-md transition-all">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-primary-500/10 transition-colors" />
                  
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className={cn(
                      "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md",
                      kpi.isPositive ? "text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10" : "text-orange-700 bg-orange-50 dark:text-orange-400 dark:bg-orange-500/10"
                    )}>
                      {kpi.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {kpi.trend}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-3xl font-display font-black text-gray-900 dark:text-white tracking-tight mb-1">{kpi.value}</h3>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{kpi.label}</p>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="lg:col-span-2">
            <Card className="h-full p-6 bg-white/70 dark:bg-[#09090b]/70 backdrop-blur-xl border-gray-200/50 dark:border-dark-border/50">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white">Student Attendance (Weekly)</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Comparison of present vs absent students</p>
                </div>
              </div>
              
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" strokeOpacity={0.5} />
                    <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                    <Bar dataKey="present" fill="#10b981" radius={[6, 6, 0, 0]} name="Present" maxBarSize={40} />
                    <Bar dataKey="absent" fill="#ef4444" radius={[6, 6, 0, 0]} name="Absent" maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
            <Card className="h-full p-6 bg-white/70 dark:bg-[#09090b]/70 backdrop-blur-xl border-gray-200/50 dark:border-dark-border/50">
              <div className="mb-6">
                <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white">Fleet Utilization</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Active vehicles by hour</p>
              </div>
              
              <div className="h-[200px] w-full mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={hourlyData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorVehicles" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" strokeOpacity={0.5} />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="vehicles" name="Active Vehicles" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorVehicles)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">Peak Hour Summary</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Highest fleet utilization occurs between 7 AM and 8 AM.</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} className="lg:col-span-2">
            <Card className="h-full p-6 bg-white/70 dark:bg-[#09090b]/70 backdrop-blur-xl border-gray-200/50 dark:border-dark-border/50">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white">Driver Performance</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Safety scores and ratings by driver</p>
                </div>
              </div>
              
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={driverPerformance} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e5e7eb" strokeOpacity={0.5} />
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                    <Bar dataKey="safety" fill="#6366f1" radius={[0, 4, 4, 0]} name="Safety Score" maxBarSize={15} />
                    <Bar dataKey="rating" fill="#f59e0b" radius={[0, 4, 4, 0]} name="Rating (x10)" maxBarSize={15} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }}>
            <Card className="h-full p-6 bg-white/70 dark:bg-[#09090b]/70 backdrop-blur-xl border-gray-200/50 dark:border-dark-border/50">
              <div className="mb-6">
                <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white">Trip Success Rate</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Daily success vs delays (%)</p>
              </div>
              
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={tripSuccess} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" strokeOpacity={0.5} />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="success" name="Success %" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="delayed" name="Delayed %" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
