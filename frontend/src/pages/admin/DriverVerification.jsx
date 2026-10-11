import { useState } from 'react';
import DashboardLayout from '../../components/shared/DashboardLayout';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Search, Filter, MoreHorizontal, CheckCircle, XCircle, MapPin, Truck, Clock, Check, X, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '../../lib/utils';

const mockDrivers = [
  { id: 1, name: 'Suresh Kumar', email: 'suresh@driver.com', phone: '9876543210', city: 'Bangalore', licenseNo: 'KA1234567', overallStatus: 'PENDING', submittedDays: 2, totalTrips: 0, rating: 5.0 },
  { id: 2, name: 'Mohan Rao', email: 'mohan@driver.com', phone: '9876543211', city: 'Mysore', licenseNo: 'KA9876543', overallStatus: 'PENDING', submittedDays: 4, totalTrips: 0, rating: 5.0 },
  { id: 3, name: 'Ravi Kumar', email: 'ravi@driver.com', phone: '9123456789', city: 'Bangalore', licenseNo: 'KA1111111', overallStatus: 'APPROVED', submittedDays: 30, totalTrips: 156, rating: 4.9 },
  { id: 4, name: 'Ramesh Nair', email: 'ramesh@driver.com', phone: '9876543212', city: 'Bangalore', licenseNo: 'KA5555555', overallStatus: 'REJECTED', submittedDays: 10, totalTrips: 0, rating: 5.0 },
];

export default function DriverVerification() {
  const [drivers, setDrivers] = useState(mockDrivers);
  const [filter, setFilter] = useState('ALL');

  const verify = (id, status) => {
    setDrivers(prev => prev?.map(d => d.id === id ? { ...d, overallStatus: status } : d));
    toast.success(`Driver ${status.toLowerCase()}`);
  };

  const filtered = filter === 'ALL' ? drivers : drivers.filter(d => d.overallStatus === filter);

  return (
    <DashboardLayout>
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6"
      >
        <div>
          <h1 className="text-2xl font-display font-semibold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-primary-500" /> Driver Verification
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Review, approve, and manage driver background checks</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-1 rounded-xl border border-gray-200 dark:border-gray-800">
          {['ALL','PENDING','APPROVED','REJECTED'].map(f => (
            <button 
              key={f} 
              onClick={() => setFilter(f)} 
              className={cn(
                "px-4 py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-wider",
                filter === f ? "bg-primary-500 text-white shadow-md shadow-primary-500/20" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="bg-white/50 dark:bg-[#09090b]/50 backdrop-blur-xl border-gray-200/50 dark:border-dark-border/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800/50">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Applicant</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contact & Location</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Credentials</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Activity</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                <AnimatePresence>
                  {filtered?.map((driver, i) => (
                    <motion.tr 
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.05 }}
                      key={driver.id} 
                      className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold shadow-sm ring-2 ring-white dark:ring-gray-900">
                            {driver.name[0]}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors">{driver.name}</p>
                            <p className="text-xs text-gray-500">{driver.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{driver.phone}</span>
                          <span className="text-xs text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3" /> {driver.city}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className="px-2.5 py-1 text-[10px] font-mono tracking-wider bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700">
                          {driver.licenseNo}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5"><Truck className="w-3.5 h-3.5 text-slate-500" /> {driver.totalTrips} Trips</span>
                          <span className="text-xs text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {driver.submittedDays}d ago</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={cn(
                          "px-2 py-0.5 text-[11px] border font-bold uppercase tracking-wider flex w-fit items-center gap-1",
                          driver.overallStatus === 'APPROVED' ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50" : 
                          driver.overallStatus === 'PENDING' ? "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800/50" :
                          "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800/50"
                        )}>
                          {driver.overallStatus === 'APPROVED' ? <CheckCircle className="w-3 h-3" /> : driver.overallStatus === 'REJECTED' ? <XCircle className="w-3 h-3" /> : null}
                          {driver.overallStatus}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {driver.overallStatus === 'PENDING' && (
                          <div className="flex items-center justify-end gap-2">
                            <Button size="sm" onClick={() => verify(driver.id, 'APPROVED')} className="h-8 bg-emerald-500 hover:bg-emerald-600 text-white px-3 shadow-sm">
                              <Check className="w-3.5 h-3.5 mr-1" /> Approve
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => verify(driver.id, 'REJECTED')} className="h-8 px-3 shadow-sm">
                              <X className="w-3.5 h-3.5 mr-1" /> Reject
                            </Button>
                          </div>
                        )}
                        {driver.overallStatus === 'APPROVED' && (
                          <span className="text-xs font-semibold text-emerald-600 flex items-center justify-end gap-1"><ShieldCheck className="w-4 h-4" /> Verified</span>
                        )}
                        {driver.overallStatus === 'REJECTED' && (
                          <Button variant="outline" size="sm" onClick={() => verify(driver.id, 'PENDING')} className="h-8 text-orange-600 border-orange-200 hover:bg-orange-50">
                            Re-review
                          </Button>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {filtered?.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      No drivers found in this category.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
}
