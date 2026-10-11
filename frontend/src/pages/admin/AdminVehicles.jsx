import DashboardLayout from '../../components/shared/DashboardLayout';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { motion } from 'framer-motion';
import { Car, Search, Filter, MoreHorizontal, User, MapPin, Bus, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

const vehicles = [
  { id: 1, regNo: 'KA 01 AB 1234', driver: 'Ravi Kumar', make: 'Tata Winger', type: 'VAN', seats: 12, overallStatus: 'APPROVED', city: 'Bangalore' },
  { id: 2, regNo: 'KA 02 CD 5678', driver: 'Mohan Das', make: 'Force Traveller', type: 'MINI_BUS', seats: 16, overallStatus: 'APPROVED', city: 'Bangalore' },
  { id: 3, regNo: 'KA 03 EF 9012', driver: 'Suresh Kumar', make: 'Piaggio Ape', type: 'AUTO', seats: 6, overallStatus: 'PENDING', city: 'Mysore' },
];

export default function AdminVehicles() {
  return (
    <DashboardLayout>
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6"
      >
        <div>
          <h1 className="text-2xl font-display font-semibold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <Car className="w-6 h-6 text-primary-500" /> Vehicle Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Fleet overview and document verification across all cities</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search registration..." 
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
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Vehicle</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Driver</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Specifications</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                {vehicles?.map((v, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    key={v.id} 
                    className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20 group-hover:text-primary-600 transition-colors">
                          <Bus className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-mono font-bold text-gray-900 dark:text-white">{v.regNo}</p>
                          <p className="text-xs text-gray-500 font-medium">{v.make}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-slate-500" /> {v.driver}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5">
                        <Badge variant="outline" className="w-fit px-2 py-0.5 text-[10px] uppercase tracking-wider bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/30">
                          {v.type}
                        </Badge>
                        <p className="text-xs text-gray-500 font-medium">{v.seats} Seats</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-500" /> {v.city}</span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className={cn(
                        "px-2 py-0.5 text-[11px] border font-bold uppercase tracking-wider flex w-fit items-center gap-1",
                        v.overallStatus === 'APPROVED' ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50" : "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800/50"
                      )}>
                        {v.overallStatus === 'APPROVED' ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                        {v.overallStatus}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-gray-900 dark:hover:text-slate-900">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
}
