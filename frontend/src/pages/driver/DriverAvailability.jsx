import { useState } from 'react';
import DashboardLayout from '../../components/shared/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, AlertTriangle, Clock, Users, ArrowRight, ShieldAlert, History } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '../../lib/utils';

export default function DriverAvailability() {
  const [isAvailable, setIsAvailable] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [reason, setReason] = useState('');
  
  // Mock contingency logs
  const [logs, setLogs] = useState([
    { id: 1, date: '2023-10-15T08:30:00Z', type: 'SICK_LEAVE', status: 'RESOLVED', backupDriver: 'Suresh Kumar', route: 'Route A - Morning' },
  ]);

  const handleMarkUnavailable = () => {
    if (!reason) {
      toast.error('Please select a reason for unavailability.');
      return;
    }
    
    setIsAvailable(false);
    setShowConfirm(false);
    toast.error('Marked as Unavailable. Contingency workflow triggered.', {
      icon: '🚨',
      style: { background: '#ef4444', color: '#fff' }
    });
    
    // Simulate advanced contingency workflow requested in Phase 3
    setTimeout(() => {
      toast('Admin received emergency request.', { icon: '📨' });
      
      setTimeout(() => {
        toast('Searching for available backup driver...', { icon: '🔍' });
        
        setTimeout(() => {
          const foundBackup = Math.random() > 0.4;
          
          if (foundBackup) {
            toast.success('Backup driver assigned: Ramesh M. Parents notified.', { duration: 5000 });
            setLogs(prev => [{
              id: Date.now(),
              date: new Date().toISOString(),
              type: reason.toUpperCase().replace(' ', '_'),
              status: 'REASSIGNED',
              backupDriver: 'Ramesh M.',
              route: 'Today\'s Scheduled Routes'
            }, ...prev]);
          } else {
            toast.error('No backup found. Trip CANCELLED. Parents notified. No billing for today.', { duration: 6000, style: { background: '#ef4444', color: '#fff' } });
            setLogs(prev => [{
              id: Date.now(),
              date: new Date().toISOString(),
              type: reason.toUpperCase().replace(' ', '_'),
              status: 'CANCELLED',
              backupDriver: 'None',
              route: 'Today\'s Scheduled Routes'
            }, ...prev]);
          }
        }, 3000);
      }, 2000);
    }, 1500);
  };

  const handleMarkAvailable = () => {
    setIsAvailable(true);
    setReason('');
    toast.success('You are now marked as Available.');
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            Availability & Contingency
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your working status and emergency coverages</p>
        </div>
        <Badge className={cn("text-sm px-4 py-1.5", isAvailable ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400")}>
          Current Status: {isAvailable ? "🟢 AVAILABLE" : "🔴 UNAVAILABLE"}
        </Badge>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Status Control Panel */}
        <div className="space-y-6">
          <Card className="bg-white/50 dark:bg-[#09090b]/50 backdrop-blur-xl border-gray-200/50 dark:border-dark-border/50">
            <CardHeader>
              <CardTitle>Update Status</CardTitle>
              <CardDescription>If you are unable to drive, the system will automatically assign a backup.</CardDescription>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                {isAvailable ? (
                  <motion.div 
                    key="available"
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                    className="text-center py-8"
                  >
                    <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white dark:border-[#09090b] shadow-lg">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">You are Available</h3>
                    <p className="text-sm text-gray-500 mb-6">You will receive your regular trip assignments.</p>
                    <Button variant="destructive" className="w-full sm:w-auto shadow-glow-red" onClick={() => setShowConfirm(true)}>
                      <AlertTriangle className="w-4 h-4 mr-2" /> Mark as Unavailable (Emergency/Sick)
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="unavailable"
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                    className="text-center py-8"
                  >
                    <div className="w-20 h-20 bg-red-100 dark:bg-red-500/20 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white dark:border-[#09090b] shadow-lg animate-pulse">
                      <XCircle className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">You are Unavailable</h3>
                    <p className="text-sm text-gray-500 mb-6">Contingency workflows are active. A backup driver is handling your routes.</p>
                    <Button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white shadow-glow-emerald" onClick={handleMarkAvailable}>
                      <CheckCircle2 className="w-4 h-4 mr-2" /> I am ready to drive again
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Contingency Process Info */}
          <Card className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/30">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-blue-800 dark:text-blue-400">
                <ShieldAlert className="w-5 h-5" /> Automated Contingency Process
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-blue-200 dark:before:via-blue-800 before:to-transparent">
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">1</div>
                  <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-3 rounded-lg border border-blue-100 dark:border-blue-800/50 bg-white/50 dark:bg-dark-surface/50 shadow-sm text-sm">
                    Driver marks Unavailable
                  </div>
                </div>
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">2</div>
                  <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-3 rounded-lg border border-blue-100 dark:border-blue-800/50 bg-white/50 dark:bg-dark-surface/50 shadow-sm text-sm">
                    System finds nearby Backup Driver
                  </div>
                </div>
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">3</div>
                  <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-3 rounded-lg border border-blue-100 dark:border-blue-800/50 bg-white/50 dark:bg-dark-surface/50 shadow-sm text-sm">
                    Parents Notified & Billing Adjusted
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* History / Logs */}
        <div className="space-y-6">
          <Card className="bg-white/50 dark:bg-[#09090b]/50 backdrop-blur-xl border-gray-200/50 dark:border-dark-border/50 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><History className="w-5 h-5" /> Contingency Logs</CardTitle>
              <CardDescription>History of your unavailability and backup assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {logs?.map(log => (
                  <div key={log.id} className="p-4 rounded-xl border border-gray-100 dark:border-dark-border/50 bg-gray-50/50 dark:bg-dark-surface/50 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <Badge variant="outline" className="mb-1 bg-white dark:bg-gray-800">{log.type.replace('_', ' ')}</Badge>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{log.route}</p>
                      </div>
                        <Badge className={log.status === 'CANCELLED' ? "bg-red-100 text-red-700" : log.status === 'REASSIGNED' ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}>
                          {log.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500 border-t border-gray-200 dark:border-dark-border/50 pt-3">
                        <div className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {new Date(log.date).toLocaleDateString()}</div>
                        <div className={cn("flex items-center gap-1 font-medium", log.status === 'CANCELLED' ? "text-red-500" : "text-emerald-600 dark:text-emerald-400")}><ArrowRight className="w-3.5 h-3.5" /> {log.status === 'CANCELLED' ? 'Trip Cancelled' : `Handled by ${log.backupDriver}`}</div>
                      </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-white dark:bg-[#09090b] rounded-2xl shadow-2xl p-6 w-full max-w-md border border-gray-200 dark:border-dark-border"
            >
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Mark as Unavailable?</h2>
              <p className="text-sm text-gray-500 mb-6">This will trigger the automated contingency workflow. A backup driver will be assigned to your routes immediately.</p>
              
              <div className="space-y-4 mb-6">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Reason for Unavailability</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Sick Leave', 'Family Emergency', 'Vehicle Breakdown', 'Other'].map(r => (
                    <button
                      key={r}
                      onClick={() => setReason(r)}
                      className={cn(
                        "p-2 text-sm rounded-lg border text-left transition-colors",
                        reason === r 
                          ? "bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800" 
                          : "border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                      )}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setShowConfirm(false)}>Cancel</Button>
                <Button variant="destructive" className="flex-1 shadow-glow-red" onClick={handleMarkUnavailable}>Confirm</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
