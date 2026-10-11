export default function StatCard({ title, value, subtitle, icon: Icon, iconBg, trend, trendLabel, onClick }) {
  return (
    <div
      className={`stat-card ${onClick ? 'cursor-pointer hover:shadow-card-hover hover:-translate-y-0.5 transition-all' : ''}`}
      onClick={onClick}
    >
      <div className={`stat-icon ${iconBg}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-gray-500 dark:text-dark-muted font-medium">{title}</p>
        <p className="text-2xl font-display font-bold text-gray-900 dark:text-white mt-0.5">{value}</p>
        {subtitle && <p className="text-xs text-slate-500 dark:text-dark-muted mt-1">{subtitle}</p>}
        {trend !== undefined && (
          <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${trend >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
            <span>{trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%</span>
            {trendLabel && <span className="text-slate-500 dark:text-dark-muted font-normal">{trendLabel}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
