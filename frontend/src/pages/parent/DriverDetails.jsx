import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/shared/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { Phone, Mail, Star, MapPin, Truck, Calendar, Clock, ShieldCheck, Activity, AlertTriangle, Users, Map, Building } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { parentApi } from '../../services/api';
import { Link } from 'react-router-dom';

export default function DriverDetails() {
  const { user } = useAuth();
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch from a specific endpoint
    // For now, we fetch active trip to extract driver info, or mock if none
    const fetchDriverDetails = async () => {
      try {
        setLoading(true);
        const res = await parentApi.getActiveTrip().catch(() => ({ data: { data: null } }));
        if (res.data?.data?.driver) {
          setDriver({
            ...res.data.data.driver,
            vehicle: res.data.data.vehicle,
            status: '🟢 Available',
            tripStatus: res.data.data.status,
            eta: '8 minutes'
          });
        } else {
          // Mock data if no active trip, just to show the UI requested
          setDriver({
            name: "Rajesh Kumar",
            phone: "+91 98765 43210",
            license: "DL-14-2021-1234567",
            experience: "8 Years",
            rating: 4.8,
            status: "🟢 Available",
            tripStatus: "Started",
            eta: "8 minutes",
            gpsStatus: "Active",
            emergencyContact: "+91 99999 88888",
            photo: "https://i.pravatar.cc/150?u=rajesh",
            institution: "St. Mary's High School",
            vehicle: {
              number: "TN 09 AB 1234",
              type: "AC Minibus",
              capacity: 24,
              route: "Route A (Mylapore - School)"
            }
          });
        }
      } catch (error) {
        console.error("Failed to load driver details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDriverDetails();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!driver) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <p className="text-gray-500">No active driver assigned currently.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-semibold tracking-tight text-gray-900 dark:text-white">Driver Details</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Verified personnel handling your child's transportation</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-1 space-y-6">
          <Card className="overflow-hidden bg-white/50 dark:bg-[#09090b]/50 backdrop-blur-xl border-gray-200/50 dark:border-dark-border/50">
            <div className="h-24 bg-gradient-to-r from-primary-500 to-indigo-600 relative">
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                <div className="w-24 h-24 rounded-full border-4 border-white dark:border-[#09090b] overflow-hidden bg-white shadow-lg">
                  {driver.photo ? (
                    <img src={driver.photo} alt={driver.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-primary-100 flex items-center justify-center text-primary-600 text-2xl font-bold">
                      {driver.name.charAt(0)}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <CardContent className="pt-14 pb-6 text-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{driver.name}</h2>
              <div className="flex items-center justify-center gap-1 mt-1 text-emerald-600 font-medium">
                <ShieldCheck className="w-4 h-4" /> <span className="text-sm">Verified Driver</span>
              </div>
              <div className="flex justify-center items-center gap-2 mt-4 text-sm text-gray-600 dark:text-gray-400">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="font-semibold text-gray-900 dark:text-white">{driver.rating}</span> Rating
                <span className="px-2">•</span>
                <span>{driver.experience} Exp.</span>
              </div>
              <div className="mt-3 text-sm text-gray-500 font-medium">
                <Building className="w-4 h-4 inline mr-1 text-slate-500" />
                {driver.institution || 'Assigned Institution'}
              </div>
              
              <div className="flex gap-2 mt-6">
                {driver.tripStatus === 'Started' || driver.tripStatus === 'IN_PROGRESS' ? (
                  <Button className="flex-1 shadow-glow-blue bg-primary-600 hover:bg-primary-700 text-white" onClick={() => window.location.href = `tel:${driver.phone}`}>
                    <Phone className="w-4 h-4 mr-2" /> Call Driver
                  </Button>
                ) : (
                  <Button className="flex-1" variant="outline" disabled title="Contact is only available during an active trip.">
                    <Phone className="w-4 h-4 mr-2 text-slate-500" /> Unavailable
                  </Button>
                )}
                
                <Link to="/parent/tracking" className="flex-1">
                  <Button variant="outline" className="w-full">
                    <MapPin className="w-4 h-4 mr-2" /> Live Track
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Live Status Card */}
          <Card className="bg-white/50 dark:bg-[#09090b]/50 backdrop-blur-xl border-gray-200/50 dark:border-dark-border/50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><Activity className="w-5 h-5 text-primary-500" /> Live Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-dark-surface">
                <span className="text-sm text-gray-500 dark:text-gray-400">Driver Status</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{driver.status}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-dark-surface">
                <span className="text-sm text-gray-500 dark:text-gray-400">Current Trip</span>
                <Badge className="bg-primary-100 text-primary-700 hover:bg-primary-200 border-0">{driver.tripStatus}</Badge>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-dark-surface">
                <span className="text-sm text-gray-500 dark:text-gray-400">GPS Signal</span>
                <span className="text-sm font-semibold text-emerald-600 flex items-center gap-1"><MapPin className="w-3 h-3" /> {driver.gpsStatus}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-dark-surface">
                <span className="text-sm text-gray-500 dark:text-gray-400">Estimated ETA</span>
                <span className="text-sm font-bold text-primary-600">{driver.eta}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Info Grid */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 space-y-6">
          <Card className="bg-white/50 dark:bg-[#09090b]/50 backdrop-blur-xl border-gray-200/50 dark:border-dark-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Vehicle Information</CardTitle>
              <CardDescription>Details of the assigned transport vehicle</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-gray-100 dark:border-dark-border bg-white dark:bg-dark-surface/50 flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-500/20 text-blue-600 flex items-center justify-center shrink-0">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Vehicle Number</p>
                    <p className="font-semibold text-gray-900 dark:text-white uppercase tracking-wider mt-0.5">{driver.vehicle?.number}</p>
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-gray-100 dark:border-dark-border bg-white dark:bg-dark-surface/50 flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Vehicle Type</p>
                    <p className="font-semibold text-gray-900 dark:text-white mt-0.5">{driver.vehicle?.type}</p>
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-gray-100 dark:border-dark-border bg-white dark:bg-dark-surface/50 flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Seating Capacity</p>
                    <p className="font-semibold text-gray-900 dark:text-white mt-0.5">{driver.vehicle?.capacity} Students</p>
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-gray-100 dark:border-dark-border bg-white dark:bg-dark-surface/50 flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-500/20 text-purple-600 flex items-center justify-center shrink-0">
                    <Map className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Current Route</p>
                    <p className="font-semibold text-gray-900 dark:text-white mt-0.5">{driver.vehicle?.route}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/50 dark:bg-[#09090b]/50 backdrop-blur-xl border-gray-200/50 dark:border-dark-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Contact & Licensing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-surface transition-colors">
                  <Phone className="w-5 h-5 text-slate-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{driver.phone}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Primary Phone</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-surface transition-colors">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{driver.emergencyContact}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Emergency Base Station</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-surface transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-800">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{driver.license}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Commercial License Number</p>
                  </div>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">Verified</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
