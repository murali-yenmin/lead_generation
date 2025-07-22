import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import ThreeDot from './Images/ThreeDot';
import { ThreeDotDropdownProps } from '../interfaces/components';
import OutsideClick from '../utils/outsideClick';

export enum DropdownPosition {
  TopLeft = 'top-left',
  TopRight = 'top-right',
  BottomLeft = 'bottom-left',
  BottomRight = 'bottom-right',
  LeftTop = 'left-top',
  LeftBottom = 'left-bottom',
  RightTop = 'right-top',
  RightBottom = 'right-bottom',
}

export const ThreeDotDropdown = ({
  types = DropdownPosition.BottomLeft,
  threeDotOptions,
}: ThreeDotDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [adjustedPosition, setAdjustedPosition] = useState<DropdownPosition>(
    types as DropdownPosition,
  );

  useEffect(() => {
    OutsideClick({ wrapperRef, setIsOpen });
  }, []);

  const adjustDropdownPosition = () => {
    if (!menuRef.current || !wrapperRef.current) return;

    const menuRect = menuRef.current.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    let newPosition = types;

    // Vertical adjustment
    if (
      (types === DropdownPosition.BottomLeft || types === DropdownPosition.BottomRight) &&
      menuRect.bottom > windowHeight
    ) {
      newPosition =
        types === DropdownPosition.BottomLeft
          ? DropdownPosition.TopLeft
          : DropdownPosition.TopRight;
    } else if (
      (types === DropdownPosition.TopLeft || types === DropdownPosition.TopRight) &&
      menuRect.top < 0
    ) {
      newPosition =
        types === DropdownPosition.TopLeft
          ? DropdownPosition.BottomLeft
          : DropdownPosition.BottomRight;
    }

    // Horizontal adjustment
    if (
      (types === DropdownPosition.LeftTop || types === DropdownPosition.LeftBottom) &&
      menuRect.left < 0
    ) {
      newPosition =
        types === DropdownPosition.LeftTop
          ? DropdownPosition.RightTop
          : DropdownPosition.RightBottom;
    } else if (
      (types === DropdownPosition.RightTop || types === DropdownPosition.RightBottom) &&
      menuRect.right > windowWidth
    ) {
      newPosition =
        types === DropdownPosition.RightTop
          ? DropdownPosition.LeftTop
          : DropdownPosition.LeftBottom;
    }

    setAdjustedPosition(newPosition as DropdownPosition);
  };

  useLayoutEffect(() => {
    if (isOpen) {
      adjustDropdownPosition();
    }
  }, [isOpen, types]);

  useEffect(() => {
    const handleResize = () => {
      if (isOpen) {
        adjustDropdownPosition();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  return (
    <div className="dropdown-container" ref={wrapperRef}>
      <button
        className="dropdown-btn"
        onClick={() => {
          setIsOpen((prev) => !prev);
          adjustDropdownPosition();
        }}
        aria-haspopup="true"
        aria-expanded={isOpen}
        title="More options"
      >
        <ThreeDot />
      </button>

      {isOpen && (
        <div className={`dot-menu ${adjustedPosition}`} ref={menuRef} role="menu" tabIndex={-1}>
          {threeDotOptions.map((option, index) => (
            <button
              key={index}
              className="dot-menu-item"
              onClick={() => {
                option.onClick?.(setIsOpen);
                if (!option.onClick) setIsOpen(false);
              }}
              role="menuitem"
              disabled={option?.disabled}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
