import { useEffect, useRef } from 'react';
import { OffCanvasProps } from '../interfaces/components';

export const OffCanvas = ({ isOpen, onClose, position = 'right', children }: OffCanvasProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={`offcanvas-overlay ${isOpen ? 'open' : ''}`}>
      <div className={`offcanvas-content ${position}`} ref={wrapperRef}>
        <button className="close-btn" onClick={onClose}>
          X
        </button>
        {children}
      </div>
    </div>
  );
};
