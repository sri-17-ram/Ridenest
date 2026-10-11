import { useState } from 'react';
import DashboardLayout from '../../components/shared/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, Filter, ShieldCheck, Bus, MapPin, User, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import toast from 'react-hot-toast';

const mockStudents = [
  { id: 1, name: 'Aarav Sharma', grade: '5th Grade', section: 'A', status: 'IN_TRANSIT', route: 'Morning Pickup - Route A', bus: 'KA 01 AB 1234', driver: 'Ravi Kumar', pickupPoint: 'MG Road Junction' },
  { id: 2, name: 'Priya Patel', grade: '3rd Grade', section: 'C', status: 'AT_SCHOOL', route: 'Morning Pickup - Route A', bus: 'KA 01 AB 1234', driver: 'Ravi Kumar', pickupPoint: 'Indiranagar' },
  { id: 3, name: 'Rahul Verma', grade: '6th Grade', section: 'B', status: 'ABSENT', route: 'Morning Pickup - Route B', bus: 'KA 02 CD 5678', driver: 'Mohan Das', pickupPoint: 'Koramangala' },
  { id: 4, name: 'Ananya Menon', grade: '2nd Grade', section: 'A', status: 'AT_HOME', route: 'Evening Drop - Route C', bus: 'KA 03 EF 9012', driver: 'Suresh Patil', pickupPoint: 'HSR Layout' },
];

const statusStyles = {
  AT_HOME: { bg: 'bg-gray-100 dark:bg-gray-800', color: 'text-gray-700 dark:text-gray-400', border: 'border-gray-200 dark:border-gray-700' },
  IN_TRANSIT: { bg: 'bg-blue-100 dark:bg-blue-500/20', color: 'text-blue-700 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800/50' },
  AT_SCHOOL: { bg: 'bg-emerald-100 dark:bg-emerald-500/20', color: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800/50' },
  ABSENT: { bg: 'bg-red-100 dark:bg-red-500/20', color: 'text-red-700 dark:text-red-400', border: 'border-red-200 dark:border-red-800/50' },
};

export default function StudentTransport() {
  const [students] = useState(mockStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('ALL');

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.route.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'ALL' || s.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <DashboardLayout>
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 max-w-6xl mx-auto"
      >
        <div>
          <h1 className="text-2xl font-display font-semibold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-primary-500" /> Student Transport
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage and track transport assignments for all students</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button onClick={() => toast.success('Exporting student list...', { icon: '📄' })} variant="outline" className="bg-white/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 shadow-sm font-bold">
            Export List
          </Button>
          <Button onClick={() => toast.success('New assignment flow coming soon', { icon: '🚌' })} className="bg-primary-600 hover:bg-primary-700 text-white shadow-sm font-bold">
            New Assignment
          </Button>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="p-4 bg-white/70 dark:bg-[#09090b]/70 backdrop-blur-xl border-gray-200/50 dark:border-dark-border/50">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Search by student name, route, or stop..." 
                  className="w-full h-10 pl-9 pr-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 focus:ring-2 focus:ring-primary-500/20 outline-none text-sm transition-all"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-hide">
                <Filter className="w-4 h-4 text-slate-500 shrink-0 mr-1" />
                {['ALL', 'AT_HOME', 'IN_TRANSIT', 'AT_SCHOOL', 'ABSENT'].map(f => (
                  <button 
                    key={f} 
                    onClick={() => setFilter(f)} 
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 whitespace-nowrap",
                      filter === f ? "bg-primary-500 text-white shadow-sm" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                    )}
                  >
                    {f.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {filteredStudents?.map((student, i) => {
              const statusStyle = statusStyles[student.status];
              
              return (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: 0.15 + (i * 0.05) }}
                  key={student.id} 
                >
                  <Card className={cn(
                    "h-full flex flex-col bg-white/70 dark:bg-[#09090b]/70 backdrop-blur-xl border-gray-200/50 dark:border-dark-border/50 overflow-hidden relative group hover:shadow-md transition-all",
                    student.status === 'IN_TRANSIT' ? "border-l-4 border-l-blue-500" : ""
                  )}>
                    <div className="p-5 flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center text-white font-display font-bold text-xl flex-shrink-0 shadow-sm">
                            {student.name[0]}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 dark:text-white leading-tight group-hover:text-primary-600 transition-colors">{student.name}</h3>
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{student.grade} - Section {student.section}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <Badge variant="outline" className={cn("px-2.5 py-1 text-[11px] uppercase tracking-wider font-bold border", statusStyle.bg, statusStyle.color, statusStyle.border)}>
                          {student.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="bg-gray-50/80 dark:bg-gray-900/50 rounded-xl p-3 border border-gray-100 dark:border-gray-800">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> Assigned Route</p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{student.route}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{student.pickupPoint}</p>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs font-medium text-gray-600 dark:text-gray-300">
                          <span className="flex items-center gap-1.5"><Bus className="w-3.5 h-3.5 text-slate-500" /> {student.bus}</span>
                          <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-slate-500" /> {student.driver}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30">
                      <Button variant="ghost" className="w-full text-xs font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20 transition-all justify-between">
                        Manage Assignment <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
        
        {filteredStudents?.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4 border border-gray-200 dark:border-gray-700">
              <Users className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No Students Found</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Try adjusting your search query or status filter.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
