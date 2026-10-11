import { useState } from 'react';
import DashboardLayout from '../../components/shared/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { motion } from 'framer-motion';
import { Plus, Car, Fuel, Wrench, ShieldCheck, Settings, Users, Activity, BatteryCharging, AlertTriangle, PenTool } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '../../lib/utils';

const mockVehicles = [
  { 
    id: 1, 
    registrationNumber: 'KA 01 AB 1234', 
    make: 'Tata', 
    model: 'Winger', 
    type: 'VAN', 
    year: 2020, 
    color: 'White', 
    seatingCapacity: 12, 
    overallStatus: 'APPROVED', 
    rcStatus: 'APPROVED', 
    insuranceStatus: 'APPROVED',
    fuelLevel: 75,
    lastServiced: '2024-05-15',
    nextService: '2024-11-15'
  },
];

export default function VehicleManagement() {
  const [vehicles] = useState(mockVehicles);
  return (
    <DashboardLayout>
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 max-w-5xl mx-auto"
      >
        <div>
          <h1 className="text-2xl font-display font-semibold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <Car className="w-6 h-6 text-primary-500" /> Vehicle Fleet
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your registered vehicles and compliance documents</p>
        </div>
        <Button onClick={() => toast.success('Vehicle registration flow coming soon', { icon: '🚘' })} className="bg-primary-600 hover:bg-primary-700 text-white shadow-sm">
          <Plus className="w-4 h-4 mr-2" /> Add Vehicle
        </Button>
      </motion.div>
      
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
        {vehicles?.map((v, i) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
            key={v.id} 
          >
            <Card className="h-full flex flex-col bg-white/70 dark:bg-[#09090b]/70 backdrop-blur-xl border-gray-200/50 dark:border-dark-border/50 overflow-hidden relative transition-all group hover:shadow-md">
              <div className="p-5 md:p-6 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center text-gray-700 dark:text-gray-300 shadow-sm border border-gray-200 dark:border-gray-700 shrink-0">
                      <Car className="w-8 h-8" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-mono font-bold text-xl text-gray-900 dark:text-white tracking-wider">{v.registrationNumber}</p>
                        {v.overallStatus === 'APPROVED' && <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border-none px-1.5 py-0"><ShieldCheck className="w-3 h-3 mr-1" /> Active</Badge>}
                      </div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{v.year} {v.make} {v.model} · {v.color}</p>
                    </div>
                  </div>
                  
                  <div className="flex sm:flex-col gap-2 justify-end shrink-0">
                    <Button variant="outline" size="sm" className="h-8 text-xs font-semibold px-2 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      <PenTool className="w-3.5 h-3.5 mr-1" /> Edit
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><Car className="w-3.5 h-3.5" /> Type</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{v.type}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><Users className="w-3.5 h-3.5" /> Capacity</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{v.seatingCapacity} Seats</p>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30">
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> RC</p>
                    <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">Valid</p>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30">
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> Insur.</p>
                    <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">Valid</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                      <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400"><Fuel className="w-4 h-4 text-primary-500" /> Fuel Level</span>
                      <span className="text-primary-600 dark:text-primary-400">{v.fuelLevel}%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full" style={{ width: `${v.fuelLevel}%` }} />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-5 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                      <Wrench className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900 dark:text-white">Next Service</p>
                      <p className="text-[11px] text-gray-500 font-medium">Due by {new Date(v.nextService).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="h-8 text-xs font-semibold bg-white dark:bg-gray-900">
                    Log Maintenance
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </DashboardLayout>
  );
}
