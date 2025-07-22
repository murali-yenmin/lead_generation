import { useEffect, useRef, useState } from 'react';
import { CoreModalProps } from '../../interfaces/components';
import { FocusTrap } from 'focus-trap-react';
import { preventEscapeKeyPress } from '../../utils/preventEscapeKeyPress';

export const CoreModal = ({
  primaryBtnCallback,
  secondaryBtnCallback,
  closeModal,
  secondaryBtnName = '',
  primaryBtnName = '',
  children,
  title,
  size = 'lg',
  enableSecondaryBtn = true,
  enablePrimaryBtn = true,
  enableHeader = true,
  enableFooter = true,
  enableCloseIcon = true,
}: CoreModalProps) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [trapActive, setTrapActive] = useState(false);

  useEffect(() => {
    preventEscapeKeyPress();

    // Wait until DOM node is mounted
    if (modalRef.current) {
      setTrapActive(true);
    }
  }, []);

  return (
    <FocusTrap
      active={trapActive}
      focusTrapOptions={{
        fallbackFocus: () => modalRef.current!,
      }}
    >
      <div ref={modalRef} className="modal-overlay">
        <div className={`modal modal-${size}`}>
          {enableHeader && (
            <div className="modal-header">
              <h1>{title}</h1>
              <p className="close" onClick={closeModal}>
                &times;
              </p>
            </div>
          )}
          {enableCloseIcon && !enableHeader && (
            <p className="close-icon" onClick={closeModal}>
              <span>&times;</span>
            </p>
          )}
          <div className="modal-content">{children}</div>

          {enableFooter && (
            <div className="modal-footer">
              {enableSecondaryBtn && (
                <button
                  type="button"
                  className="btn secondary-btn"
                  onClick={() => {
                    if (secondaryBtnCallback) {
                      secondaryBtnCallback();
                    } else {
                      closeModal();
                    }
                  }}
                >
                  {secondaryBtnName}
                </button>
              )}
              {enablePrimaryBtn && (
                <button type="button" className="btn primary-btn" onClick={primaryBtnCallback}>
                  {primaryBtnName}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </FocusTrap>
  );
};
