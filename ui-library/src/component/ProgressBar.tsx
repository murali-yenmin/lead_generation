import { ProgressBarProps } from '../interfaces/components';

export const ProgressBar = ({
  progress,
  height = 15,
  progressBarClass = '',
  progressFillClass = '',
}: ProgressBarProps) => {
  return (
    <div className={`progress-bar ${progressBarClass}`} style={{ height: `${height}px` }}>
      <div className={`progress-fill ${progressFillClass}`} style={{ width: `${progress}%` }}></div>
    </div>
  );
};
