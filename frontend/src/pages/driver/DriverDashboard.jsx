import { useState } from 'react';
import DashboardLayout from '../../components/shared/DashboardLayout';
import StatCard from '../../components/shared/StatCard';
import StatusBadge from '../../components/shared/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { ClipboardList, CheckCircle, Truck, ShieldCheck, Play, Square, QrCode, FileText, ArrowRight, User, Bus, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { cn } from '../../lib/utils';
import { PauseCircle, Navigation, HeartPulse, ShieldAlert } from 'lucide-react';

const mockTrips = [];

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
};

import { driverApi } from '../../services/api';
import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Car, Route, X } from 'lucide-react';

export default function DriverDashboard() {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [activeTrip, setActiveTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dropSuccess, setDropSuccess] = useState(null);
  const [endTripSuccess, setEndTripSuccess] = useState(null);
  const [tripPaused, setTripPaused] = useState(false);

  const loadTrips = async () => {
    try {
      const res = await driverApi.getTodayTrips();
      const tripData = res.data?.data || [];
      setTrips(tripData);
      const active = tripData.find(t => t.status === 'IN_PROGRESS');
      setActiveTrip(active || null);
    } catch (err) {
      toast.error('Failed to load trips');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  const startTrip = async (trip) => {
    try {
      await driverApi.startTrip(trip.id);
      toast.success('Trip started! GPS tracking is now active.');
      loadTrips(); // Refresh to get updated data
    } catch (err) {
      toast.error('Failed to start trip: ' + (err.response?.data?.message || err.message));
    }
  };

  const endTrip = async (tripId) => {
    try {
      const res = await driverApi.endTrip(tripId);
      setEndTripSuccess(res.data.data);
      loadTrips();
      toast.success('Trip Completed Successfully! 🎉');
    } catch (err) {
      toast.error('Failed to end trip: ' + (err.response?.data?.message || err.message));
    }
  };

  const confirmDrop = async (tripId, childId) => {
    try {
      const res = await driverApi.confirmDrop(tripId, childId);
      setDropSuccess(res.data.data);
      loadTrips();
      toast.success('Child Dropped Successfully');
    } catch (err) {
      toast.error('Failed to drop child: ' + (err.response?.data?.message || err.message));
    }
  };

  const todayTrips = trips; // API already returns today's trips
  const completedCount = trips.filter(t => t.status === 'COMPLETED').length;

  return (
    <DashboardLayout>
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-2xl font-display font-semibold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            Good Morning, {user?.firstName}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Your driving schedule for today</p>
        </div>
        <Link to="/driver/scanner">
          <Button className="shadow-glow-blue hover:scale-105 transition-transform w-full md:w-auto">
            <QrCode className="w-4 h-4 mr-2" /> Open Scanner
          </Button>
        </Link>
      </motion.div>

      {/* Active Trip Workflow Dashboard */}
      {activeTrip && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className={cn(
            "border-2 overflow-hidden bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-xl shadow-2xl transition-all duration-500",
            tripPaused ? "border-amber-500/50 shadow-amber-500/20" : "border-emerald-500/50 shadow-emerald-500/20"
          )}>
            <div className={cn(
              "h-2 w-full",
              tripPaused ? "bg-amber-500 animate-pulse" : "bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-400 bg-[length:200%_auto] animate-gradient"
            )} />
            <CardContent className="p-0">
              <div className="grid lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-gray-200 dark:divide-dark-border">
                {/* Primary Info */}
                <div className="p-6 lg:col-span-1 space-y-6 bg-gray-50/50 dark:bg-dark-surface/30">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border-2",
                      tripPaused ? "bg-amber-500/20 border-amber-500/30 text-amber-500" : "bg-emerald-500/20 border-emerald-500/30 text-emerald-500"
                    )}>
                      {tripPaused ? <PauseCircle className="w-7 h-7" /> : <Bus className="w-7 h-7" />}
                    </div>
                    <div>
                      <Badge className={cn("mb-1", tripPaused ? "bg-amber-500 hover:bg-amber-600" : "bg-emerald-500 hover:bg-emerald-600")}>
                        {tripPaused ? "TRIP PAUSED" : "TRIP IN PROGRESS"}
                      </Badge>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-1">{activeTrip.institution || 'School Route'}</h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">GPS Status</p>
                      <p className={cn("text-sm font-bold flex items-center gap-1", tripPaused ? "text-amber-500" : "text-emerald-500")}>
                        <MapPin className="w-4 h-4" /> {tripPaused ? "Standby" : "Active & Broadcasting"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Vehicle Status</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1">
                        <Truck className="w-4 h-4 text-primary-500" /> {activeTrip?.vehicle?.number || 'Assigned'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Started At</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1">
                        <Clock className="w-4 h-4 text-blue-500" /> {new Date(activeTrip.actualStartTime || Date.now()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Current Students</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1">
                        <User className="w-4 h-4 text-purple-500" /> {activeTrip.children?.filter(c => c.pickupStatus === 'PICKED_UP' && c.dropStatus !== 'DROPPED').length || 0} / {activeTrip.children?.length || 0} Boarded
                      </p>
                    </div>
                  </div>
                </div>

                {/* Telemetry & Route */}
                <div className="p-6 lg:col-span-1 flex flex-col justify-center">
                  <h4 className="text-xs uppercase tracking-wider font-bold text-gray-500 mb-4 flex items-center gap-2">
                    <Navigation className="w-4 h-4" /> Route Progress
                  </h4>
                  <div className="relative pl-6 border-l-2 border-gray-200 dark:border-gray-800 space-y-6">
                    <div className="relative">
                      <div className="absolute -left-[31px] w-4 h-4 rounded-full border-4 border-white dark:border-[#09090b] bg-gray-400" />
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">Current Stop</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Departed from Origin</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[31px] w-4 h-4 rounded-full border-4 border-white dark:border-[#09090b] bg-primary-500 animate-pulse" />
                      <p className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        Next Stop <Badge className="bg-primary-100 text-primary-700 hover:bg-primary-100 dark:bg-primary-900/30 dark:text-primary-400 border-0 h-5 px-1.5 text-[10px]">ETA: 12 min</Badge>
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{activeTrip.children?.[0]?.pickupAddress || 'Next Student Location'}</p>
                    </div>
                  </div>
                </div>

                {/* Driver Controls */}
                <div className="p-6 lg:col-span-1 flex flex-col gap-3 justify-center">
                  <Link to="/driver/scanner">
                    <Button className="w-full h-12 text-base shadow-glow-blue border-0">
                      <QrCode className="w-5 h-5 mr-2" /> Scan QR
                    </Button>
                  </Link>
                  <div className="grid grid-cols-2 gap-3">
                    {tripPaused ? (
                      <Button variant="outline" className="h-12 border-emerald-500 text-emerald-600 hover:bg-emerald-50" onClick={() => {
                        setTripPaused(false);
                        toast.success('Trip Resumed. GPS Broadcasting Active.');
                      }}>
                        <Play className="w-4 h-4 mr-2" /> Resume
                      </Button>
                    ) : (
                      <Button variant="outline" className="h-12 border-amber-500 text-amber-600 hover:bg-amber-50" onClick={() => {
                        setTripPaused(true);
                        toast('Trip Paused. Parents Notified.', { icon: '⏸️' });
                      }}>
                        <PauseCircle className="w-4 h-4 mr-2" /> Pause
                      </Button>
                    )}
                    <Button variant="destructive" className="h-12 shadow-glow-red" onClick={() => endTrip(activeTrip.id)}>
                      <Square className="w-4 h-4 mr-2 fill-current" /> End
                    </Button>
                  </div>
                  <Button variant="outline" className="w-full h-12 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 bg-red-50/50" onClick={() => {
                    toast.error('Emergency Protocol Activated! Admin & Police Notified.', { style: { background: '#ef4444', color: '#fff' }});
                  }}>
                    <ShieldAlert className="w-5 h-5 mr-2" /> Emergency SOS
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Stats */}
      <motion.div 
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        <motion.div variants={itemVariants}>
          <StatCard title="Today's Trips" value={todayTrips?.length} icon={ClipboardList}
            iconBg="bg-blue-100/50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20" />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard title="Completed" value={completedCount} icon={CheckCircle}
            iconBg="bg-emerald-100/50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20" />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard title="My Vehicle" value="Van" icon={Truck}
            iconBg="bg-orange-100/50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20"
            subtitle="KA 01 AB 1234" />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard title="Rating" value="4.9" icon={ShieldCheck}
            iconBg="bg-purple-100/50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20"
            subtitle="156 trips" />
        </motion.div>
      </motion.div>

      {/* Trip Starts Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Navigation className="w-6 h-6 text-primary-500" /> Trip Starts
        </h2>
        <div className="grid lg:grid-cols-1 gap-6">
          {todayTrips?.map((trip, idx) => {
            const isStarted = trip.status === 'IN_PROGRESS';
            const studentsPickedUp = trip.children?.filter(c => c.pickupStatus === 'PICKED_UP').length || 0;
            const remainingStudents = (trip.children?.length || 0) - studentsPickedUp;

            return (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={trip.id}
            >
              <Card className={cn(
                "border-gray-200/50 dark:border-dark-border/50 bg-white/50 dark:bg-[#09090b]/50 backdrop-blur-xl transition-all shadow-lg",
                isStarted && "ring-2 ring-emerald-500/50 shadow-glow-emerald"
              )}>
                {/* Trip Status Card Header */}
                <div className="bg-gray-50 dark:bg-gray-800/50 p-6 border-b border-gray-100 dark:border-gray-800 rounded-t-xl">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline" className={cn(
                          "font-bold px-3 py-1 text-sm border-0 shadow-sm",
                          trip.type === 'PICKUP' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                        )}>
                          {trip.type === 'PICKUP' ? 'PICKUP ROUTE' : 'DROP ROUTE'}
                        </Badge>
                        <Badge className={cn(
                          "px-3 py-1 font-bold shadow-sm",
                          isStarted ? "bg-emerald-500 hover:bg-emerald-600 animate-pulse" : "bg-gray-200 text-gray-600 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300"
                        )}>
                          {isStarted ? "STARTED" : "NOT STARTED"}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Route className="w-5 h-5 text-slate-400" /> {trip.institution}
                      </h3>
                    </div>
                    {trip.status === 'SCHEDULED' && !activeTrip && (
                      <Button size="lg" onClick={() => startTrip(trip)} className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-glow-emerald font-bold text-lg h-14 px-8 rounded-xl transition-transform hover:scale-105">
                        <Play className="w-5 h-5 mr-2 fill-current" /> Start Trip
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Vehicle No.</span>
                      <span className="font-bold text-gray-900 dark:text-white flex items-center gap-1"><Truck className="w-4 h-4 text-primary-500" /> {trip.vehicle?.number || "Assigned"}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Driver</span>
                      <span className="font-bold text-gray-900 dark:text-white flex items-center gap-1"><User className="w-4 h-4 text-primary-500" /> {user?.firstName}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Current Time</span>
                      <span className="font-bold text-gray-900 dark:text-white flex items-center gap-1"><Clock className="w-4 h-4 text-blue-500" /> {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Progress</span>
                      <span className="font-bold text-gray-900 dark:text-white flex items-center gap-1">{isStarted ? "En Route" : "Waiting to Start"}</span>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  {/* Live Statistics when Started */}
                  {isStarted && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mb-8 overflow-hidden"
                    >
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
                        <div className="text-center p-3 rounded-xl bg-white/60 dark:bg-[#09090b]/60 shadow-sm backdrop-blur-md border border-white/20">
                          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mb-1">Students Picked Up</p>
                          <p className="text-2xl font-display font-bold text-gray-900 dark:text-white">{studentsPickedUp}</p>
                        </div>
                        <div className="text-center p-3 rounded-xl bg-white/60 dark:bg-[#09090b]/60 shadow-sm backdrop-blur-md border border-white/20">
                          <p className="text-xs text-orange-600 dark:text-orange-400 font-bold mb-1">Remaining Students</p>
                          <p className="text-2xl font-display font-bold text-gray-900 dark:text-white">{remainingStudents}</p>
                        </div>
                        <div className="text-center p-3 rounded-xl bg-white/60 dark:bg-[#09090b]/60 shadow-sm backdrop-blur-md border border-white/20">
                          <p className="text-xs text-blue-600 dark:text-blue-400 font-bold mb-1">Distance Covered</p>
                          <p className="text-2xl font-display font-bold text-gray-900 dark:text-white">4.2 <span className="text-sm font-normal text-gray-500">km</span></p>
                        </div>
                        <div className="text-center p-3 rounded-xl bg-white/60 dark:bg-[#09090b]/60 shadow-sm backdrop-blur-md border border-white/20">
                          <p className="text-xs text-purple-600 dark:text-purple-400 font-bold mb-1">Trip Duration</p>
                          <p className="text-2xl font-display font-bold text-gray-900 dark:text-white">18 <span className="text-sm font-normal text-gray-500">min</span></p>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex flex-wrap gap-3">
                        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0 flex items-center gap-1.5 py-1.5 animate-pulse">
                          <MapPin className="w-3.5 h-3.5" /> Live GPS Tracking Started
                        </Badge>
                        <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-0 flex items-center gap-1.5 py-1.5">
                          <Navigation className="w-3.5 h-3.5" /> Monitoring Assigned Route...
                        </Badge>
                      </div>
                    </motion.div>
                  )}

                  {/* Student list */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-slate-800 dark:text-gray-200 uppercase tracking-wider flex items-center gap-2">
                        <User className="w-4 h-4 text-primary-500" /> Assigned Students ({trip?.children?.length || 0})
                      </p>
                      {isStarted && (
                        <Link to="/driver/scanner">
                          <Button size="sm" className="shadow-glow-blue bg-primary-600 hover:bg-primary-700 font-semibold rounded-full px-4">
                            <QrCode className="w-4 h-4 mr-2" /> Scanner Active
                          </Button>
                        </Link>
                      )}
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      {trip?.children?.map(child => {
                        const status = trip.type === 'DROP' ? child.dropStatus : child.pickupStatus;
                        // Determine attendance badge
                        let attendanceColor = "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
                        let attendanceText = "Pending";
                        if (status === 'PICKED_UP' || status === 'DROPPED') {
                          attendanceColor = "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400";
                          attendanceText = "Present";
                        } else if (status === 'ABSENT') {
                          attendanceColor = "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400";
                          attendanceText = "Absent";
                        } else if (status === 'LEAVE') {
                          attendanceColor = "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400";
                          attendanceText = "Pre-informed Leave";
                        }
                        
                        return (
                          <div key={child.id} className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50/70 dark:bg-dark-surface/70 border border-gray-100 dark:border-dark-border/50 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-indigo-500 flex items-center justify-center text-white text-lg font-bold shadow-sm shrink-0 border-2 border-white dark:border-[#09090b]">
                              {child.name[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start mb-1">
                                <p className="text-base font-bold text-gray-900 dark:text-white tracking-tight truncate">{child.name}</p>
                                <Badge variant="outline" className={cn("text-[10px] font-bold px-2 py-0.5", attendanceColor)}>
                                  {attendanceText}
                                </Badge>
                              </div>
                              <p className="text-xs text-gray-500 font-medium mb-2">Parent: {child.parentName || "Verified Parent"}</p>
                              
                              <div className="space-y-1.5 bg-white dark:bg-[#09090b] p-2 rounded-lg border border-gray-100 dark:border-gray-800">
                                <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                                  <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                  <span className="truncate"><span className="font-semibold">Pickup:</span> {child.pickupAddress || trip.institution}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                                  <Navigation className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                                  <span className="truncate"><span className="font-semibold">Drop:</span> {child.dropAddress || trip.institution}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                                  <Clock className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                                  <span className="font-semibold">Time:</span> {trip.scheduledTime}
                                </div>
                              </div>

                              {isStarted && status === 'PICKED_UP' && trip.type === 'DROP' && child.dropStatus !== 'DROPPED' && (
                                <Button size="sm" className="w-full mt-3 bg-primary-50 text-primary-600 hover:bg-primary-100 border border-primary-200 dark:bg-primary-900/20 dark:text-primary-400 dark:border-primary-800/50" onClick={() => confirmDrop(trip.id, child.childId)}>
                                  Mark as Dropped
                                </Button>
                              )}
                              {isStarted && status === 'PENDING' && trip.type === 'PICKUP' && (
                                <Button size="sm" className="w-full mt-3 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50" onClick={() => confirmDrop(trip.id, child.childId)}>
                                  Manual Pickup Override
                                </Button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )})}
        </div>
      </div>

      {/* Verification Status */}
      <Card className="bg-white/50 dark:bg-[#09090b]/50 backdrop-blur-xl border-gray-200/50 dark:border-dark-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Document Verification Status</CardTitle>
          <CardDescription>Keep your documents up to date to continue driving.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Driving License', status: 'APPROVED', icon: FileText },
              { label: 'Aadhaar Card', status: 'APPROVED', icon: User },
              { label: 'Vehicle RC', status: 'APPROVED', icon: Truck },
              { label: 'Insurance', status: 'PENDING', icon: ShieldCheck },
            ].map((doc, i) => (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                key={doc.label} 
                className="p-5 rounded-2xl bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-border/50 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center mb-3",
                  doc.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400'
                )}>
                  <doc.icon className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">{doc.label}</p>
                <StatusBadge status={doc.status} />
              </motion.div>
            ))}
          </div>
          <Link to="/driver/documents">
            <Button variant="outline" className="text-sm w-full md:w-auto">
              Manage Documents <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      <AnimatePresence>
        {dropSuccess && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-sm"
            >
              <Card className="border-2 shadow-2xl overflow-hidden backdrop-blur-xl bg-white dark:bg-[#09090b] border-emerald-500/50 shadow-emerald-500/20">
                <CardHeader className="bg-emerald-50/50 dark:bg-emerald-900/10 border-b border-emerald-100 dark:border-emerald-900/20 pb-6 relative">
                  <Button variant="ghost" size="icon" className="absolute top-2 right-2 rounded-full" onClick={() => setDropSuccess(null)}>
                    <X className="w-5 h-5 text-gray-500" />
                  </Button>
                  <div className="flex flex-col items-center text-center gap-4 pt-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center border-4 border-emerald-50 dark:border-emerald-900/50 shadow-lg">
                      <CheckCircle className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-emerald-800 dark:text-emerald-400 mb-1">Child Dropped Successfully</CardTitle>
                      <CardDescription className="text-emerald-600 dark:text-emerald-500 font-medium">RideNest Journey Completed</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    {[
                      { label: 'Child Name', value: dropSuccess.childName, icon: User },
                      { label: 'Vehicle', value: dropSuccess.vehicleNumber, icon: Car },
                      { label: 'Route', value: dropSuccess.routeName, icon: Route },
                      { label: "Drop Time", value: dropSuccess.pickupTime ? new Date(dropSuccess.pickupTime).toLocaleTimeString() : 'N/A', icon: Clock },
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
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 text-base shadow-glow-emerald" 
                    onClick={() => setDropSuccess(null)}
                  >
                    Continue
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                      <CardDescription className="text-indigo-600 dark:text-indigo-500 font-medium">Excellent Work</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    {[
                      { label: 'Students Transported', value: endTripSuccess?.children?.length || 0, icon: User },
                      { label: 'Vehicle', value: endTripSuccess?.vehicle?.registrationNumber || 'N/A', icon: Car },
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
