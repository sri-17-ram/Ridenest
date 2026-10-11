import DashboardLayout from '../../components/shared/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Users, Clock, Play, Navigation, CheckCircle, Navigation2, AlertOctagon, Car, Route, X } from 'lucide-react';
import { cn } from '../../lib/utils';

const mockSchedule = [];

import { useState, useEffect } from 'react';
import { driverApi } from '../../services/api';
import toast from 'react-hot-toast';

export default function TripSchedule() {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [endTripSuccess, setEndTripSuccess] = useState(null);

  useEffect(() => {
    const loadSchedule = async () => {
      try {
        const res = await driverApi.getTodayTrips();
        const formatted = res.data.data?.map(t => ({
          id: t.id,
          time: t.scheduledTime,
          trip: t.type === 'PICKUP' ? 'Morning Pickup' : 'Afternoon Drop',
          route: t.type === 'PICKUP' ? `Home → ${t.institution}` : `${t.institution} → Home`,
          status: t.status,
          children: t.children?.length,
          vehicle: t.vehicle,
          eta: 'TBD'
        }));
        setSchedule(formatted);
      } catch (err) {
        toast.error('Failed to load schedule');
      } finally {
        setLoading(false);
      }
    };
    loadSchedule();
  }, []);

  const startTrip = async (tripId) => {
    try {
      await driverApi.startTrip(tripId);
      toast.success('Trip started! GPS tracking is now active.');
      // Refresh the schedule
      const res = await driverApi.getTodayTrips();
      const formatted = res.data.data?.map(t => ({
        id: t.id,
        time: t.scheduledTime,
        trip: t.type === 'PICKUP' ? 'Morning Pickup' : 'Afternoon Drop',
        route: t.type === 'PICKUP' ? `Home → ${t.institution}` : `${t.institution} → Home`,
        status: t.status,
        children: t.children?.length,
        vehicle: t.vehicle,
        eta: 'TBD'
      }));
      setSchedule(formatted);
    } catch (err) {
      toast.error('Failed to start trip: ' + (err.response?.data?.message || err.message));
    }
  };

  const endTrip = async (tripId) => {
    try {
      const res = await driverApi.endTrip(tripId);
      setEndTripSuccess(res.data.data);
      // Refresh the schedule
      const refreshRes = await driverApi.getTodayTrips();
      const formatted = refreshRes.data.data?.map(t => ({
        id: t.id,
        time: t.scheduledTime,
        trip: t.type === 'PICKUP' ? 'Morning Pickup' : 'Afternoon Drop',
        route: t.type === 'PICKUP' ? `Home → ${t.institution}` : `${t.institution} → Home`,
        status: t.status,
        children: t.children?.length,
        vehicle: t.vehicle,
        eta: 'TBD'
      }));
      setSchedule(formatted);
      toast.success('Trip Completed Successfully! 🎉');
    } catch (err) {
      toast.error('Failed to end trip: ' + (err.response?.data?.message || err.message));
    }
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
            <Route className="w-6 h-6 text-primary-500" /> Trip Schedule
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Your daily driving schedule and active route management</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-800">
          <Calendar className="w-4 h-4 text-primary-500" /> Today — June 20, 2024
        </div>
      </motion.div>

      <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {schedule?.map((item, i) => (
            <motion.div 
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
              key={item.id} 
            >
              <Card className={cn(
                "bg-white/70 dark:bg-[#09090b]/70 backdrop-blur-xl border-gray-200/50 dark:border-dark-border/50 overflow-hidden relative transition-all",
                item.status === 'IN_PROGRESS' ? "border-l-4 border-l-blue-500 shadow-md ring-1 ring-blue-500/20" : item.status === 'COMPLETED' ? "opacity-75" : ""
              )}>
                {item.status === 'IN_PROGRESS' && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                )}
                
                <div className="p-5">
                  <div className="flex flex-col md:flex-row gap-4 md:items-center">
                    <div className="text-center md:w-24 shrink-0 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 border border-gray-100 dark:border-gray-800">
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Scheduled</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white font-mono">{item.time}</p>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">{item.trip}</h3>
                        {item.status === 'COMPLETED' ? (
                          <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border-none font-bold"><CheckCircle className="w-3.5 h-3.5 mr-1" /> Completed</Badge>
                        ) : item.status === 'IN_PROGRESS' ? (
                          <Badge className="bg-blue-500 text-white border-none font-bold animate-pulse shadow-sm shadow-blue-500/20"><Navigation className="w-3.5 h-3.5 mr-1" /> Active</Badge>
                        ) : (
                          <Badge variant="outline" className="text-gray-500 dark:text-gray-400 font-bold"><Clock className="w-3.5 h-3.5 mr-1" /> Upcoming</Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 font-medium mb-3">
                        <MapPin className="w-4 h-4 shrink-0 text-primary-500" /> {item.route}
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs font-semibold text-gray-500 dark:text-gray-500">
                        <span className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md"><Users className="w-3.5 h-3.5" /> {item.children} Students</span>
                        <span className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md"><Car className="w-3.5 h-3.5" /> {item.vehicle}</span>
                        {item.eta && <span className="flex items-center gap-1.5 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 px-2 py-1 rounded-md ml-auto"><Clock className="w-3.5 h-3.5" /> ETA: {item.eta}</span>}
                      </div>
                    </div>
                  </div>
                  
                  {item.status === 'IN_PROGRESS' && (
                    <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800 flex gap-3">
                      <Button onClick={() => endTrip(item.id)} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm font-bold text-sm h-11">
                        <CheckCircle className="w-4 h-4 mr-2" /> End Trip
                      </Button>
                      <Button variant="destructive" className="font-bold text-sm h-11 shadow-sm">
                        <AlertOctagon className="w-4 h-4 mr-2" /> Emergency
                      </Button>
                    </div>
                  )}
                  {item.status === 'SCHEDULED' && (
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                      <Button onClick={() => startTrip(item.id)} variant="outline" className="w-full font-bold text-sm text-primary-600 dark:text-primary-400 border-primary-200 dark:border-primary-900/50 bg-primary-50/50 dark:bg-primary-900/10 hover:bg-primary-100 dark:hover:bg-primary-900/30">
                        <Play className="w-4 h-4 mr-2" /> Start Trip Now
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <Card className="p-5 bg-gradient-to-br from-gray-900 to-black border-gray-800 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
              
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Car className="w-5 h-5 text-primary-400" /> Active Vehicle</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Vehicle Details</p>
                  <p className="font-mono text-xl font-bold tracking-wider text-slate-900">{schedule?.length > 0 ? schedule[0].vehicle : 'Not Assigned'}</p>
                  <p className="text-sm text-slate-600">Transport Vehicle</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/10 rounded-xl p-3 border border-white/5">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Fuel</p>
                    <p className="font-bold text-sm text-emerald-400">75%</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3 border border-white/5">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Condition</p>
                    <p className="font-bold text-sm text-emerald-400">Optimal</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <Card className="p-5 bg-white/70 dark:bg-[#09090b]/70 backdrop-blur-xl border-gray-200/50 dark:border-dark-border/50">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Clock className="w-4 h-4 text-primary-500" /> Shift Progress</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-gray-500 dark:text-gray-400">Completed</span>
                  <span className="text-gray-900 dark:text-white">1 of 3 Trips</span>
                </div>
                <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-500 rounded-full w-1/3" />
                </div>
                
                <div className="flex items-center justify-between text-xs font-semibold pt-2 border-t border-gray-100 dark:border-gray-800">
                  <span className="text-gray-500 dark:text-gray-400">Students Transported</span>
                  <span className="text-gray-900 dark:text-white">
                    {schedule.reduce((acc, trip) => acc + (trip.status === 'COMPLETED' ? trip.children : 0), 0)} of {schedule.reduce((acc, trip) => acc + trip.children, 0)}
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {endTripSuccess && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-sm"
            >
              <Card className="border-2 shadow-2xl overflow-hidden backdrop-blur-xl bg-white dark:bg-[#09090b] border-indigo-500/50 shadow-indigo-500/20">
                <CardHeader className="bg-indigo-50/50 dark:bg-indigo-900/10 border-b border-indigo-100 dark:border-indigo-900/20 pb-6 relative">
                  <Button variant="ghost" size="icon" className="absolute top-2 right-2 rounded-full" onClick={() => setEndTripSuccess(null)}>
                    <X className="w-5 h-5 text-gray-500" />
                  </Button>
                  <div className="flex flex-col items-center text-center gap-4 pt-4">
                    <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center border-4 border-indigo-50 dark:border-indigo-900/50 shadow-lg">
                      <CheckCircle className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-indigo-800 dark:text-indigo-400 mb-1">Trip Completed!</CardTitle>
                      <CardDescription className="text-indigo-600 dark:text-indigo-500 font-medium">Schedule Updated</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    {[
                      { label: 'Students Transported', value: endTripSuccess.children?.length, icon: Users },
                      { label: 'Vehicle', value: endTripSuccess.vehicle.registrationNumber, icon: Car },
                      { label: 'Completion Time', value: endTripSuccess.actualEndTime ? new Date(endTripSuccess.actualEndTime).toLocaleTimeString() : 'N/A', icon: Clock },
                    ].map((item, i) => (
                      <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                          <item.icon className="w-4 h-4" />
                          <p className="text-xs uppercase tracking-wider font-semibold">{item.label}</p>
                        </div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white text-right">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="pt-2 pb-6">
                  <Button 
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12 text-base shadow-glow-blue" 
                    onClick={() => setEndTripSuccess(null)}
                  >
                    Close
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
