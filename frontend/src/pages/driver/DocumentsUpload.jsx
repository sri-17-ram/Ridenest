import { useState } from 'react';
import DashboardLayout from '../../components/shared/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { FileCheck, ShieldCheck, Clock, UploadCloud, AlertCircle, FileText, CheckCircle, FileVideo, Fingerprint, SearchCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '../../lib/utils';

const documents = [
  { id: 'license', label: 'Driving License', icon: Fingerprint, status: 'APPROVED', required: true, description: 'Valid Indian driving license (front & back)' },
  { id: 'aadhaar', label: 'Aadhaar Card', icon: SearchCheck, status: 'APPROVED', required: true, description: 'Aadhaar card for identity verification' },
  { id: 'rc', label: 'Vehicle RC', icon: FileText, status: 'APPROVED', required: true, description: 'Vehicle registration certificate' },
  { id: 'insurance', label: 'Vehicle Insurance', icon: ShieldCheck, status: 'PENDING', required: true, description: 'Valid vehicle insurance policy document' },
  { id: 'fitness', label: 'Fitness Certificate', icon: FileCheck, status: 'PENDING', required: false, description: 'Vehicle fitness certificate from RTO' },
  { id: 'permit', label: 'Route Permit', icon: FileText, status: 'PENDING', required: false, description: 'School/child transport permit' },
];

const statusStyles = {
  APPROVED: { bg: 'bg-emerald-50 dark:bg-emerald-500/10', color: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800/50', icon: CheckCircle, label: 'Verified' },
  UNDER_REVIEW: { bg: 'bg-blue-50 dark:bg-blue-500/10', color: 'text-blue-700 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800/50', icon: Clock, label: 'Under Review' },
  PENDING: { bg: 'bg-gray-100 dark:bg-gray-800', color: 'text-gray-600 dark:text-gray-400', border: 'border-gray-200 dark:border-gray-700', icon: AlertCircle, label: 'Pending Upload' },
};

export default function DocumentsUpload() {
  const [docs, setDocs] = useState(documents);
  const [uploading, setUploading] = useState(null);

  const handleUpload = (docId) => {
    setUploading(docId);
    setTimeout(() => {
      setDocs(prev => prev?.map(d => d.id === docId ? { ...d, status: 'UNDER_REVIEW' } : d));
      setUploading(null);
      toast.success('Document uploaded successfully. Added to review queue.', { icon: '📄' });
    }, 2000);
  };

  const approvedCount = docs.filter(d => d.status === 'APPROVED' && d.required).length;
  const totalRequired = docs.filter(d => d.required).length;
  const progressPercent = Math.round((approvedCount / totalRequired) * 100);

  return (
    <DashboardLayout>
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 max-w-5xl mx-auto"
      >
        <div>
          <h1 className="text-2xl font-display font-semibold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-primary-500" /> My Documents
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Upload and manage your required verification documents</p>
        </div>
      </motion.div>

      <div className="max-w-5xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="p-6 bg-white/70 dark:bg-[#09090b]/70 backdrop-blur-xl border-gray-200/50 dark:border-dark-border/50">
            <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-2">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">Verification Progress</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Complete required documents to activate your account</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 font-bold rounded-full text-sm">
                {approvedCount} of {totalRequired} Required
              </div>
            </div>
            
            <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-3">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={cn(
                  "h-full rounded-full",
                  progressPercent === 100 ? "bg-gradient-to-r from-emerald-400 to-emerald-500" : "bg-gradient-to-r from-primary-400 to-primary-600"
                )} 
              />
            </div>
            
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {progressPercent === 100 ? (
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400"><CheckCircle className="w-4 h-4" /> All required documents verified! You are ready to drive.</span>
              ) : (
                <span className="flex items-center gap-1.5"><AlertCircle className="w-4 h-4 text-orange-500" /> You need {totalRequired - approvedCount} more approved document(s).</span>
              )}
            </p>
          </Card>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {docs?.map((doc, i) => {
              const Style = statusStyles[doc.status];
              const StatusIcon = Style.icon;
              const DocIcon = doc.icon;
              
              return (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 + (i * 0.05) }}
                  key={doc.id} 
                >
                  <Card className={cn(
                    "h-full flex flex-col bg-white/70 dark:bg-[#09090b]/70 backdrop-blur-xl border-gray-200/50 dark:border-dark-border/50 overflow-hidden relative group hover:shadow-md transition-all",
                    doc.status === 'APPROVED' ? "border-t-4 border-t-emerald-500" : doc.required && doc.status === 'PENDING' ? "border-l-2 border-l-orange-500" : ""
                  )}>
                    <div className="p-5 flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 shrink-0">
                          <DocIcon className="w-5 h-5" />
                        </div>
                        <Badge variant="outline" className={cn("px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold border flex items-center gap-1 shrink-0", Style.bg, Style.color, Style.border)}>
                          <StatusIcon className="w-3 h-3" /> {Style.label}
                        </Badge>
                      </div>
                      
                      <div className="mb-2">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-900 dark:text-white leading-tight group-hover:text-primary-600 transition-colors">{doc.label}</h3>
                          {doc.required && <span className="px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider font-bold bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400">Required</span>}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{doc.description}</p>
                      </div>
                    </div>
                    
                    <div className="p-5 pt-0 mt-auto">
                      {doc.status === 'APPROVED' ? (
                        <div className="w-full py-2.5 px-3 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-800/50 flex items-center justify-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-400">
                          <ShieldCheck className="w-4 h-4" /> Verified by Admin
                        </div>
                      ) : doc.status === 'UNDER_REVIEW' ? (
                        <div className="w-full py-2.5 px-3 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-800/50 flex items-center justify-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-400">
                          <Clock className="w-4 h-4 animate-spin-slow" /> Review in Progress
                        </div>
                      ) : (
                        <div
                          className={cn(
                            "w-full border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all",
                            uploading === doc.id ? "border-primary-400 bg-primary-50 dark:bg-primary-900/20" : "border-gray-200 dark:border-gray-700 hover:border-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                          )}
                          onDrop={(e) => { e.preventDefault(); handleUpload(doc.id); }}
                          onDragOver={(e) => e.preventDefault()}
                          onClick={() => handleUpload(doc.id)}
                        >
                          {uploading === doc.id ? (
                            <div className="flex flex-col items-center gap-2 py-1">
                              <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                              <p className="text-xs font-semibold text-primary-600 dark:text-primary-400">Uploading...</p>
                            </div>
                          ) : (
                            <div className="py-1">
                              <UploadCloud className="w-6 h-6 text-slate-500 mx-auto mb-1.5 group-hover:text-primary-500 transition-colors" />
                              <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">Click to upload</p>
                              <p className="text-[10px] text-slate-500 mt-0.5">PDF or JPG up to 10MB</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
}
