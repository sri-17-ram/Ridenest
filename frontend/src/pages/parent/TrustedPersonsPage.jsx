import { useState } from 'react';
import DashboardLayout from '../../components/shared/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Plus, KeyRound, Phone, User, Info, CheckCircle, ShieldAlert, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '../../lib/utils';

const mockPersons = [
  { id: 1, childName: 'Aarav', name: 'Rajesh Sharma', phone: '9876543220', relation: 'Grandfather', otpCode: '482910', verified: true },
  { id: 2, childName: 'Aarav', name: 'Kavitha Devi', phone: '9876543221', relation: 'Grandmother', otpCode: '739264', verified: true },
  { id: 3, childName: 'Ananya', name: 'Sriram Menon', phone: '9876543222', relation: 'Uncle', otpCode: null, verified: false },
];

export default function TrustedPersonsPage() {
  const [persons, setPersons] = useState(mockPersons);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', relation: '', childName: '' });

  const generateOtp = (id) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setPersons(p => p?.map(x => x.id === id ? { ...x, otpCode: otp, verified: true } : x));
    toast.success('Verification OTP generated successfully', { icon: '🔑' });
  };
  
  const addPerson = (e) => {
    e.preventDefault();
    setPersons(p => [{ ...form, id: Date.now(), otpCode: null, verified: false }, ...p]);
    setForm({ name: '', phone: '', relation: '', childName: '' });
    setShowAdd(false);
    toast.success('Trusted person added to authorization list', { icon: '🛡️' });
  };

  return (
    <DashboardLayout>
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 max-w-5xl mx-auto"
      >
        <div>
          <h1 className="text-2xl font-display font-semibold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-primary-500" /> Trusted Persons
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Pre-authorize individuals who are allowed to pick up your children</p>
        </div>
        <Button onClick={() => setShowAdd(!showAdd)} className={cn(
          "shadow-sm transition-all",
          showAdd ? "bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white" : "bg-primary-600 hover:bg-primary-700 text-white"
        )}>
          {showAdd ? 'Cancel' : <><Plus className="w-4 h-4 mr-2" /> Add Trusted Person</>}
        </Button>
      </motion.div>

      <div className="max-w-5xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/30 flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800 dark:text-blue-300">
              <span className="font-semibold block mb-1">How Pickup Authorization Works</span>
              Add trusted family members or guardians. Generate a unique Verification OTP for them before they arrive at the pickup point. Drivers are strictly instructed not to release children without matching this OTP.
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {showAdd && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }} 
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <Card className="bg-white/70 dark:bg-[#09090b]/70 backdrop-blur-xl border-gray-200/50 dark:border-dark-border/50 overflow-hidden shadow-md mb-6">
                <form onSubmit={addPerson} className="p-6">
                  <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100 dark:border-gray-800/50">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-primary-500" />
                      <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white">Authorize New Person</h3>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="space-y-1.5"><label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Full Name</label><input className="w-full h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 focus:ring-2 focus:ring-primary-500/20 outline-none text-sm" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} required placeholder="e.g. Rajesh Sharma" /></div>
                    <div className="space-y-1.5"><label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Phone Number</label><input className="w-full h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 focus:ring-2 focus:ring-primary-500/20 outline-none text-sm" value={form.phone} onChange={e => setForm(p => ({...p, phone: e.target.value}))} required placeholder="e.g. 9876543220" /></div>
                    <div className="space-y-1.5"><label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Relationship</label><input className="w-full h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 focus:ring-2 focus:ring-primary-500/20 outline-none text-sm" value={form.relation} onChange={e => setForm(p => ({...p, relation: e.target.value}))} placeholder="e.g. Grandparent" required /></div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Authorized Child</label>
                      <select className="w-full h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 focus:ring-2 focus:ring-primary-500/20 outline-none text-sm appearance-none" value={form.childName} onChange={e => setForm(p => ({...p, childName: e.target.value}))} required>
                        <option value="" disabled>Select child...</option>
                        <option value="Aarav">Aarav</option>
                        <option value="Ananya">Ananya</option>
                        <option value="Both">Both Children</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 mt-6 pt-2">
                    <Button type="button" onClick={() => setShowAdd(false)} variant="outline" className="bg-white/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800">Cancel</Button>
                    <Button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white shadow-sm px-6">Authorize Person</Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {persons?.map((person, i) => (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: 0.2 + (i * 0.05) }}
                key={person.id} 
              >
                <Card className="h-full bg-white/70 dark:bg-[#09090b]/70 backdrop-blur-xl border-gray-200/50 dark:border-dark-border/50 overflow-hidden relative group hover:shadow-md transition-all flex flex-col">
                  <div className="p-5 flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center text-white font-display font-bold text-xl flex-shrink-0 shadow-sm shadow-indigo-500/20">
                          {person.name[0]}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white leading-tight">{person.name}</h3>
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{person.relation}</p>
                        </div>
                      </div>
                      {person.verified ? (
                        <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500" title="Verified & Active">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400" title="Pending OTP Generation">
                          <ShieldAlert className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-3 mb-5">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="w-4 h-4 text-slate-500" />
                        <span className="text-gray-600 dark:text-gray-300">Authorized for: <strong className="text-gray-900 dark:text-white">{person.childName}</strong></span>
                      </div>
                      <a href={`tel:${person.phone}`} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-primary-600 transition-colors">
                        <Phone className="w-4 h-4 text-slate-500" />
                        <span className="font-mono">{person.phone}</span>
                      </a>
                    </div>
                  </div>
                  
                  <div className="p-5 bg-gray-50/50 dark:bg-gray-900/30 border-t border-gray-100 dark:border-gray-800/50 mt-auto">
                    {person.otpCode ? (
                      <div className="text-center">
                        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-full">
                          <CheckCircle className="w-3.5 h-3.5" /> Active Pickup OTP
                        </div>
                        <div className="text-3xl font-mono font-black text-gray-900 dark:text-white tracking-[0.2em] mb-1">
                          {person.otpCode}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Valid for today's trips</p>
                      </div>
                    ) : (
                      <Button onClick={() => generateOtp(person.id)} className="w-full bg-gray-900 hover:bg-black text-white dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900 shadow-sm group">
                        <KeyRound className="w-4 h-4 mr-2 text-slate-500 group-hover:text-slate-900 dark:group-hover:text-gray-900 transition-colors" /> Generate Passcode
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
}
