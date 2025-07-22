// TooltipWrapper.tsx
import React from 'react';
import { Tooltip } from 'react-tooltip';

// Defining props for the TooltipWrapper component
interface TooltipWrapperProps {
  id: string;
  content: string; // The content to be displayed inside the tooltip
  place?: 'top' | 'bottom' | 'left' | 'right'; // Position of the tooltip (optional)
  delayShow?: number; // Delay time for showing the tooltip (optional)
  className?: string; // Optional class name for custom styling
}

export const TooltipWrapper: React.FC<TooltipWrapperProps> = ({
  id,
  content,
  place = 'top', // Default position is 'top'
  delayShow = 0, // Default delay time is 0
  className = '',
}) => {
  return (
    <div
      className={`tooltip-container ${className}`}
      data-tooltip-id={id}
      data-tooltip-content={content}
    >
      <Tooltip id={id} place={place} delayShow={delayShow} />
    </div>
  );
};
