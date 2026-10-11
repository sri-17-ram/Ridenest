import { useState } from 'react';
import DashboardLayout from '../../components/shared/DashboardLayout';
import { driverApi } from '../../services/api';
import { QrCode, Camera, CheckCircle, XCircle, Search, ScanLine, User, Car, Route, Clock, WifiOff, RefreshCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { cn } from '../../lib/utils';

export default function QrScanner() {
  const [inputToken, setInputToken] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scanMode, setScanMode] = useState('PICKUP');
  const [scannedTokens, setScannedTokens] = useState(new Set());
  const [offlineQueue, setOfflineQueue] = useState([]);
  
  const playSound = (type) => {
    // In a real app, load actual audio files. Using try/catch to prevent errors in environments without audio contexts
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.5, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      } else {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.5, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      }
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.2);
    } catch (e) {
      console.log('Audio not supported or blocked');
    }
  };

  const handleScan = async (token) => {
    const t = token || inputToken;
    if (!t) return;
    
    setScanning(true);
    setScanResult(null);

    // Simulated Invalid QR Detection
    if (!t.startsWith('QR-')) {
      playSound('error');
      setScanResult({ success: false, message: 'Invalid QR Code Format' });
      toast.error('Invalid QR Code Format');
      setScanning(false);
      return;
    }

    // Duplicate detection
    if (scannedTokens.has(t)) {
      playSound('error');
      setScanResult({ success: false, message: 'Duplicate Scan Detected: Child already marked.' });
      toast.error('Duplicate Scan Detected');
      setScanning(false);
      return;
    }

    try {
      // Simulate network error randomly for offline queue demo
      if (Math.random() > 0.9) throw new Error("Network Disconnected");

      const res = await driverApi.scanQr({ qrCodeToken: t.trim(), mode: scanMode });
      const data = res.data.data;
      
      setScannedTokens(prev => new Set(prev).add(t));
      setScanResult({ success: true, data, token: t.trim(), mode: scanMode });
      playSound('success');
      toast.success(`Child Verified Successfully! ${data.childName} confirmed for ${scanMode}.`, { style: { background: '#10b981', color: '#fff' } });
    } catch (err) {
      if (err.message === "Network Disconnected") {
        playSound('error');
        setOfflineQueue(prev => [...prev, { token: t, mode: scanMode, time: new Date().toISOString() }]);
        setScanResult({ success: false, message: 'Network offline. Saved to local queue.', isOffline: true });
        toast('Saved to offline queue', { icon: '🔄' });
      } else {
        playSound('error');
        const msg = err.response?.data?.message || 'Verification Failed';
        setScanResult({ success: false, message: msg });
        toast.error(msg, { style: { background: '#ef4444', color: '#fff' } });
      }
    } finally {
      setScanning(false);
    }
  };

  const syncOfflineQueue = () => {
    toast.success(`Synced ${offlineQueue?.length} offline scans to server.`);
    setScannedTokens(prev => {
      const updated = new Set(prev);
      offlineQueue.forEach(item => updated.add(item.token));
      return updated;
    });
    setOfflineQueue([]);
  };

  const simulateScan = () => {
    if (inputToken) {
        handleScan(inputToken);
    } else {
        toast.error("Enter a QR token manually to simulate scan.");
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-display font-semibold tracking-tight text-gray-900 dark:text-white">
            QR Code Scanner
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Scan child's unique QR code to confirm pickup or drop-off</p>
        </motion.div>
        
        {offlineQueue?.length > 0 && (
          <Button onClick={syncOfflineQueue} variant="outline" className="border-orange-200 text-orange-600 bg-orange-50 dark:border-orange-900/30 dark:bg-orange-900/10 dark:text-orange-400">
            <RefreshCcw className="w-4 h-4 mr-2" /> Sync {offlineQueue?.length} Offline Scans
          </Button>
        )}
      </div>

      <div className="max-w-xl mx-auto space-y-6">
        {/* Scan Mode Toggle */}
        <div className="flex bg-gray-100/50 dark:bg-gray-800/50 p-1 rounded-xl w-full max-w-sm mx-auto">
          <button 
            onClick={() => setScanMode('PICKUP')} 
            className={cn("flex-1 py-2 text-sm font-bold rounded-lg transition-all", scanMode === 'PICKUP' ? "bg-white dark:bg-gray-900 shadow-sm text-primary-600 dark:text-primary-400" : "text-gray-500")}
          >
            Pickup Mode
          </button>
          <button 
            onClick={() => setScanMode('DROP')} 
            className={cn("flex-1 py-2 text-sm font-bold rounded-lg transition-all", scanMode === 'DROP' ? "bg-white dark:bg-gray-900 shadow-sm text-primary-600 dark:text-primary-400" : "text-gray-500")}
          >
            Drop Mode
          </button>
        </div>

        {/* Scanner View */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-white/50 dark:bg-[#09090b]/50 backdrop-blur-xl border-gray-200/50 dark:border-dark-border/50 shadow-xl overflow-hidden">
            <div className="p-1 bg-gradient-to-r from-primary-500 via-indigo-500 to-primary-500 bg-[length:200%_auto] animate-gradient" />
            <CardContent className="p-6 md:p-8">
              <div className="relative w-full aspect-square max-w-[320px] mx-auto rounded-3xl overflow-hidden bg-[#09090b] flex items-center justify-center mb-8 shadow-inner border border-gray-800">
                
                {/* Scanning animation overlay */}
                <AnimatePresence>
                  {scanning && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 z-10"
                    >
                      <motion.div 
                        className="absolute inset-x-0 h-1 bg-primary-500 shadow-[0_0_20px_4px_rgba(59,130,246,0.6)]"
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ duration: 2.5, ease: "linear", repeat: Infinity }}
                      />
                      <div className="absolute inset-0 bg-primary-500/10" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Camera viewfinder */}
                <div className="absolute inset-0 flex items-center justify-center z-0">
                  {scanning ? (
                    <div className="text-center">
                      <div className="relative flex items-center justify-center mb-4">
                        <div className="w-16 h-16 border-4 border-primary-500/30 rounded-full"></div>
                        <div className="absolute w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                        <ScanLine className="w-6 h-6 text-primary-400 absolute animate-pulse" />
                      </div>
                      <p className="text-primary-400 text-sm font-medium tracking-wide">Processing QR Code...</p>
                    </div>
                  ) : (
                    <div className="text-center group cursor-pointer" onClick={simulateScan}>
                      <div className="w-24 h-24 rounded-2xl bg-gray-800/50 flex items-center justify-center mx-auto mb-4 border border-gray-700/50 group-hover:border-primary-500/50 transition-colors">
                        <QrCode className="w-12 h-12 text-gray-500 group-hover:text-primary-400 transition-colors" />
                      </div>
                      <p className="text-slate-500 text-sm font-medium">Camera viewfinder</p>
                      <p className="text-gray-600 text-xs mt-1">Tap anywhere to simulate scan</p>
                    </div>
                  )}
                </div>

                {/* Scanning frame corners */}
                <div className="absolute inset-6 pointer-events-none z-20">
                  <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-primary-500 rounded-tl-xl transition-all duration-300"></div>
                  <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-primary-500 rounded-tr-xl transition-all duration-300"></div>
                  <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-primary-500 rounded-bl-xl transition-all duration-300"></div>
                  <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-primary-500 rounded-br-xl transition-all duration-300"></div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <Button
                  onClick={simulateScan}
                  disabled={scanning}
                  className="w-full h-12 text-base shadow-glow-blue bg-primary-600 hover:bg-primary-700 text-white"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  {scanning ? 'Scanning...' : 'Start Camera Scan'}
                </Button>

                {/* Manual entry */}
                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
                  <span className="flex-shrink-0 mx-4 text-xs font-medium text-slate-500 uppercase tracking-widest">Or manual entry</span>
                  <div className="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
                </div>

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <Input
                      className="pl-9 h-11 bg-gray-50 dark:bg-[#09090b] border-gray-200 dark:border-dark-border"
                      placeholder="e.g. QR-AARAV-2024-001"
                      value={inputToken}
                      onChange={e => setInputToken(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleScan()}
                      disabled={scanning}
                    />
                  </div>
                  <Button 
                    onClick={() => handleScan()} 
                    variant="secondary" 
                    className="h-11 px-6"
                    disabled={!inputToken || scanning}
                  >
                    Verify
                  </Button>
                </div>
                <p className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-1">
                  Demo tags: <span className="font-mono bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-300">QR-AARAV-2024-001</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Scan Result */}
        <AnimatePresence mode="wait">
          {scanResult && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={scanResult.token + scanResult.success}
            >
              <Card className={cn(
                "border-2 shadow-2xl overflow-hidden backdrop-blur-xl bg-white/90 dark:bg-[#09090b]/90",
                scanResult.success ? 'border-emerald-500/50 shadow-emerald-500/20' : 'border-red-500/50 shadow-red-500/20'
              )}>
                {scanResult.success ? (
                  <>
                    <CardHeader className="bg-emerald-50/50 dark:bg-emerald-900/10 border-b border-emerald-100 dark:border-emerald-900/20 pb-6">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-500/30">
                          <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                          <CardTitle className="text-xl text-emerald-800 dark:text-emerald-400 mb-1">Access Verified</CardTitle>
                          <CardDescription className="font-mono text-xs bg-emerald-200/50 dark:bg-emerald-900/40 px-2 py-1 rounded inline-block text-emerald-800 dark:text-emerald-300">
                            {scanResult.token}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { label: 'Child Name', value: scanResult.data.childName, icon: User },
                          { label: 'Vehicle', value: scanResult.data.vehicleNumber, icon: Car },
                          { label: 'Route', value: scanResult.data.routeName, icon: Route },
                          { label: "Pickup Time", value: scanResult.data.pickupTime ? new Date(scanResult.data.pickupTime).toLocaleTimeString() : 'N/A', icon: Clock },
                        ].map((item, i) => (
                          <div key={item.label} className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                            <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 mb-1">
                              <item.icon className="w-3.5 h-3.5" />
                              <p className="text-[11px] uppercase tracking-wider font-semibold">{item.label}</p>
                            </div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate" title={item.value}>{item.value}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="gap-3 pt-2 pb-6">
                      <Button 
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-12 text-base shadow-glow-emerald" 
                        onClick={() => { 
                          setScanResult(null); 
                          setInputToken(''); 
                        }}
                      >
                        <CheckCircle className="w-5 h-5 mr-2" /> Confirm Action
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1 h-12 text-base" 
                        onClick={() => { setScanResult(null); setInputToken(''); }}
                      >
                        Scan Next
                      </Button>
                    </CardFooter>
                  </>
                ) : (
                  <div className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border", scanResult.isOffline ? "bg-orange-100 dark:bg-orange-500/20 border-orange-200 dark:border-orange-500/30" : "bg-red-100 dark:bg-red-500/20 border-red-200 dark:border-red-500/30")}>
                        {scanResult.isOffline ? <WifiOff className="w-8 h-8 text-orange-600 dark:text-orange-400" /> : <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />}
                      </div>
                      <div>
                        <h3 className={cn("text-lg font-bold mb-1", scanResult.isOffline ? "text-orange-800 dark:text-orange-400" : "text-red-800 dark:text-red-400")}>
                          {scanResult.isOffline ? 'Saved Offline' : 'Verification Failed'}
                        </h3>
                        <p className={cn("text-sm", scanResult.isOffline ? "text-orange-600/80 dark:text-orange-400/80" : "text-red-600/80 dark:text-red-400/80")}>{scanResult.message}</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full mt-6 h-11 border-red-200 text-red-700 hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-900/20" 
                      onClick={() => { setScanResult(null); setInputToken(''); }}
                    >
                      Try Again
                    </Button>
                  </div>
                )}
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
