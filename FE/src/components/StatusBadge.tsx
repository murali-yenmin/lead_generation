import { StatusBadgeProps } from '../interfaces/components';

const StatusBadge = ({ status, label }: StatusBadgeProps) => {
  return (
    <span className={`status-badge status-${status}`}>
      {label
        ? label?.charAt(0)?.toUpperCase() + label?.slice(1)
        : status?.charAt(0)?.toUpperCase() + status?.slice(1)}
    </span>
  );
};

export default StatusBadge;
