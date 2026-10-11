import { useState } from 'react';
import DashboardLayout from '../../components/shared/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquareWarning, Search, Filter, AlertTriangle, AlertCircle, Phone, CheckCircle, User, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '../../lib/utils';

const mockComplaints = [
  { id: 1, from: 'Rajesh Sharma (Parent)', type: 'LATE_PICKUP', subject: 'Driver arrived 30 min late consistently', driver: 'Ravi Kumar', status: 'OPEN', date: '2024-06-18', priority: 'HIGH' },
  { id: 2, from: 'Priya Patel (Parent)', type: 'VEHICLE_CONDITION', subject: 'AC not working in vehicle', driver: 'Mohan Das', status: 'IN_REVIEW', date: '2024-06-19', priority: 'MEDIUM' },
  { id: 3, from: 'St. Mary\'s School', type: 'DRIVER_BEHAVIOR', subject: 'Driver was rude to children', driver: 'Suresh Kumar', status: 'RESOLVED', date: '2024-06-10', priority: 'HIGH' },
];

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState(mockComplaints);
  const resolve = (id) => { setComplaints(p => p?.map(c => c.id === id ? { ...c, status: 'RESOLVED' } : c)); toast.success('Complaint marked as resolved'); };
  
  return (
    <DashboardLayout>
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6"
      >
        <div>
          <h1 className="text-2xl font-display font-semibold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <MessageSquareWarning className="w-6 h-6 text-primary-500" /> Complaints Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Review, manage, and resolve user complaints across the platform</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search complaints..." 
              className="h-10 pl-9 pr-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            />
          </div>
          <Button variant="outline" className="h-10 border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>
        </div>
      </motion.div>

      <div className="space-y-4">
        <AnimatePresence>
          {complaints?.map((c, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              key={c.id} 
            >
              <Card className="bg-white/50 dark:bg-[#09090b]/50 backdrop-blur-xl border-gray-200/50 dark:border-dark-border/50 p-6 overflow-hidden relative group">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold border bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-800/50">
                        {c.type.replace(/_/g,' ')}
                      </Badge>
                      <Badge variant="outline" className={cn(
                        "px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold border flex items-center gap-1",
                        c.priority === 'HIGH' ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-800/50" : "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-800/50"
                      )}>
                        {c.priority === 'HIGH' ? <AlertTriangle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />} {c.priority} Priority
                      </Badge>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{c.subject}</h3>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1.5 font-medium"><User className="w-4 h-4 text-slate-500" /> {c.from}</span>
                      <span className="hidden md:inline text-slate-600 dark:text-gray-600">•</span>
                      <span className="flex items-center gap-1.5 font-medium">Re: <span className="text-primary-600 dark:text-primary-400">{c.driver}</span></span>
                      <span className="hidden md:inline text-slate-600 dark:text-gray-600">•</span>
                      <span className="flex items-center gap-1.5 font-medium"><Clock className="w-4 h-4 text-slate-500" /> {c.date}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-4 shrink-0">
                    <Badge variant="outline" className={cn(
                      "px-3 py-1 text-xs border font-bold uppercase tracking-wider flex items-center gap-1.5",
                      c.status === 'RESOLVED' ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50" : 
                      c.status === 'IN_REVIEW' ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/50" :
                      "bg-gray-100 dark:bg-gray-800/50 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700"
                    )}>
                      {c.status === 'RESOLVED' && <CheckCircle className="w-3.5 h-3.5" />}
                      {c.status === 'OPEN' && <AlertCircle className="w-3.5 h-3.5" />}
                      {c.status.replace('_', ' ')}
                    </Badge>
                    
                    {c.status !== 'RESOLVED' && (
                      <div className="flex items-center gap-2 mt-auto">
                        <Button variant="outline" size="sm" className="h-9 px-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50">
                          <Phone className="w-4 h-4 mr-2" /> Contact Driver
                        </Button>
                        <Button size="sm" onClick={() => resolve(c.id)} className="h-9 px-3 bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm">
                          <CheckCircle className="w-4 h-4 mr-2" /> Mark Resolved
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
