import { useState } from 'react';
import DashboardLayout from '../../components/shared/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquareWarning, Plus, Search, Filter, MessageCircle, Clock, CheckCircle, ShieldAlert, AlertCircle, Calendar, MessageSquare, ChevronRight, CornerDownRight, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '../../lib/utils';

const complaintTypes = ['DRIVER_BEHAVIOR','VEHICLE_CONDITION','LATE_PICKUP','LATE_DROP','ROUTE_ISSUE','SAFETY_CONCERN','OTHER'];

const mockComplaints = [
  { id: 1, type: 'LATE_PICKUP', subject: 'Driver arrived 30 minutes late', description: 'The bus was scheduled for 7:15 AM but arrived at 7:45 AM without any prior notification. This caused my child to be late for school assembly.', status: 'RESOLVED', date: '2024-06-15', response: 'We sincerely apologize for the delay. The driver encountered unexpected road closures, but failed to notify the system. We have counseled the driver on communication protocols.', responseDate: '2024-06-16' },
  { id: 2, type: 'VEHICLE_CONDITION', subject: 'AC not working in vehicle', description: 'My child complained that the AC was not functioning during the afternoon drop-off. The vehicle gets very hot and uncomfortable.', status: 'IN_REVIEW', date: '2024-06-18', response: null, responseDate: null },
  { id: 3, type: 'SAFETY_CONCERN', subject: 'Speeding on highway', description: 'According to the live tracker, the vehicle was going 80km/h in a 60km/h zone on ring road.', status: 'OPEN', date: 'Today', response: null, responseDate: null },
];

