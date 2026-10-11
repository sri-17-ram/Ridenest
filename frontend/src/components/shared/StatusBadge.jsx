const statusConfig = {
  // Trip statuses
  SCHEDULED: { label: 'Scheduled', cls: 'badge-blue' },
  IN_PROGRESS: { label: 'In Progress', cls: 'badge-green' },
  COMPLETED: { label: 'Completed', cls: 'badge-gray' },
  CANCELLED: { label: 'Cancelled', cls: 'badge-red' },
  EMERGENCY: { label: '🚨 Emergency', cls: 'badge-red' },
  // Verification statuses
  PENDING: { label: 'Pending', cls: 'badge-yellow' },
  UNDER_REVIEW: { label: 'Under Review', cls: 'badge-blue' },
  APPROVED: { label: 'Approved', cls: 'badge-green' },
  REJECTED: { label: 'Rejected', cls: 'badge-red' },
  // Child statuses
  AT_HOME: { label: 'At Home', cls: 'badge-gray' },
  PICKED_UP: { label: 'Picked Up', cls: 'badge-blue' },
  IN_TRANSIT: { label: 'In Transit', cls: 'badge-orange' },
  AT_INSTITUTION: { label: 'At School', cls: 'badge-green' },
  DROPPED: { label: 'Dropped', cls: 'badge-gray' },
  // Pickup statuses
  EXPECTED: { label: 'Expected', cls: 'badge-yellow' },
  ABSENT: { label: 'Absent', cls: 'badge-red' },
  MISSED: { label: 'Missed', cls: 'badge-red' },
  // Complaint statuses
  OPEN: { label: 'Open', cls: 'badge-red' },
  IN_REVIEW: { label: 'In Review', cls: 'badge-yellow' },
  RESOLVED: { label: 'Resolved', cls: 'badge-green' },
  CLOSED: { label: 'Closed', cls: 'badge-gray' },
  // General
  ACTIVE: { label: 'Active', cls: 'badge-green' },
  INACTIVE: { label: 'Inactive', cls: 'badge-gray' },
  SUSPENDED: { label: 'Suspended', cls: 'badge-red' },
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || { label: status, cls: 'badge-gray' };
  return <span className={config.cls}>{config.label}</span>;
}
