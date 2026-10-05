import React from 'react';
import { ComplianceStatus } from '../../types';
import { CheckCircle2, XCircle, AlertTriangle, Clock } from 'lucide-react';

interface StatusBadgeProps {
  status: ComplianceStatus | string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md', showIcon = true }) => {
  const norm = status?.toUpperCase();

  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';
  let label = status;
  let icon = <Clock className="w-3.5 h-3.5 mr-1 text-slate-500" />;

  if (norm === 'COMPLIANT') {
    colorClasses = 'bg-emerald-50 text-emerald-800 border-emerald-200';
    label = 'Compliant';
    icon = <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />;
  } else if (norm === 'NON_COMPLIANT' || norm === 'NON-COMPLIANT') {
    colorClasses = 'bg-rose-50 text-rose-800 border-rose-200';
    label = 'Non-Compliant';
    icon = <XCircle className="w-3.5 h-3.5 mr-1 text-rose-600" />;
  } else if (norm === 'NEEDS_REVIEW' || norm === 'NEEDS REVIEW') {
    colorClasses = 'bg-amber-50 text-amber-900 border-amber-200';
    label = 'Needs Review';
    icon = <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-600" />;
  } else if (norm === 'PENDING') {
    colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';
    label = 'Pending';
    icon = <Clock className="w-3.5 h-3.5 mr-1 text-slate-500" />;
  }

  const sizeClasses = size === 'sm' 
    ? 'text-xs px-2 py-0.5' 
    : size === 'lg' 
    ? 'text-sm px-3 py-1 font-semibold' 
    : 'text-xs px-2.5 py-1 font-medium';

  return (
    <span className={`inline-flex items-center rounded-full border ${colorClasses} ${sizeClasses} whitespace-nowrap tracking-wide`}>
      {showIcon && icon}
      <span>{label}</span>
    </span>
  );
};
