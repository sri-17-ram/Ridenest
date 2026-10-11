import { useState } from 'react';
import DashboardLayout from '../../components/shared/DashboardLayout';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { motion } from 'framer-motion';
import { Building, Search, Filter, MoreHorizontal, CheckCircle, XCircle, Users, MapPin, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '../../lib/utils';

const mockInstitutions = [
  { id: 1, name: "St. Mary's School", type: 'SCHOOL', city: 'Bangalore', approvalStatus: 'APPROVED', students: 48, registrationNumber: 'REG001' },
  { id: 2, name: 'Little Stars Daycare', type: 'DAYCARE', city: 'Bangalore', approvalStatus: 'APPROVED', students: 22, registrationNumber: 'REG002' },
  { id: 3, name: 'Champion Cricket Academy', type: 'SPORTS_ACADEMY', city: 'Mysore', approvalStatus: 'PENDING', students: 0, registrationNumber: 'REG003' },
  { id: 4, name: 'Melody Music School', type: 'MUSIC_CLASS', city: 'Bangalore', approvalStatus: 'PENDING', students: 0, registrationNumber: 'REG004' },
];

const typeStyles = {
  SCHOOL: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200 dark:border-blue-800/50',
  DAYCARE: 'bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400 border-purple-200 dark:border-purple-800/50',
  SPORTS_ACADEMY: 'bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400 border-orange-200 dark:border-orange-800/50',
  MUSIC_CLASS: 'bg-pink-50 text-pink-700 dark:bg-pink-500/10 dark:text-pink-400 border-pink-200 dark:border-pink-800/50',
};

export default function AdminInstitutions() {
  const [institutions, setInstitutions] = useState(mockInstitutions);
  const approve = (id, status) => { setInstitutions(p => p?.map(i => i.id === id ? { ...i, approvalStatus: status } : i)); toast.success(`Institution ${status.toLowerCase()}`); };
  
  return (
    <DashboardLayout>
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6"
      >
        <div>
          <h1 className="text-2xl font-display font-semibold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <Building className="w-6 h-6 text-primary-500" /> Partner Institutions
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Approve and manage partner institutions across all regions</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search institutions..." 
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
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Institution Name</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Location & Reg</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Students</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                {institutions?.map((inst, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    key={inst.id} 
                    className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20 group-hover:text-primary-600 transition-colors">
                          <Building className="w-5 h-5" />
                        </div>
                        <p className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors">{inst.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className={cn("px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold border", typeStyles[inst.type] || typeStyles.SCHOOL)}>
                        {inst.type.replace(/_/g, ' ')}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-1.5 font-medium"><MapPin className="w-3.5 h-3.5 text-slate-500" /> {inst.city}</span>
                        <span className="text-[11px] font-mono text-gray-500">{inst.registrationNumber}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-slate-500" /> {inst.students}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className={cn(
                        "px-2 py-0.5 text-[11px] border font-bold uppercase tracking-wider flex w-fit items-center gap-1",
                        inst.approvalStatus === 'APPROVED' ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50" : 
                        inst.approvalStatus === 'PENDING' ? "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800/50" :
                        "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800/50"
                      )}>
                        {inst.approvalStatus === 'APPROVED' ? <CheckCircle className="w-3 h-3" /> : inst.approvalStatus === 'REJECTED' ? <XCircle className="w-3 h-3" /> : null}
                        {inst.approvalStatus}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {inst.approvalStatus === 'PENDING' ? (
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => approve(inst.id, 'APPROVED')} 
                            className="h-8 bg-emerald-500 hover:bg-emerald-600 text-white px-3 shadow-sm"
                          >
                            <Check className="w-3.5 h-3.5 mr-1" /> Approve
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => approve(inst.id, 'REJECTED')} 
                            className="h-8 px-3 shadow-sm"
                          >
                            <X className="w-3.5 h-3.5 mr-1" /> Reject
                          </Button>
                        </div>
                      ) : (
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-gray-900 dark:hover:text-slate-900">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      )}
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
