import React from 'react';
import { RiskLevel } from '../../types';
import { ShieldAlert, ShieldCheck, Shield } from 'lucide-react';

interface RiskBadgeProps {
  risk: RiskLevel | string;
  size?: 'sm' | 'md';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ risk, size = 'md' }) => {
  const norm = risk?.toUpperCase();

  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';
  let label = risk;
  let icon = <Shield className="w-3.5 h-3.5 mr-1 text-slate-500" />;

  if (norm === 'LOW') {
    colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    label = 'Low Risk';
    icon = <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />;
  } else if (norm === 'MEDIUM') {
    colorClasses = 'bg-amber-50 text-amber-800 border-amber-200';
    label = 'Medium Risk';
    icon = <ShieldAlert className="w-3.5 h-3.5 mr-1 text-amber-600" />;
  } else if (norm === 'HIGH') {
    colorClasses = 'bg-rose-50 text-rose-800 border-rose-200';
    label = 'High Risk';
    icon = <ShieldAlert className="w-3.5 h-3.5 mr-1 text-rose-600" />;
  }

  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1 font-medium';

  return (
    <span className={`inline-flex items-center rounded-md border ${colorClasses} ${sizeClasses} whitespace-nowrap`}>
      {icon}
      <span>{label}</span>
    </span>
  );
};
