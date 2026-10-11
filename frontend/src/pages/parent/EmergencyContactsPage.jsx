import { useState } from 'react';
import DashboardLayout from '../../components/shared/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Plus, Trash2, Phone, Mail, User, PhoneCall, Shield, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '../../lib/utils';

const mockContacts = [
  { id: 1, name: 'Priya Sharma', phone: '9876543211', relation: 'Spouse', email: 'priya@email.com', primary: true },
  { id: 2, name: 'Ramesh Sharma', phone: '9876543212', relation: 'Father', email: '', primary: false },
  { id: 3, name: 'Sunita Devi', phone: '9876543213', relation: 'Mother-in-law', email: '', primary: false },
];

export default function EmergencyContactsPage() {
  const [contacts, setContacts] = useState(mockContacts);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', relation: '', email: '' });

  const addContact = (e) => {
    e.preventDefault();
    setContacts(p => [{ ...form, id: Date.now(), primary: false }, ...p]);
    setForm({ name: '', phone: '', relation: '', email: '' });
    setShowAdd(false);
    toast.success('Emergency contact added successfully', { icon: '🛡️' });
  };

  const removeContact = (id) => {
    setContacts(p => p.filter(c => c.id !== id));
    toast.success('Contact removed');
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
            <ShieldAlert className="w-6 h-6 text-red-500" /> Emergency Contacts
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Trusted individuals to notify instantly in case of an emergency</p>
        </div>
        <Button onClick={() => setShowAdd(!showAdd)} className={cn(
          "shadow-sm transition-all",
          showAdd ? "bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white" : "bg-primary-600 hover:bg-primary-700 text-white"
        )}>
          {showAdd ? 'Cancel' : <><Plus className="w-4 h-4 mr-2" /> Add Contact</>}
        </Button>
      </motion.div>

      <div className="max-w-5xl mx-auto">
        <AnimatePresence>
          {showAdd && (
            <motion.div 
              initial={{ opacity: 0, height: 0, marginBottom: 0 }} 
              animate={{ opacity: 1, height: 'auto', marginBottom: 24 }} 
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="overflow-hidden"
            >
              <Card className="bg-white/70 dark:bg-[#09090b]/70 backdrop-blur-xl border-gray-200/50 dark:border-dark-border/50 overflow-hidden shadow-md">
                <form onSubmit={addContact} className="p-6">
                  <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100 dark:border-gray-800/50">
                    <User className="w-5 h-5 text-primary-500" />
                    <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white">Register New Contact</h3>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="space-y-1.5"><label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Full Name</label><input className="w-full h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 focus:ring-2 focus:ring-primary-500/20 outline-none text-sm" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} required placeholder="e.g. Priya Sharma" /></div>
                    <div className="space-y-1.5"><label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Phone Number</label><input className="w-full h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 focus:ring-2 focus:ring-primary-500/20 outline-none text-sm" value={form.phone} onChange={e => setForm(p => ({...p, phone: e.target.value}))} required placeholder="e.g. 9876543210" /></div>
                    <div className="space-y-1.5"><label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Relationship to Child</label><input className="w-full h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 focus:ring-2 focus:ring-primary-500/20 outline-none text-sm" value={form.relation} onChange={e => setForm(p => ({...p, relation: e.target.value}))} placeholder="e.g. Spouse / Parent / Sibling" required /></div>
                    <div className="space-y-1.5"><label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Email Address <span className="text-slate-500 font-normal">(Optional)</span></label><input type="email" className="w-full h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 focus:ring-2 focus:ring-primary-500/20 outline-none text-sm" value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} placeholder="e.g. contact@email.com" /></div>
                  </div>
                  
                  <div className="flex gap-3 mt-6 pt-2">
                    <Button type="button" onClick={() => setShowAdd(false)} variant="outline" className="bg-white/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800">Cancel</Button>
                    <Button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white shadow-sm px-6">Save Contact</Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid md:grid-cols-2 gap-5">
          <AnimatePresence>
            {contacts?.map((contact, i) => (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.05 }}
                key={contact.id} 
              >
                <Card className={cn(
                  "bg-white/70 dark:bg-[#09090b]/70 backdrop-blur-xl border-gray-200/50 dark:border-dark-border/50 p-5 overflow-hidden relative group hover:shadow-md transition-all",
                  contact.primary ? "border-l-4 border-l-red-500 dark:border-l-red-500" : ""
                )}>
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center text-slate-900 font-display font-bold text-xl flex-shrink-0 shadow-sm",
                      contact.primary ? "bg-gradient-to-br from-red-500 to-rose-600 shadow-red-500/20" : "bg-gradient-to-br from-gray-400 to-gray-500 dark:from-gray-700 dark:to-gray-800"
                    )}>
                      {contact.name[0]}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate group-hover:text-primary-600 transition-colors">{contact.name}</h3>
                            {contact.primary && (
                              <Badge variant="outline" className="px-1.5 py-0 text-[9px] uppercase tracking-wider font-bold border border-red-200 bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400 dark:border-red-800/50 flex items-center gap-1">
                                <Shield className="w-2.5 h-2.5" /> 1st Priority
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{contact.relation}</p>
                        </div>
                        
                        {!contact.primary && (
                          <Button variant="ghost" size="icon" onClick={() => removeContact(contact.id)} className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity -mr-2 -mt-2">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="mt-4 space-y-2">
                        <a href={`tel:${contact.phone}`} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors bg-gray-50 dark:bg-gray-800/50 px-3 py-2 rounded-lg group/phone">
                          <Phone className="w-4 h-4 text-slate-500 group-hover/phone:text-primary-500" />
                          <span className="font-mono font-medium">{contact.phone}</span>
                        </a>
                        
                        {contact.email && (
                          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 px-3 py-2 rounded-lg">
                            <Mail className="w-4 h-4 text-slate-500" />
                            <span className="truncate">{contact.email}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {contact.primary && (
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between">
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1.5 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 text-red-500" /> Automatically notified during SOS alerts
                      </p>
                      <Button size="sm" className="h-8 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 shadow-none border-0">
                        <PhoneCall className="w-3.5 h-3.5 mr-1.5" /> Call Now
                      </Button>
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
}