const statusConfig = {
  OPEN: { color: 'text-orange-700 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-500/20 border-orange-200 dark:border-orange-500/30', icon: AlertCircle, label: 'Action Required' },
  IN_REVIEW: { color: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-500/20 border-blue-200 dark:border-blue-500/30', icon: Clock, label: 'Under Review' },
  RESOLVED: { color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-500/20 border-emerald-200 dark:border-emerald-500/30', icon: CheckCircle, label: 'Resolved' },
};

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState(mockComplaints);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('ALL');
  const [form, setForm] = useState({ type: 'DRIVER_BEHAVIOR', subject: '', description: '' });

  const submit = (e) => {
    e.preventDefault();
    setComplaints(p => [{ ...form, id: Date.now(), status: 'OPEN', date: 'Just now', response: null, responseDate: null }, ...p]);
    setForm({ type: 'DRIVER_BEHAVIOR', subject: '', description: '' });
    setShowForm(false);
    toast.success('Complaint submitted. Our team will review this within 24 hours.', { icon: '📝' });
  };

  const filteredComplaints = filter === 'ALL' ? complaints : complaints.filter(c => c.status === filter);

  return (
    <DashboardLayout>
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 max-w-5xl mx-auto"
      >
        <div>
          <h1 className="text-2xl font-display font-semibold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <MessageSquareWarning className="w-6 h-6 text-primary-500" /> Support Tickets
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Report issues, track resolution status, and view administration responses</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-1 rounded-xl border border-gray-200 dark:border-gray-800">
            {['ALL', 'OPEN', 'IN_REVIEW', 'RESOLVED'].map(f => (
              <button 
                key={f} 
                onClick={() => setFilter(f)} 
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                  filter === f ? "bg-primary-500 text-white shadow-sm" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
              >
                {f.replace('_', ' ')}
              </button>
            ))}
          </div>
          <Button onClick={() => setShowForm(!showForm)} className={cn(
            "shadow-sm transition-all",
            showForm ? "bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white" : "bg-primary-600 hover:bg-primary-700 text-white"
          )}>
            {showForm ? 'Cancel' : <><Plus className="w-4 h-4 mr-2" /> New Ticket</>}
          </Button>
        </div>
      </motion.div>

      <div className="max-w-5xl mx-auto space-y-6">
        <AnimatePresence>
          {showForm && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }} 
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <Card className="bg-white/70 dark:bg-[#09090b]/70 backdrop-blur-xl border-gray-200/50 dark:border-dark-border/50 overflow-hidden shadow-md mb-6">
                <form onSubmit={submit} className="p-6">
                  <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100 dark:border-gray-800/50">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-5 h-5 text-primary-500" />
                      <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white">Submit New Issue</h3>
                    </div>
                  </div>
                  
                  <div className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Issue Category</label>
                        <select className="w-full h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 focus:ring-2 focus:ring-primary-500/20 outline-none text-sm appearance-none" value={form.type} onChange={e => setForm(p => ({...p, type: e.target.value}))}>
                          {complaintTypes?.map(t => <option key={t} value={t}>{t.replace(/_/g,' ')}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Subject</label>
                        <input className="w-full h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 focus:ring-2 focus:ring-primary-500/20 outline-none text-sm" value={form.subject} onChange={e => setForm(p => ({...p, subject: e.target.value}))} required placeholder="Brief description of the issue" />
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Detailed Description</label>
                      <textarea className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 focus:ring-2 focus:ring-primary-500/20 outline-none text-sm resize-none" rows={4} value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} required placeholder="Please provide specific details about your concern..." />
                    </div>
                  </div>
                  
                  <div className="flex gap-3 mt-6 pt-2">
                    <Button type="button" onClick={() => setShowForm(false)} variant="outline" className="bg-white/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800">Cancel</Button>
                    <Button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white shadow-sm px-6">Submit Ticket</Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-4">
          <AnimatePresence>
            {filteredComplaints?.map((c, i) => {
              const status = statusConfig[c.status];
              const StatusIcon = status.icon;
              
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.05 }}
                  key={c.id} 
                >
                  <Card className="bg-white/70 dark:bg-[#09090b]/70 backdrop-blur-xl border-gray-200/50 dark:border-dark-border/50 overflow-hidden relative group hover:shadow-md transition-all">
                    <div className="p-5 md:p-6">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-mono font-bold text-slate-500 dark:text-gray-500 tracking-wider">#TCK-{c.id.toString().padStart(4, '0')}</span>
                            <Badge variant="outline" className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold border bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700">
                              {c.type.replace(/_/g,' ')}
                            </Badge>
                          </div>
                          
                          <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white mb-1 group-hover:text-primary-600 transition-colors">{c.subject}</h3>
                          
                          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 font-medium">
                            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Submitted: {c.date}</span>
                          </div>
                        </div>
                        
                        <Badge variant="outline" className={cn("px-2.5 py-1 text-[11px] uppercase tracking-wider font-bold border flex items-center gap-1.5 w-fit shrink-0", status.bg, status.color)}>
                          <StatusIcon className="w-3.5 h-3.5" /> {status.label}
                        </Badge>
                      </div>
                      
                      <div className="bg-gray-50/50 dark:bg-gray-800/30 rounded-xl p-4 mb-4 border border-gray-100 dark:border-gray-800">
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                          {c.description || <span className="italic text-slate-500">No additional details provided.</span>}
                        </p>
                      </div>
                      
                      {c.response && (
                        <div className="relative pl-6">
                          <CornerDownRight className="w-5 h-5 absolute left-0 top-3 text-emerald-500 dark:text-emerald-600" />
                          <div className="bg-emerald-50/80 dark:bg-emerald-900/10 rounded-xl p-4 border border-emerald-100 dark:border-emerald-900/30">
                            <div className="flex items-center gap-2 mb-2">
                              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
                              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Admin Response</span>
                              {c.responseDate && <span className="text-[10px] text-emerald-600/60 dark:text-emerald-400/60 ml-auto">{c.responseDate}</span>}
                            </div>
                            <p className="text-sm text-emerald-800 dark:text-emerald-300 leading-relaxed">
                              {c.response}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
          
          {filteredComplaints?.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                <MessageSquareWarning className="w-8 h-8 text-slate-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No Tickets Found</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-1">You don't have any support tickets matching the selected filter.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
