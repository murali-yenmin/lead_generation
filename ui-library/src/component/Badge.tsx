import { BadgeProps } from '../interfaces/components';

export const Badge = ({ text, type = 'primary' }: BadgeProps) => {
  return <div className={`badge badge-${type}`}>{text}</div>;
};
