import DashboardLayout from '../../components/shared/DashboardLayout';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { motion } from 'framer-motion';
import { Users, Search, Filter, MoreHorizontal, User, Truck, Building, ShieldAlert } from 'lucide-react';
import { cn } from '../../lib/utils';

const users = [
  { id: 1, name: 'Rajesh Sharma', email: 'rajesh@email.com', role: 'PARENT', phone: '9876543210', children: 2, joined: '2024-01-15', status: 'ACTIVE' },
  { id: 2, name: 'Ravi Kumar', email: 'ravi@driver.com', role: 'DRIVER', phone: '9123456789', trips: 156, joined: '2024-02-01', status: 'ACTIVE' },
  { id: 3, name: 'St. Mary\'s School', email: 'school@mary.edu', role: 'INSTITUTION', phone: '9000000001', students: 48, joined: '2024-01-01', status: 'ACTIVE' },
  { id: 4, name: 'Amit Singh', email: 'amit@driver.com', role: 'DRIVER', phone: '9123456780', trips: 42, joined: '2024-03-10', status: 'PENDING' },
];

const roleStyles = { 
  PARENT: { color: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-500/20 border-blue-200 dark:border-blue-500/30', icon: User },
  DRIVER: { color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-500/20 border-emerald-200 dark:border-emerald-500/30', icon: Truck },
  INSTITUTION: { color: 'text-purple-700 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-500/20 border-purple-200 dark:border-purple-500/30', icon: Building },
  ADMIN: { color: 'text-red-700 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-500/20 border-red-200 dark:border-red-500/30', icon: ShieldAlert }
};

export default function AdminUsers() {
  return (
    <DashboardLayout>
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6"
      >
        <div>
          <h1 className="text-2xl font-display font-semibold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-primary-500" /> User Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Directory of all registered users across the platform</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search users..." 
              className="h-10 pl-9 pr-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            />
          </div>
          <Button variant="outline" className="h-10 border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="bg-white/50 dark:bg-[#09090b]/50 backdrop-blur-xl border-gray-200/50 dark:border-dark-border/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800/50">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Details</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                {users?.map((u, i) => {
                  const RoleIcon = roleStyles[u.role]?.icon || User;
                  return (
                    <motion.tr 
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      key={u.id} 
                      className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-indigo-600 flex items-center justify-center text-white font-bold shadow-sm ring-2 ring-white dark:ring-gray-900">
                            {u.name[0]}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors">{u.name}</p>
                            <p className="text-xs text-gray-500">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={cn("px-2.5 py-1 text-xs border font-medium flex w-fit items-center gap-1.5", roleStyles[u.role]?.bg, roleStyles[u.role]?.color)}>
                          <RoleIcon className="w-3 h-3" /> {u.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {u.phone}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 font-medium">
                        {u.children && <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {u.children} children</span>}
                        {u.trips && <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5" /> {u.trips} trips</span>}
                        {u.students && <span className="flex items-center gap-1"><Building className="w-3.5 h-3.5" /> {u.students} students</span>}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={cn(
                          "px-2 py-0.5 text-[11px] border font-bold uppercase tracking-wider",
                          u.status === 'ACTIVE' ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50" : "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800/50"
                        )}>
                          {u.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-gray-900 dark:hover:text-slate-900">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
}
