import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/shared/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin, Plus, Trash2, Edit2, CheckCircle2, Navigation, Map } from 'lucide-react';
import { parentApi } from '../../services/api';
import toast from 'react-hot-toast';

// Fix Leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function LocationMarker({ position, setPosition, onMapClick }) {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      if (onMapClick) onMapClick(e.latlng);
    },
  });

  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom(), { animate: true, duration: 1.5 });
    }
  }, [position, map]);

  return position === null ? null : (
    <Marker position={position}>
      <Popup>Selected Location</Popup>
    </Marker>
  );
}

export default function PickupDropLocations() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [selectedPos, setSelectedPos] = useState(null);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [syncedAddress, setSyncedAddress] = useState('');

  const [formData, setFormData] = useState({
    type: 'PICKUP',
    address: '',
    landmark: '',
    nickname: '',
    default: false
  });

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const res = await parentApi.getLocations();
      setLocations(res.data?.data || []);
    } catch (err) {
      toast.error('Failed to load locations');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (loc = null) => {
    if (loc) {
      setEditingLocation(loc);
      setSelectedPos({ lat: loc.latitude, lng: loc.longitude });
      setSyncedAddress(loc.address);
      setFormData({
        type: loc.type,
        address: loc.address,
        landmark: loc.landmark || '',
        nickname: loc.nickname || '',
        default: loc.default
      });
    } else {
      setEditingLocation(null);
      setSelectedPos(null);
      setSyncedAddress('');
      setFormData({
        type: 'PICKUP',
        address: '',
        landmark: '',
        nickname: '',
        default: false
      });
    }
    setIsModalOpen(true);
  };

  const handleMapClick = async (latlng) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`);
      const data = await res.json();
      if (data && data.display_name) {
        setFormData(prev => ({ ...prev, address: data.display_name }));
        setSyncedAddress(data.display_name);
      }
    } catch (err) {
      console.error('Reverse geocoding failed', err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    let finalPos = selectedPos;

    if (!finalPos || formData.address !== syncedAddress) {
      if (!formData.address.trim()) {
        toast.error('Please enter an address');
        return;
      }
      setIsGeocoding(true);
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.address)}`);
        const data = await res.json();
        if (data && data?.length > 0) {
          finalPos = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
          setSelectedPos(finalPos);
          setSyncedAddress(formData.address);
        } else {
          toast.error('Location not found. Please refine the address or select it from the map.');
          setIsGeocoding(false);
          return;
        }
      } catch (err) {
        toast.error('Location not found. Please refine the address or select it from the map.');
        setIsGeocoding(false);
        return;
      }
      setIsGeocoding(false);
    }

    if (!finalPos) {
      toast.error('Please select a location on the map');
      return;
    }

    const payload = {
      ...formData,
      latitude: selectedPos.lat,
      longitude: selectedPos.lng
    };

    try {
      if (editingLocation) {
        await parentApi.updateLocation(editingLocation.id, payload);
        toast.success('Location updated');
      } else {
        await parentApi.addLocation(payload);
        toast.success('Location added');
      }
      setIsModalOpen(false);
      fetchLocations();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save location');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this location?')) {
      try {
        await parentApi.deleteLocation(id);
        toast.success('Location deleted');
        fetchLocations();
      } catch (err) {
        toast.error('Failed to delete location');
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-display font-semibold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <Map className="w-6 h-6 text-primary-500" /> Pickup & Drop Locations
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage where your child is picked up and dropped off</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="bg-primary-600 hover:bg-primary-700 text-white">
          <Plus className="w-4 h-4 mr-2" /> Add Location
        </Button>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 gap-4">
          {[1, 2].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="h-32 bg-gray-100 dark:bg-gray-800" />
            </Card>
          ))}
        </div>
      ) : locations?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <MapPin className="w-8 h-8 text-slate-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No Locations Saved</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-sm">You haven't saved any pickup or drop locations yet. Add one to get started.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations?.map(loc => (
            <Card key={loc.id} className="relative overflow-hidden hover:shadow-md transition-shadow">
              {loc.default && (
                <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg flex items-center gap-1 z-10">
                  <CheckCircle2 className="w-3 h-3" /> DEFAULT
                </div>
              )}
              <div className="h-32 bg-gray-100 dark:bg-gray-800 relative z-0">
                <MapContainer 
                  center={[loc.latitude, loc.longitude]} 
                  zoom={14} 
                  style={{ height: '100%', width: '100%' }}
                  zoomControl={false}
                  dragging={false}
                >
                  <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
                  <Marker position={[loc.latitude, loc.longitude]} />
                </MapContainer>
              </div>
              <CardContent className="p-4 bg-white dark:bg-[#09090b] relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className={loc.type === 'PICKUP' ? "text-blue-600 bg-blue-50 border-blue-200" : "text-emerald-600 bg-emerald-50 border-emerald-200"}>
                    {loc.type === 'PICKUP' ? <Navigation className="w-3 h-3 mr-1" /> : <MapPin className="w-3 h-3 mr-1" />}
                    {loc.type}
                  </Badge>
                  {loc.nickname && <span className="text-sm font-semibold text-gray-900 dark:text-white">{loc.nickname}</span>}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 min-h-[40px]">{loc.address}</p>
                {loc.landmark && <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> {loc.landmark}</p>}
                
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleOpenModal(loc)}>
                    <Edit2 className="w-4 h-4 mr-2" /> Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20" onClick={() => handleDelete(loc.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <h2 className="text-xl font-bold">{editingLocation ? 'Edit Location' : 'Add New Location'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">×</button>
            </div>
            <form onSubmit={handleSave} className="overflow-y-auto flex-1 p-4 md:p-6 space-y-4">
              
              <div className="h-[300px] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 relative z-0">
                <MapContainer center={selectedPos || [12.9716, 77.5946]} zoom={13} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
                  <LocationMarker position={selectedPos} setPosition={setSelectedPos} onMapClick={handleMapClick} />
                </MapContainer>
                <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-white/90 px-3 py-1.5 rounded-lg shadow-sm text-xs font-semibold z-[400] pointer-events-none">
                  Click on the map to pin location
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Type</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="PICKUP">Pickup Point</option>
                    <option value="DROP">Drop Point</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Nickname (Optional)</label>
                  <Input 
                    value={formData.nickname}
                    onChange={(e) => setFormData({...formData, nickname: e.target.value})}
                    placeholder="e.g. Home, Grandma's House"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Full Address *</label>
                <Input 
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="Street address, building number..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Landmark (Optional)</label>
                <Input 
                  value={formData.landmark}
                  onChange={(e) => setFormData({...formData, landmark: e.target.value})}
                  placeholder="Near supermarket, opposite to park..."
                />
              </div>

              <div className="flex items-center gap-2 py-2">
                <input 
                  type="checkbox" 
                  id="defaultLoc" 
                  checked={formData.default}
                  onChange={(e) => setFormData({...formData, default: e.target.checked})}
                  className="w-4 h-4 text-primary-600 rounded border-gray-300"
                />
                <label htmlFor="defaultLoc" className="text-sm font-medium">Set as default {formData.type.toLowerCase()} location</label>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isGeocoding}>
                  {isGeocoding ? 'Finding Location...' : 'Save Location'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
