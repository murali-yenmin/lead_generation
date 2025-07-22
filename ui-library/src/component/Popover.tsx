import React, { useRef, useState, useEffect } from 'react';
import { PopoverProps } from '../interfaces/components';
import OutsideClick from '../utils/outsideClick';

export const Popover = ({
  content,
  children,
  position = 'bottom',
  enableTitle = false,
}: PopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const popOver = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    if (isOpen) {
      OutsideClick({ wrapperRef, setIsOpen });
    }
  }, [isOpen]);

  return (
    <div className="pop-over" ref={wrapperRef}>
      <button onClick={popOver}>{children}</button>
      {isOpen && (
        <div className={`popover-cont ${position}`}>
          {enableTitle && (
            <div className="popover-title">
              <h2>{content.title}</h2>
            </div>
          )}
          <div className="popover-body">{content.body}</div>
        </div>
      )}
    </div>
  );
};
