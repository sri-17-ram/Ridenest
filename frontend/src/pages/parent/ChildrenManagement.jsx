import { useState } from 'react';
import DashboardLayout from '../../components/shared/DashboardLayout';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { QRCodeCanvas } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, QrCode, Trash2, Edit2, X, Users, HeartPulse, Building, Download, AlertTriangle, Bus, MapPin, CheckCircle, Home } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '../../lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

const mockChildren = [];

const statusStyles = {
  AT_HOME: { color: 'text-gray-700 dark:text-gray-300', bg: 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700', icon: Home, label: 'At Home' },
  PICKED_UP: { color: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-500/20 border-blue-200 dark:border-blue-500/30', icon: CheckCircle, label: 'Picked Up' },
  IN_TRANSIT: { color: 'text-orange-700 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-500/20 border-orange-200 dark:border-orange-500/30', icon: Bus, label: 'In Transit' },
  AT_INSTITUTION: { color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-500/20 border-emerald-200 dark:border-emerald-500/30', icon: Building, label: 'At School' },
  DROPPED: { color: 'text-gray-700 dark:text-gray-300', bg: 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700', icon: Home, label: 'Dropped Off' },
};

function QrModal({ child, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-sm">
        <Card className="bg-white/90 dark:bg-[#09090b]/90 backdrop-blur-xl border-gray-200/50 dark:border-gray-800/50 overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between p-6 pb-0">
            <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
              <QrCode className="w-5 h-5 text-primary-500" /> {child.firstName}'s Pass
            </h3>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-gray-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"><X className="w-4 h-4" /></Button>
          </div>
          <div className="p-6 text-center">
            <div className="w-56 h-56 mx-auto bg-white rounded-2xl p-4 shadow-inner border border-gray-100 flex items-center justify-center mb-6">
              <QRCodeCanvas value={child.qrCodeToken} size={190} level={"H"} className="rounded-lg" />
            </div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Driver Verification QR</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Show this to the driver during pickup/drop-off</p>
            <Badge variant="outline" className="font-mono text-xs text-gray-500 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">{child.qrCodeToken}</Badge>
            
            <div className="flex gap-3 mt-6">
              <Button onClick={onClose} variant="outline" className="flex-1 bg-white/50 dark:bg-gray-900/50">Close</Button>
              <Button className="flex-1 bg-primary-600 hover:bg-primary-700 text-white shadow-sm"><Download className="w-4 h-4 mr-2" /> Save</Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

function AddChildModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ firstName: '', lastName: '', grade: '', section: '', bloodGroup: 'O+', medicalNotes: '' });
  const update = f => e => setForm(p => ({ ...p, [f]: e.target.value }));
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onAdd(form);
      toast.success(`${form.firstName} added successfully!`);
      onClose();
    } catch (err) {
      toast.error('Failed to add child profile');
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-md">
        <Card className="bg-white/95 dark:bg-[#09090b]/95 backdrop-blur-xl border-gray-200/50 dark:border-gray-800/50 overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800/50">
            <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-primary-500" /> Add Child Profile
            </h3>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-gray-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"><X className="w-4 h-4" /></Button>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><label className="text-xs font-semibold text-gray-600 dark:text-gray-400">First Name</label><input className="w-full h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 focus:ring-2 focus:ring-primary-500/20 outline-none text-sm" value={form.firstName} onChange={update('firstName')} required placeholder="Aarav" /></div>
              <div className="space-y-1.5"><label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Last Name</label><input className="w-full h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 focus:ring-2 focus:ring-primary-500/20 outline-none text-sm" value={form.lastName} onChange={update('lastName')} required placeholder="Sharma" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Grade</label><input className="w-full h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 focus:ring-2 focus:ring-primary-500/20 outline-none text-sm" value={form.grade} onChange={update('grade')} placeholder="6th" /></div>
              <div className="space-y-1.5"><label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Section</label><input className="w-full h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 focus:ring-2 focus:ring-primary-500/20 outline-none text-sm" value={form.section} onChange={update('section')} placeholder="A" /></div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Blood Group</label>
              <select className="w-full h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 focus:ring-2 focus:ring-primary-500/20 outline-none text-sm appearance-none" value={form.bloodGroup} onChange={update('bloodGroup')}>
                {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div className="space-y-1.5"><label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Medical Notes</label><textarea className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 focus:ring-2 focus:ring-primary-500/20 outline-none text-sm resize-none" rows={3} value={form.medicalNotes} onChange={update('medicalNotes')} placeholder="Any allergies or medical conditions..." /></div>
            <div className="flex gap-3 pt-4">
              <Button type="button" onClick={onClose} variant="outline" className="flex-1 bg-white/50 dark:bg-gray-900/50">Cancel</Button>
              <Button type="submit" className="flex-1 bg-primary-600 hover:bg-primary-700 text-white shadow-sm">Save Profile</Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}

import { parentApi } from '../../services/api';
import { useEffect } from 'react';

export default function ChildrenManagement() {
  const [children, setChildren] = useState([]);
  const [showQr, setShowQr] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadChildren = async () => {
    try {
      const res = await parentApi.getChildren();
      // Add mock data for new fields requested in Phase 3
      const enriched = res.data.data?.map(child => ({
        ...child,
        pickupAddress: child.pickupAddress || '123 Main St, Apartment 4B',
        dropAddress: child.dropAddress || '123 Main St, Apartment 4B',
        route: child.route || 'Route A - Morning',
        attendancePercentage: child.attendancePercentage || '95%',
        history: child.history || [
          { date: 'Today', event: 'Picked up at 7:30 AM' },
          { date: 'Yesterday', event: 'Dropped off at 4:15 PM' },
          { date: 'Oct 10', event: 'Absent (Informed)' }
        ]
      }));
      setChildren(enriched);
    } catch (err) {
      toast.error('Failed to load children');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChildren();
  }, []);

  const addChild = async (childForm) => {
    await parentApi.addChild(childForm);
    loadChildren();
  };

  const removeChild = (id) => { 
    // Not implemented in backend yet, just mocking for now
    setChildren(prev => prev.filter(c => c.id !== id)); 
    toast.success('Child profile removed locally'); 
  };

  const generateQr = async (id) => {
    try {
      const res = await parentApi.generateChildQr(id);
      toast.success('New QR pass generated!');
      loadChildren();
      setShowQr(res.data.data);
    } catch (err) {
      toast.error('Failed to generate QR');
    }
  };

  return (
    <DashboardLayout>
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6"
      >
        <div>
          <h1 className="text-2xl font-display font-semibold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-primary-500" /> My Children
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage child profiles, digital QR passes, and transport tracking</p>
        </div>
        <Button onClick={() => setShowAdd(true)} className="bg-primary-600 hover:bg-primary-700 text-white shadow-sm">
          <Plus className="w-4 h-4 mr-2" /> Add Child
        </Button>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        <AnimatePresence>
          {children?.map((child, i) => {
            const StatusIcon = statusStyles[child.transportStatus]?.icon || MapPin;
            return (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.1 }}
                key={child.id} 
              >
                <Card className="bg-white/50 dark:bg-[#09090b]/50 backdrop-blur-xl border-gray-200/50 dark:border-dark-border/50 overflow-hidden group hover:shadow-md transition-all">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-5">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-indigo-600 flex items-center justify-center text-white font-display font-bold text-2xl shadow-lg shadow-primary-500/30 ring-2 ring-white dark:ring-gray-900">
                          {child.firstName[0]}
                        </div>
                        <div>
                          <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors">
                            {child.firstName} {child.lastName}
                          </h3>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{child.grade} {child.section && `• Section ${child.section}`}</p>
                          <Badge variant="outline" className={cn("mt-2 px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-bold border flex items-center gap-1.5 w-fit", statusStyles[child.transportStatus]?.bg, statusStyles[child.transportStatus]?.color)}>
                            <StatusIcon className="w-3 h-3" /> {statusStyles[child.transportStatus]?.label}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-500/10"><Edit2 className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => removeChild(child.id)} className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </div>

                    <Tabs defaultValue="overview" className="mb-5">
                      <TabsList className="grid w-full grid-cols-3 mb-4 bg-gray-100/50 dark:bg-gray-800/50 p-1 rounded-xl">
                        <TabsTrigger value="overview" className="rounded-lg text-xs font-semibold data-[state=active]:shadow-sm">Overview</TabsTrigger>
                        <TabsTrigger value="location" className="rounded-lg text-xs font-semibold data-[state=active]:shadow-sm">Location</TabsTrigger>
                        <TabsTrigger value="history" className="rounded-lg text-xs font-semibold data-[state=active]:shadow-sm">History</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="overview" className="mt-0">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 rounded-xl bg-gray-50/80 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                              <Building className="w-3.5 h-3.5" /> Institution
                            </div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{child.institution}</p>
                          </div>
                          <div className="p-3 rounded-xl bg-gray-50/80 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                              <HeartPulse className="w-3.5 h-3.5 text-red-500" /> Blood Group
                            </div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{child.bloodGroup}</p>
                          </div>
                          
                          {child.assignedDriver && (
                            <div className="col-span-2 p-3 rounded-xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 flex items-center justify-between">
                              <div>
                                <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-0.5">
                                  <Bus className="w-3.5 h-3.5" /> Assigned Transport
                                </div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{child.assignedDriver} • <span className="font-mono text-gray-500 text-xs">{child.vehicle}</span></p>
                              </div>
                            </div>
                          )}

                          {child.medicalNotes && (
                            <div className="col-span-2 p-3 rounded-xl bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30">
                              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-500 mb-1">
                                <AlertTriangle className="w-3.5 h-3.5" /> Medical Notes
                              </div>
                              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{child.medicalNotes}</p>
                            </div>
                          )}
                        </div>
                      </TabsContent>

                      <TabsContent value="location" className="mt-0 space-y-3">
                        <div className="p-3 rounded-xl bg-gray-50/80 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Pickup Address</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{child.pickupAddress}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-gray-50/80 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Drop Address</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{child.dropAddress}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-primary-50/50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-900/30">
                          <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 mb-1 uppercase tracking-wider">Assigned Route</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{child.route}</p>
                        </div>
                      </TabsContent>

                      <TabsContent value="history" className="mt-0">
                        <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 mb-3 flex items-center justify-between">
                          <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Attendance Rate</span>
                          <Badge className="bg-emerald-500 hover:bg-emerald-600">{child.attendancePercentage}</Badge>
                        </div>
                        <div className="space-y-2">
                          {child.history?.map((h, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-sm">
                              <span className="text-gray-500 dark:text-gray-400 font-medium">{h.date}</span>
                              <span className="text-gray-900 dark:text-white font-medium">{h.event}</span>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>

                    <Button onClick={() => setShowQr(child)} variant="outline" className="w-full h-11 bg-white/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 hover:border-primary-500/50 hover:bg-primary-50 dark:hover:bg-primary-500/10 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-2">
                      <QrCode className="w-4 h-4 mr-2" /> View Digital Pass
                    </Button>
                    <Button onClick={() => generateQr(child.id)} variant="ghost" className="w-full h-10 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-colors">
                      Generate New QR Pass
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: children?.length * 0.1 }}>
          <button
            onClick={() => setShowAdd(true)}
            className="w-full h-full min-h-[300px] rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/20 hover:bg-primary-50/50 dark:hover:bg-primary-900/10 hover:border-primary-300 dark:hover:border-primary-700 transition-all flex flex-col items-center justify-center gap-4 p-6 group"
          >
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50 transition-colors">
              <Plus className="w-8 h-8 text-slate-500 group-hover:text-primary-600 transition-colors" />
            </div>
            <div className="text-center">
              <span className="font-semibold text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors block">Add Another Child</span>
              <span className="text-xs text-slate-500 mt-1 block">Register a new profile for transport</span>
            </div>
          </button>
        </motion.div>
      </div>

      <AnimatePresence>
        {showQr && <QrModal child={showQr} onClose={() => setShowQr(null)} />}
        {showAdd && <AddChildModal onClose={() => setShowAdd(false)} onAdd={addChild} />}
      </AnimatePresence>
    </DashboardLayout>
  );
}
