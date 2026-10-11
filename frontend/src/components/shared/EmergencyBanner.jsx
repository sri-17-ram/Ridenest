import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function EmergencyBanner({ message, onDismiss }) {
  if (!message) return null;
  return (
    <div className="emergency-banner">
      <div className="flex items-center gap-3">
        <ExclamationTriangleIcon className="w-6 h-6 flex-shrink-0" />
        <div>
          <p className="font-bold text-sm">🚨 EMERGENCY ALERT</p>
          <p className="text-xs opacity-90">{message}</p>
        </div>
      </div>
      <button onClick={onDismiss} className="p-1 hover:bg-red-700 rounded-lg transition-colors">
        <XMarkIcon className="w-5 h-5" />
      </button>
    </div>
  );
}
