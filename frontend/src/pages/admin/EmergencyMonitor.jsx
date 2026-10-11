import { useState } from 'react';
import DashboardLayout from '../../components/shared/DashboardLayout';
import { AlertTriangle, MapPin, X, Phone, Smartphone, CheckCircle, ShieldAlert, History, Activity, Siren, PlusSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { cn } from '../../lib/utils';
import { useAlerts } from '../../context/AlertContext';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const emergIcon = L.divIcon({
  html: `<div style="background:#ef4444;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;border:3px solid white;box-shadow:0 0 16px rgba(239,68,68,0.9);animation:pulse 1s infinite">🚨</div>`,
  className: '', iconSize: [36, 36], iconAnchor: [18, 18],
});

const hospitalIcon = L.divIcon({
  html: `<div style="background:#10b981;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.2)">H</div>`,
  className: '', iconSize: [28, 28], iconAnchor: [14, 14],
});

const policeIcon = L.divIcon({
  html: `<div style="background:#3b82f6;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.2)">P</div>`,
  className: '', iconSize: [28, 28], iconAnchor: [14, 14],
});

const mockHospitals = [
  { id: 'h1', lat: 12.980, lng: 77.610, name: 'City Central Hospital', type: 'Hospital' },
  { id: 'h2', lat: 12.972, lng: 77.595, name: 'Lifeline Emergency Care', type: 'Hospital' }
];

const mockPolice = [
  { id: 'p1', lat: 12.985, lng: 77.602, name: 'District Police Station', type: 'Police' }
];

export default function EmergencyMonitor() {
  const { alerts, resolveAlert } = useAlerts();
  const [selectedAlert, setSelectedAlert] = useState(null);

  const activeAlerts = alerts.filter(a => !a.resolved);
  const resolvedAlerts = alerts.filter(a => a.resolved);

  return (
    <DashboardLayout>
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6"
      >
        <div>
          <h1 className="text-2xl font-display font-semibold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-7 h-7 text-red-500" /> Emergency Monitor
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Real-time emergency response and safety alert management</p>
        </div>
        <div className="flex items-center gap-3">
          <AnimatePresence>
            {activeAlerts?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <Badge className="h-9 px-4 rounded-lg bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-500/20 dark:text-red-400 border border-red-200 dark:border-red-900/50 flex items-center gap-2 shadow-glow-red animate-pulse">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                  </span>
                  {activeAlerts?.length} Active Alert{activeAlerts?.length > 1 ? 's' : ''}
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Simulation Controls for Phase 3 Request */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50" onClick={() => toast('SOS Button Triggered by Driver!', { icon: '🆘', style: { background: '#ef4444', color: '#fff' } })}>
          <ShieldAlert className="w-4 h-4 mr-2" /> Simulate SOS
        </Button>
        <Button variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50" onClick={() => toast('Route Deviation Detected. Geofence breached.', { icon: '🗺️', style: { background: '#f97316', color: '#fff' } })}>
          <MapPin className="w-4 h-4 mr-2" /> Route Deviation
        </Button>
        <Button variant="outline" className="border-amber-200 text-amber-600 hover:bg-amber-50" onClick={() => toast('Overspeed Alert: 85km/h in 40km/h zone.', { icon: '⚠️', style: { background: '#f59e0b', color: '#fff' } })}>
          <Activity className="w-4 h-4 mr-2" /> Overspeed
        </Button>
        <Button variant="outline" className="border-red-500 text-red-600 hover:bg-red-50" onClick={() => toast('CRITICAL: Accident suspected. High impact detected.', { icon: '💥', style: { background: '#991b1b', color: '#fff' } })}>
          <AlertTriangle className="w-4 h-4 mr-2" /> Accident Detect
        </Button>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Alert List */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white/50 dark:bg-[#09090b]/50 backdrop-blur-xl border-gray-200/50 dark:border-dark-border/50">
            <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-800">
              <CardTitle className="text-lg flex items-center justify-between">
                Active Alerts
                {activeAlerts?.length > 0 && <Badge variant="destructive" className="ml-2 bg-red-500">{activeAlerts?.length}</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                <AnimatePresence>
                  {activeAlerts?.map(alert => (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      key={alert.id}
                      onClick={() => setSelectedAlert(alert)}
                      className={cn(
                        "p-4 cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-800/50 relative overflow-hidden group",
                        selectedAlert?.id === alert.id ? "bg-red-50 dark:bg-red-900/10" : ""
                      )}
                    >
                      <div className={cn(
                        "absolute left-0 top-0 bottom-0 w-1",
                        alert.priority === 'CRITICAL' ? 'bg-red-500' : 'bg-orange-500',
                        selectedAlert?.id === alert.id ? 'w-1.5' : ''
                      )} />
                      
                      <div className="flex items-start justify-between pl-2">
                        <div>
                          <p className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1.5">
                            {alert.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1.5">
                            <span className="font-medium text-gray-700 dark:text-gray-300">Child:</span> {alert.child}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">{alert.trip} • {alert.time}</p>
                        </div>
                        <Badge variant="outline" className={cn(
                          "text-[10px] uppercase tracking-wider font-bold border-0 px-2 py-0 h-5",
                          alert.priority === 'CRITICAL' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400'
                        )}>
                          {alert.priority}
                        </Badge>
                      </div>
                      
                      <div className="pl-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={(e) => { e.stopPropagation(); resolveAlert(alert.id); }}
                          className="h-7 px-2 text-xs text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400"
                        >
                          <CheckCircle className="w-3.5 h-3.5 mr-1" /> Mark Resolved
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {activeAlerts?.length === 0 && (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    <ShieldAlert className="w-12 h-12 mx-auto mb-3 text-emerald-500/50" />
                    <p className="font-medium text-sm text-emerald-600 dark:text-emerald-400">All Clear</p>
                    <p className="text-xs mt-1">No active emergency alerts at this time.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/50 dark:bg-[#09090b]/50 backdrop-blur-xl border-gray-200/50 dark:border-dark-border/50">
            <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-800">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <History className="w-4 h-4" /> Resolved Today ({resolvedAlerts?.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <div className="space-y-2 max-h-[200px] overflow-y-auto no-scrollbar pr-2">
                {resolvedAlerts?.map(alert => (
                  <div key={alert.id} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 line-through decoration-gray-400">{alert.title}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{alert.trip} • {alert.time}</p>
                  </div>
                ))}
                {resolvedAlerts?.length === 0 && (
                  <p className="text-xs text-center py-4 text-slate-500">No resolved alerts today.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Map & Actions */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="overflow-hidden border-gray-200 dark:border-dark-border shadow-xl h-[450px] relative z-0">
            <MapContainer center={[12.978, 77.605]} zoom={14} style={{ height: '100%', width: '100%' }} zoomControl={false}>
              <TileLayer
                attribution='&copy; OpenStreetMap'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              />
              {alerts?.map(alert => (
                <Marker key={alert.id} position={[alert.lat, alert.lng]} icon={alert.resolved ? undefined : emergIcon}>
                  <Popup className="premium-popup">
                    <div className="p-1 min-w-[200px]">
                      <p className={cn("font-bold text-base mb-1", alert.resolved ? "text-gray-700" : "text-red-600")}>{alert.title}</p>
                      <div className="space-y-1 text-sm mb-3">
                        <p className="flex justify-between"><span className="text-gray-500">Child:</span> <span className="font-medium text-gray-900">{alert.child}</span></p>
                        <p className="flex justify-between"><span className="text-gray-500">Time:</span> <span className="font-medium text-gray-900">{alert.time}</span></p>
                        <p className="text-xs text-slate-500 mt-1 pt-1 border-t border-gray-100">{alert.trip}</p>
                      </div>
                      {!alert.resolved && (
                        <Button 
                          onClick={() => resolveAlert(alert.id)} 
                          className="w-full h-8 text-xs bg-emerald-500 hover:bg-emerald-600 text-white"
                        >
                          <CheckCircle className="w-3.5 h-3.5 mr-1" /> Resolve Alert
                        </Button>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
              {/* Highlight active alerts with circles */}
              {activeAlerts?.map(alert => (
                <Circle 
                  key={`circle-${alert.id}`} 
                  center={[alert.lat, alert.lng]} 
                  radius={100} 
                  pathOptions={{ color: "#ef4444", fillColor: "#ef4444", fillOpacity: 0.1, weight: 1, dashArray: "4,4" }} 
                />
              ))}

              {/* Emergency Services */}
              {mockHospitals?.map(h => (
                <Marker key={h.id} position={[h.lat, h.lng]} icon={hospitalIcon}>
                  <Popup>
                    <div className="p-1">
                      <p className="font-bold text-emerald-700 flex items-center gap-1"><PlusSquare className="w-4 h-4" /> {h.name}</p>
                      <p className="text-xs text-gray-500 mt-1">Nearest Medical Facility</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
              {mockPolice?.map(p => (
                <Marker key={p.id} position={[p.lat, p.lng]} icon={policeIcon}>
                  <Popup>
                    <div className="p-1">
                      <p className="font-bold text-blue-700 flex items-center gap-1"><Siren className="w-4 h-4" /> {p.name}</p>
                      <p className="text-xs text-gray-500 mt-1">Emergency Dispatch</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </Card>

          <AnimatePresence mode="wait">
            {selectedAlert && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="border-red-200 dark:border-red-900/50 shadow-glow-red overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
                  <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-800 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-lg text-red-700 dark:text-red-400 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" /> Action Required: {selectedAlert.title}
                      </CardTitle>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setSelectedAlert(null)} className="h-8 w-8 rounded-full">
                      <X className="w-4 h-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-5">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                        <p className="text-[11px] uppercase tracking-wider font-semibold text-gray-500 mb-1">Child Involved</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedAlert.child}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                        <p className="text-[11px] uppercase tracking-wider font-semibold text-gray-500 mb-1">Trip Reference</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedAlert.trip}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                        <p className="text-[11px] uppercase tracking-wider font-semibold text-gray-500 mb-1">Reported Time</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedAlert.time}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button className="flex-1 h-11 bg-slate-800 hover:bg-slate-900 text-white shadow-md">
                        <Phone className="w-4 h-4 mr-2" /> Contact Driver
                      </Button>
                      <Button className="flex-1 h-11 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md">
                        <Smartphone className="w-4 h-4 mr-2" /> Contact Parent
                      </Button>
                      <Button 
                        variant="destructive" 
                        onClick={() => { resolveAlert(selectedAlert.id); setSelectedAlert(null); }} 
                        className="flex-1 h-11 shadow-glow-red"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" /> Resolve Incident
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
}
