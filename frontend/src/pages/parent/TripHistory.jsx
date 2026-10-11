import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/shared/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Calendar as CalendarIcon, MapPin, Navigation, Bus, Clock, CheckCircle, ChevronRight, User, AlertCircle, X, ShieldCheck, Activity } from 'lucide-react';
import { cn } from '../../lib/utils';
import { parentApi } from '../../services/api';
import toast from 'react-hot-toast';
import { MapContainer, TileLayer, Polyline, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const groupTripsByDate = (tripsList) => {
  return tripsList.reduce((acc, trip) => {
    if (!acc[trip.date]) acc[trip.date] = [];
    acc[trip.date].push(trip);
    return acc;
  }, {});
};

export default function TripHistory() {
  const [filter, setFilter] = useState('ALL');
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTripId, setSelectedTripId] = useState(null);
  const [tripDetails, setTripDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const res = await parentApi.getTripHistory();
      setTrips(res.data?.data || []);
    } catch (err) {
      toast.error('Failed to load trip history');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (id) => {
    try {
      setLoadingDetails(true);
      setSelectedTripId(id);
      setIsModalOpen(true);
      const res = await parentApi.getTripDetails(id);
      setTripDetails(res.data?.data || null);
    } catch (err) {
      toast.error('Failed to load trip details');
      setIsModalOpen(false);
    } finally {
      setLoadingDetails(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setTripDetails(null);
      setSelectedTripId(null);
    }, 300);
  };

  // Filter Logic
  let filteredTrips = trips;
  if (filter !== 'ALL') {
    filteredTrips = filteredTrips.filter(t => t.type === filter);
  }
  if (selectedDate) {
    filteredTrips = filteredTrips.filter(t => t.date === selectedDate);
  }

  const groupedTrips = groupTripsByDate(filteredTrips);
  const dates = Object.keys(groupedTrips).sort((a, b) => new Date(b) - new Date(a));

  return (
    <DashboardLayout>
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6"
      >
        <div>
          <h1 className="text-2xl font-display font-semibold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <History className="w-6 h-6 text-primary-500" /> Trip History
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Complete timeline of your children's transport history</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-1 rounded-xl border border-gray-200 dark:border-gray-800">
            {['ALL', 'PICKUP', 'DROP'].map(f => (
              <button 
                key={f} 
                onClick={() => setFilter(f)} 
                className={cn(
                  "px-4 py-2 rounded-lg text-xs font-bold transition-all",
                  filter === f ? "bg-primary-500 text-white shadow-sm" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="relative">
            <CalendarIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="pl-9 pr-3 h-10 rounded-lg border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white"
            />
          </div>
          {selectedDate && (
            <Button variant="ghost" size="sm" onClick={() => setSelectedDate('')} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
              Clear Date
            </Button>
          )}
        </div>
      </motion.div>

      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 shrink-0" />
              <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl w-full md:w-1/2" />
            </div>
          ))}
        </div>
      ) : dates?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
            <CalendarIcon className="w-10 h-10 text-slate-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Trips Found</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            {selectedDate 
              ? `There are no recorded trips on ${new Date(selectedDate).toLocaleDateString('en-US', { dateStyle: 'long' })}.`
              : "You don't have any recorded trips for the selected filter."}
          </p>
          {selectedDate && (
            <Button onClick={() => setSelectedDate('')} className="mt-6 bg-primary-600 hover:bg-primary-700 text-white">
              Clear Date Filter
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 dark:before:via-gray-800 before:to-transparent">
          <AnimatePresence>
            {dates?.map((date, dateIndex) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: dateIndex * 0.1 }}
                key={date} 
                className="relative"
              >
                <div className="flex items-center justify-center mb-6 relative z-10">
                  <Badge variant="outline" className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 px-4 py-1.5 text-sm font-semibold shadow-sm text-gray-700 dark:text-gray-300 rounded-full">
                    {new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </Badge>
                </div>

                <div className="space-y-6">
                  {groupedTrips[date].map((trip, i) => (
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: (dateIndex * 0.1) + (i * 0.05) }}
                      key={trip.id} 
                      className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-gray-50 dark:border-[#09090b] bg-white dark:bg-gray-900 shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 absolute left-0 md:left-1/2 -translate-x-1/2 z-10">
                        {trip.type === 'PICKUP' ? (
                          <Navigation className="w-4 h-4 text-blue-500" />
                        ) : (
                          <MapPin className="w-4 h-4 text-emerald-500" />
                        )}
                      </div>

                      <Card className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] bg-white/60 dark:bg-[#09090b]/60 backdrop-blur-xl border-gray-200/50 dark:border-dark-border/50 hover:shadow-md transition-all ml-auto md:ml-0 group-hover:border-primary-500/30">
                        <div className="p-5">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1.5">
                                <Badge variant="outline" className={cn(
                                  "px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold border",
                                  trip.type === 'PICKUP' ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-800/50" : "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-800/50"
                                )}>
                                  {trip.type}
                                </Badge>
                                <Badge variant="outline" className={cn(
                                  "px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold border flex items-center gap-1",
                                  trip.status === 'COMPLETED' ? "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700" : "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-800/50"
                                )}>
                                  {trip.status === 'COMPLETED' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                  {trip.status.replace('_', ' ')}
                                </Badge>
                              </div>
                              <h3 className="font-semibold text-gray-900 dark:text-white text-lg flex items-center gap-2">
                                {trip.scheduledTime || 'Unknown'} {trip.endTime && <span className="text-slate-500 font-normal text-sm">→ {trip.endTime}</span>}
                              </h3>
                            </div>
                            
                            <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center text-primary-600">
                              <span className="text-xs font-bold">{trip.children?.length || 0}</span>
                              <span className="text-[9px] uppercase tracking-wider font-semibold">Kids</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                            <div className="p-2.5 rounded-lg bg-gray-50/80 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mb-0.5"><User className="w-3.5 h-3.5" /> Driver</div>
                              <p className="font-medium text-gray-900 dark:text-white truncate">{trip.driver?.name || 'Unknown'}</p>
                            </div>
                            <div className="p-2.5 rounded-lg bg-gray-50/80 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mb-0.5"><Bus className="w-3.5 h-3.5" /> Vehicle</div>
                              <p className="font-mono font-medium text-gray-900 dark:text-white">{trip.vehicle?.number || 'Unknown'}</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800/80 pt-4">
                            <div className="flex flex-wrap gap-1.5">
                              {trip.children?.map(c => (
                                <Badge key={c.childId} variant="outline" className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-[11px]">
                                  {c.name}
                                </Badge>
                              ))}
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 text-xs text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-500/10"
                              onClick={() => handleViewDetails(trip.id)}
                            >
                              Details <ChevronRight className="w-3.5 h-3.5 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Trip Details Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={closeModal}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-[#09090b] rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden relative z-10 flex flex-col max-h-[90vh]"
            >
              <div className="p-4 md:p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary-500" /> Trip Details
                </h2>
                <button onClick={closeModal} className="p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="overflow-y-auto p-4 md:p-6 flex-1">
                {loadingDetails ? (
                  <div className="flex flex-col items-center justify-center h-48 space-y-4">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
                    <p className="text-sm text-gray-500">Loading trip information...</p>
                  </div>
                ) : !tripDetails ? (
                  <div className="flex flex-col items-center justify-center h-48 text-center text-gray-500">
                    <AlertCircle className="w-10 h-10 text-red-400 mb-2" />
                    <p>Failed to load trip details.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Header Info */}
                    <div className="flex flex-wrap gap-4 items-center justify-between">
                      <div>
                        <Badge variant="outline" className={cn(
                          "px-3 py-1 text-xs uppercase tracking-wider font-bold mb-2 border",
                          tripDetails.type === 'PICKUP' ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400" : "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400"
                        )}>
                          {tripDetails.type}
                        </Badge>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                          {new Date(tripDetails.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
                          <Clock className="w-4 h-4" /> 
                          {tripDetails.scheduledTime} {tripDetails.endTime ? ` - ${tripDetails.endTime}` : ''}
                        </p>
                      </div>
                      <Badge className={cn(
                        "px-4 py-1.5 text-sm font-semibold rounded-full",
                        tripDetails.status === 'COMPLETED' ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                      )}>
                        {tripDetails.status.replace('_', ' ')}
                      </Badge>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1"><User className="w-3.5 h-3.5" /> Driver</p>
                        <p className="font-semibold text-gray-900 dark:text-white truncate">{tripDetails.driver?.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{tripDetails.driver?.phone}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1"><Bus className="w-3.5 h-3.5" /> Vehicle</p>
                        <p className="font-semibold font-mono text-gray-900 dark:text-white truncate">{tripDetails.vehicle?.number}</p>
                        <p className="text-xs text-gray-500 mt-1">{tripDetails.vehicle?.type?.replace('_', ' ')}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> Route</p>
                        <p className="font-semibold text-gray-900 dark:text-white truncate">{tripDetails.route?.name || 'Standard Route'}</p>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">Safe Journey</p>
                      </div>
                      <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1"><Navigation className="w-3.5 h-3.5" /> Distance</p>
                        <p className="font-semibold text-gray-900 dark:text-white truncate">{tripDetails.distance || 0} km</p>
                        <p className="text-xs text-gray-500 mt-1">{tripDetails.duration || 0} mins</p>
                      </div>
                    </div>

                    {/* Children Attendance */}
                    <div>
                      <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-emerald-500" /> Attendance
                      </h4>
                      <div className="space-y-3">
                        {tripDetails.children?.map(child => (
                          <div key={child.childId} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#09090b]">
                            <span className="font-medium">{child.name}</span>
                            <div className="flex gap-2">
                              {tripDetails.type === 'PICKUP' ? (
                                <Badge variant="outline" className={cn(
                                  child.pickupStatus === 'PICKED_UP' ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-orange-50 text-orange-700 border-orange-200"
                                )}>
                                  {child.pickupStatus.replace('_', ' ')}
                                </Badge>
                              ) : (
                                <Badge variant="outline" className={cn(
                                  child.dropStatus === 'DROPPED' ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-orange-50 text-orange-700 border-orange-200"
                                )}>
                                  {child.dropStatus.replace('_', ' ')}
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Route Map (Static visualization) */}
                    <div>
                      <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-blue-500" /> Route Taken
                      </h4>
                      <div className="h-[250px] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 relative z-0">
                        <MapContainer 
                          center={[12.9716, 77.5946]} 
                          zoom={13} 
                          style={{ height: '100%', width: '100%' }}
                          zoomControl={false}
                          dragging={false}
                          scrollWheelZoom={false}
                        >
                          <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
                          <Polyline positions={[[12.9716, 77.5946], [12.9850, 77.6150]]} color="#3b82f6" weight={4} dashArray="8, 8" />
                          <Marker position={[12.9716, 77.5946]} />
                          <Marker position={[12.9850, 77.6150]} />
                        </MapContainer>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
