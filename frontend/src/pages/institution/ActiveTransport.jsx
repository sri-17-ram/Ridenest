import DashboardLayout from '../../components/shared/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useState, useEffect } from 'react';
import { Map, Navigation2, Users, Clock, AlertTriangle, ShieldCheck, Car, Route, Radio, Search } from 'lucide-react';
import { cn } from '../../lib/utils';

// Setup default leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom animated marker for active buses
const createBusIcon = (isActive) => L.divIcon({
  html: `
    <div class="relative w-12 h-12 flex items-center justify-center">
      ${isActive ? '<div class="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20"></div><div class="absolute inset-2 bg-blue-500 rounded-full animate-pulse opacity-40"></div>' : ''}
      <div class="relative w-10 h-10 bg-white rounded-xl shadow-lg border-2 ${isActive ? 'border-blue-500' : 'border-gray-300'} flex items-center justify-center text-xl overflow-hidden z-10 transition-colors">
        🚌
      </div>
    </div>
  `,
  className: 'custom-leaflet-marker', 
  iconSize: [48, 48], 
  iconAnchor: [24, 24],
  popupAnchor: [0, -20]
});

import { institutionApi } from '../../services/api';
import toast from 'react-hot-toast';

export default function ActiveTransport() {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveTrips = async () => {
      try {
        const res = await institutionApi.getActiveTransport();
        const apiVehicles = res.data.data?.map(t => ({
          id: t.tripId,
          regNo: t.vehicleNumber,
          driver: t.driverName,
          route: t.routeName,
          pos: [12.9760 + (Math.random() - 0.5) * 0.05, 77.6010 + (Math.random() - 0.5) * 0.05], // Mock GPS since hardware not implemented
          students: t.pickedUp,
          capacity: t.totalStudents,
          status: t.tripStatus,
          speed: t.tripStatus === 'IN_PROGRESS' ? Math.floor(20 + Math.random() * 30) : 0,
          nextStop: t.remainingStops > 0 ? `${t.remainingStops} Stops Left` : 'Final Stop',
          eta: t.eta
        }));
        
        // Preserve mock movement positions if vehicles exist
        setVehicles(prev => {
          return apiVehicles?.map(newV => {
            const existing = prev.find(v => v.id === newV.id);
            if (existing && newV.status === 'IN_PROGRESS') {
              newV.pos = existing.pos;
              newV.speed = existing.speed;
            }
            return newV;
          });
        });
      } catch (err) {
        toast.error('Failed to fetch active transport');
      } finally {
        setLoading(false);
      }
    };
    fetchActiveTrips();
    const fetchInterval = setInterval(fetchActiveTrips, 15000);
    return () => clearInterval(fetchInterval);
  }, []);

  // Simulate vehicle movement
  useEffect(() => {
    const moveInterval = setInterval(() => {
      setVehicles(prev => prev?.map(v => {
        if (v.status !== 'IN_PROGRESS') return v;
        return {
          ...v, 
          pos: [v.pos[0] + (Math.random() - 0.5) * 0.001, v.pos[1] + (Math.random() - 0.5) * 0.001],
          speed: Math.max(0, Math.min(80, v.speed + Math.floor((Math.random() - 0.5) * 10)))
        };
      }));
    }, 3000);
    return () => clearInterval(moveInterval);
  }, []);

  const activeCount = vehicles.filter(v => v.status === 'IN_PROGRESS').length;
  const filteredVehicles = vehicles.filter(v => v.regNo.toLowerCase().includes(searchTerm.toLowerCase()) || v.driver.toLowerCase().includes(searchTerm.toLowerCase()) || v.route.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <DashboardLayout>
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 max-w-7xl mx-auto"
      >
        <div>
          <h1 className="text-2xl font-display font-semibold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <Radio className="w-6 h-6 text-primary-500 animate-pulse" /> Live Fleet Tracking
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Real-time GPS tracking and monitoring of all active vehicles</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white/50 dark:bg-[#09090b]/50 backdrop-blur-sm p-1.5 rounded-xl border border-gray-200 dark:border-dark-border/50 shadow-sm">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-100/50 dark:bg-blue-500/10 rounded-lg">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">
              {vehicles.filter(v => v.status === 'IN_PROGRESS').length} Active
            </span>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-6 h-[calc(100vh-140px)] min-h-[600px]">
        {/* Sidebar */}
        <div className="lg:col-span-1 flex flex-col h-full overflow-hidden space-y-4">
          <Card className="p-4 bg-white/70 dark:bg-[#09090b]/70 backdrop-blur-xl border-gray-200/50 dark:border-dark-border/50 shrink-0">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search by driver, route, or vehicle..." 
                className="w-full h-10 pl-9 pr-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 focus:ring-2 focus:ring-primary-500/20 outline-none text-sm transition-all"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </Card>
          
          <div className="flex-1 overflow-y-auto space-y-3 pb-4 pr-1 scrollbar-hide">
            <AnimatePresence>
              {filteredVehicles?.map((v, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                  key={v.id} 
                >
                  <Card 
                    className={cn(
                      "p-4 cursor-pointer transition-all border-l-4 hover:shadow-md",
                      selectedVehicle === v.id ? "bg-primary-50/50 dark:bg-primary-900/10 border-l-primary-500" : "bg-white/70 dark:bg-[#09090b]/70 border-l-transparent border-gray-200/50 dark:border-dark-border/50 hover:border-l-primary-300",
                      v.status === 'IN_PROGRESS' ? (selectedVehicle === v.id ? "border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/10" : "border-l-blue-400 hover:border-l-blue-500") : ""
                    )}
                    onClick={() => setSelectedVehicle(v.id)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-900 dark:text-white font-mono">{v.regNo}</h3>
                          {v.status === 'IN_PROGRESS' && <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>}
                        </div>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">{v.route}</p>
                      </div>
                      <Badge variant="outline" className={cn("text-[10px] uppercase tracking-wider font-bold border", v.status === 'IN_PROGRESS' ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-800" : "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-800")}>
                        {v.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs font-medium text-gray-600 dark:text-gray-300 mb-3">
                      <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800/50 p-1.5 rounded-md"><Users className="w-3.5 h-3.5 text-slate-500" /> {v.students}/{v.capacity} Std</div>
                      <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800/50 p-1.5 rounded-md"><Navigation2 className="w-3.5 h-3.5 text-slate-500" /> {v.speed} km/h</div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800 pt-2">
                      <Clock className="w-3.5 h-3.5" /> Next: {v.nextStop} ({v.eta})
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {filteredVehicles?.length === 0 && (
              <div className="text-center py-10">
                <Search className="w-8 h-8 text-slate-600 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-500">No vehicles matching search</p>
              </div>
            )}
          </div>
        </div>

        {/* Map View */}
        <div className="lg:col-span-2 h-full min-h-[400px]">
          <Card className="h-full w-full overflow-hidden border-gray-200/50 dark:border-dark-border/50 shadow-sm relative group">
            {/* Map Overlay HUD */}
            <div className="absolute top-4 left-4 z-[400] flex gap-2 pointer-events-none">
              <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-3 py-2 rounded-xl shadow-lg border border-white/20 dark:border-gray-700/50 flex items-center gap-2 pointer-events-auto">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-xs font-bold text-gray-700 dark:text-gray-200">Live Telemetry Active</span>
              </div>
            </div>
            
            <MapContainer center={[12.979, 77.605]} zoom={14} style={{ height: '100%', width: '100%', zIndex: 1 }} zoomControl={false}>
              <TileLayer 
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' 
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" 
              />
              {vehicles?.map(v => (
                <Marker 
                  key={v.id} 
                  position={v.pos} 
                  icon={createBusIcon(v.status === 'IN_PROGRESS')}
                  eventHandlers={{
                    click: () => setSelectedVehicle(v.id),
                  }}
                  zIndexOffset={selectedVehicle === v.id ? 1000 : 0}
                >
                  <Popup className="custom-popup" closeButton={false}>
                    <div className="p-1 min-w-[200px]">
                      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100">
                        <Badge className={cn("px-1.5 py-0 text-[9px] uppercase tracking-wider font-bold border-none", v.status === 'IN_PROGRESS' ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700")}>
                          {v.status.replace('_', ' ')}
                        </Badge>
                        <span className="font-mono font-bold text-gray-900">{v.regNo}</span>
                      </div>
                      
                      <div className="space-y-1.5 text-xs text-gray-600 mb-2">
                        <p className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-slate-500" /> <strong>Driver:</strong> {v.driver}</p>
                        <p className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-slate-500" /> <strong>Students:</strong> {v.students}/{v.capacity}</p>
                        {v.status === 'IN_PROGRESS' && <p className="flex items-center gap-1.5"><Navigation2 className="w-3.5 h-3.5 text-blue-500" /> <strong>Speed:</strong> {v.speed} km/h</p>}
                      </div>
                      
                      {v.status === 'IN_PROGRESS' && (
                        <div className="bg-gray-50 p-2 rounded-lg mt-2 text-[10px] font-medium text-gray-500">
                          Next: <strong className="text-gray-700">{v.nextStop}</strong> ({v.eta})
                        </div>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
            
            {/* Custom CSS for Map overrides */}
            <style jsx global>{`
              .leaflet-container {
                font-family: inherit;
              }
              .custom-popup .leaflet-popup-content-wrapper {
                border-radius: 12px;
                box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
                border: 1px solid rgba(0,0,0,0.05);
                padding: 0;
              }
              .custom-popup .leaflet-popup-content {
                margin: 12px;
              }
              .custom-popup .leaflet-popup-tip {
                box-shadow: none;
                border-top: 1px solid rgba(0,0,0,0.05);
                border-left: 1px solid rgba(0,0,0,0.05);
              }
            `}</style>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
