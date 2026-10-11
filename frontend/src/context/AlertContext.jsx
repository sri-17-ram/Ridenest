import { createContext, useContext, useState } from 'react';
import toast from 'react-hot-toast';

const AlertContext = createContext();

export function AlertProvider({ children }) {
  const [alerts, setAlerts] = useState([]);

  const addAlert = (alert) => {
    const newAlert = {
      id: Date.now(),
      type: alert.type || 'EMERGENCY',
      title: alert.title || '🚨 Emergency Alert',
      child: alert.child || 'Unknown',
      trip: alert.trip || 'Current Trip',
      time: 'Just now',
      priority: alert.priority || 'CRITICAL',
      resolved: false,
      lat: alert.lat || 12.978,
      lng: alert.lng || 77.605,
    };
    setAlerts(prev => [newAlert, ...prev]);
    toast.error(newAlert.title + ' raised!', { style: { background: '#ef4444', color: '#fff' } });
  };

  const resolveAlert = (id) => {
    setAlerts(prev => prev?.map(a => a.id === id ? { ...a, resolved: true } : a));
    toast.success('Alert resolved globally.');
  };

  return (
    <AlertContext.Provider value={{ alerts, addAlert, resolveAlert }}>
      {children}
    </AlertContext.Provider>
  );
}

export const useAlerts = () => useContext(AlertContext);
