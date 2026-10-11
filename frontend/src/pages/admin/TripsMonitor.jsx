import DashboardLayout from '../../components/shared/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Map, Truck, Users, Hash, MapPin, Activity, User } from 'lucide-react';

const activeTrips = [
  { id: 1, driver: 'Ravi Kumar', vehicle: 'KA 01 AB 1234', children: 3, status: 'IN_PROGRESS', pos: [12.976, 77.601] },
  { id: 2, driver: 'Mohan Das', vehicle: 'KA 02 CD 5678', children: 4, status: 'IN_PROGRESS', pos: [12.982, 77.608] },
  { id: 3, driver: 'Ramesh Nair', vehicle: 'KA 03 EF 9012', children: 2, status: 'IN_PROGRESS', pos: [12.969, 77.597] },
];

const tripIcon = L.divIcon({
  html: `<div class="relative flex items-center justify-center w-10 h-10">
           <div class="absolute inset-0 bg-blue-500 rounded-full opacity-30 animate-ping"></div>
           <div class="relative flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full shadow-lg border-2 border-white text-white">
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 17h4V5H2v12h3"/><path d="M20 17h2v-9l-2.5-4H14v13h3"/><path d="m14 6 6 .01"/><circle cx="8.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>
           </div>
         </div>`,
  className: '', iconSize: [40, 40], iconAnchor: [20, 20], popupAnchor: [0, -20]
});

export default function TripsMonitor() {
  return (
    <DashboardLayout>
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6"
      >
        <div>
          <h1 className="text-2xl font-display font-semibold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <Map className="w-6 h-6 text-primary-500" /> Active Trips Monitor
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Live visualization of all platform trips currently in progress</p>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-140px)] min-h-[600px]">
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="lg:col-span-2 h-full flex flex-col">
          <Card className="bg-white/50 dark:bg-[#09090b]/50 backdrop-blur-xl border-gray-200/50 dark:border-dark-border/50 h-full overflow-hidden relative shadow-sm">
            <MapContainer center={[12.977, 77.604]} zoom={13} style={{ height: '100%', width: '100%', zIndex: 0 }} zoomControl={false}>
              <TileLayer 
                attribution='&copy; <a href="https://carto.com/">CartoDB</a>' 
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" 
              />
              <ZoomControl position="bottomright" />
              {activeTrips?.map(t => (
                <Marker key={t.id} position={t.pos} icon={tripIcon}>
                  <Popup className="premium-popup">
                    <div className="p-1">
                      <p className="font-bold text-gray-900 text-sm mb-1">Trip #{t.id}</p>
                      <div className="flex flex-col gap-1 text-xs text-gray-600">
                        <span className="flex items-center gap-1"><User className="w-3 h-3" /> {t.driver}</span>
                        <span className="flex items-center gap-1"><Hash className="w-3 h-3" /> {t.vehicle}</span>
                        <span className="flex items-center gap-1 font-semibold text-emerald-600"><Users className="w-3 h-3" /> {t.children} children aboard</span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
            
            <div className="absolute top-4 left-4 z-[400] pointer-events-none">
              <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-4 py-3 rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg flex items-center gap-3">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </div>
                <span className="font-bold text-gray-900 dark:text-white text-sm">System Live</span>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="h-full flex flex-col">
          <Card className="bg-white/50 dark:bg-[#09090b]/50 backdrop-blur-xl border-gray-200/50 dark:border-dark-border/50 h-full flex flex-col shadow-sm">
            <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-800/50 shrink-0">
              <CardTitle className="text-lg flex items-center justify-between text-gray-800 dark:text-gray-200">
                <span className="flex items-center gap-2"><Activity className="w-5 h-5 text-emerald-500" /> Live Manifest</span>
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-800">
                  {activeTrips?.length} Active
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {activeTrips?.map((t, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + (i * 0.1) }}
                  key={t.id} 
                  className="p-4 rounded-xl bg-gray-50/80 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 hover:border-primary-500/30 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors">Trip #{t.id}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t.driver}</p>
                    </div>
                    <div className="relative flex h-2.5 w-2.5 mt-1">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700/50">
                    <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300 font-mono">
                      <Truck className="w-3.5 h-3.5 text-slate-500" /> {t.vehicle}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                      <Users className="w-3.5 h-3.5" /> {t.children} children
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {activeTrips?.length === 0 && (
                <div className="text-center py-10">
                  <MapPin className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                  <p className="text-sm font-medium text-gray-500">No active trips right now</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
