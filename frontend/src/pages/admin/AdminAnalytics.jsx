import DashboardLayout from '../../components/shared/DashboardLayout';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { motion } from 'framer-motion';
import { TrendingUp, Users, ShieldAlert, Activity, CheckCircle, Clock } from 'lucide-react';

const monthlyData = [
  { month: 'Jan', trips: 820, incidents: 2, newUsers: 45, revenue: 45000, efficiency: 88, fuel: 1200 },
  { month: 'Feb', trips: 932, incidents: 1, newUsers: 62, revenue: 52000, efficiency: 89, fuel: 1250 },
  { month: 'Mar', trips: 1100, incidents: 3, newUsers: 89, revenue: 61000, efficiency: 85, fuel: 1400 },
  { month: 'Apr', trips: 1050, incidents: 0, newUsers: 74, revenue: 58000, efficiency: 91, fuel: 1300 },
  { month: 'May', trips: 1245, incidents: 2, newUsers: 98, revenue: 69000, efficiency: 90, fuel: 1450 },
  { month: 'Jun', trips: 1380, incidents: 1, newUsers: 112, revenue: 76000, efficiency: 94, fuel: 1550 },
];

export default function AdminAnalytics() {
  return (
    <DashboardLayout>
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6"
      >
        <div>
          <h1 className="text-2xl font-display font-semibold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary-500" /> Platform Analytics
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Platform performance, growth, and safety metrics</p>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
          <Card className="bg-white/50 dark:bg-[#09090b]/50 backdrop-blur-xl border-gray-200/50 dark:border-dark-border/50 h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-gray-800 dark:text-gray-200">
                <TrendingUp className="w-5 h-5 text-blue-500" /> Monthly Trips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorTrips" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                    <XAxis dataKey="month" tick={{fontSize:12, fill: '#6b7280'}} axisLine={false} tickLine={false} />
                    <YAxis tick={{fontSize:12, fill: '#6b7280'}} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.9)', borderColor: 'rgba(55, 65, 81, 0.5)', borderRadius: '8px', color: '#fff' }} 
                      itemStyle={{ color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="trips" stroke="#3b82f6" strokeWidth={3} fill="url(#colorTrips)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
          <Card className="bg-white/50 dark:bg-[#09090b]/50 backdrop-blur-xl border-gray-200/50 dark:border-dark-border/50 h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-gray-800 dark:text-gray-200">
                <Users className="w-5 h-5 text-emerald-500" /> New Registrations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                    <XAxis dataKey="month" tick={{fontSize:12, fill: '#6b7280'}} axisLine={false} tickLine={false} />
                    <YAxis tick={{fontSize:12, fill: '#6b7280'}} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.9)', borderColor: 'rgba(55, 65, 81, 0.5)', borderRadius: '8px', color: '#fff' }} 
                      cursor={{ fill: 'rgba(156, 163, 175, 0.1)' }}
                    />
                    <Bar dataKey="newUsers" fill="#10b981" radius={[4,4,0,0]} name="New Users" maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
          <Card className="bg-white/50 dark:bg-[#09090b]/50 backdrop-blur-xl border-gray-200/50 dark:border-dark-border/50 h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-gray-800 dark:text-gray-200">
                <ShieldAlert className="w-5 h-5 text-red-500" /> Safety Incidents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                    <XAxis dataKey="month" tick={{fontSize:12, fill: '#6b7280'}} axisLine={false} tickLine={false} />
                    <YAxis tick={{fontSize:12, fill: '#6b7280'}} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.9)', borderColor: 'rgba(55, 65, 81, 0.5)', borderRadius: '8px', color: '#fff' }} 
                    />
                    <Line type="monotone" dataKey="incidents" stroke="#ef4444" strokeWidth={3} dot={{ fill: '#ef4444', r: 4, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} name="Incidents" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* New Graph: Monthly Revenue */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
          <Card className="bg-white/50 dark:bg-[#09090b]/50 backdrop-blur-xl border-gray-200/50 dark:border-dark-border/50 h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-gray-800 dark:text-gray-200">
                <Activity className="w-5 h-5 text-indigo-500" /> Monthly Revenue (₹)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                    <XAxis dataKey="month" tick={{fontSize:12, fill: '#6b7280'}} axisLine={false} tickLine={false} />
                    <YAxis tick={{fontSize:12, fill: '#6b7280'}} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.9)', borderColor: 'rgba(55, 65, 81, 0.5)', borderRadius: '8px', color: '#fff' }} />
                    <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fill="url(#colorRev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* New Graph: Route Efficiency & Fuel */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}>
          <Card className="bg-white/50 dark:bg-[#09090b]/50 backdrop-blur-xl border-gray-200/50 dark:border-dark-border/50 h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-gray-800 dark:text-gray-200">
                <Activity className="w-5 h-5 text-emerald-600" /> Efficiency & Fuel (L)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                    <XAxis dataKey="month" tick={{fontSize:12, fill: '#6b7280'}} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="left" tick={{fontSize:12, fill: '#6b7280'}} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="right" orientation="right" tick={{fontSize:12, fill: '#6b7280'}} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.9)', borderColor: 'rgba(55, 65, 81, 0.5)', borderRadius: '8px', color: '#fff' }} />
                    <Line yAxisId="left" type="monotone" dataKey="efficiency" name="Efficiency (%)" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    <Line yAxisId="right" type="monotone" dataKey="fuel" name="Fuel (Liters)" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }} className="md:col-span-2">
          <Card className="bg-white/50 dark:bg-[#09090b]/50 backdrop-blur-xl border-gray-200/50 dark:border-dark-border/50 h-full">
            <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-800/50">
              <CardTitle className="text-lg flex items-center gap-2 text-gray-800 dark:text-gray-200">
                <Activity className="w-5 h-5 text-purple-500" /> Key Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {[
                  { label: 'Total Trips Completed', value: '15,643', pct: '99.7%', sublabel: 'completion rate', icon: CheckCircle, color: 'text-emerald-500' },
                  { label: 'Avg Response Time', value: '< 2 min', pct: '97%', sublabel: 'within SLA', icon: Clock, color: 'text-blue-500' },
                  { label: 'Parent Satisfaction', value: '4.8 / 5', pct: '96%', sublabel: 'positive ratings', icon: Users, color: 'text-purple-500' },
                  { label: 'Safety Score', value: 'A+', pct: '98.9%', sublabel: 'incident-free trips', icon: ShieldAlert, color: 'text-orange-500' },
                ].map((m, i) => (
                  <div key={m.label} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center ${m.color}`}>
                        <m.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover:text-primary-500 transition-colors">{m.label}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{m.sublabel}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-display font-bold text-gray-900 dark:text-white">{m.value}</p>
                      <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">{m.pct}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
