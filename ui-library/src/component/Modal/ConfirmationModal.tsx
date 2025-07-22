import { useEffect } from 'react';
import { ConfirmationModalProps } from '../../interfaces/components';
import { Button } from '../Button';
import { preventEscapeKeyPress } from '../../utils/preventEscapeKeyPress';
import { FocusTrap } from 'focus-trap-react';

export const ConfirmationModal = ({
  primaryBtnCallback,
  secondaryBtnCallback,
  closeModal,
  secondaryBtnName = '',
  primaryBtnName,
  description,
  title,
  enableSecondaryBtn = true,
  loader = false,
}: ConfirmationModalProps) => {
  useEffect(() => {
    preventEscapeKeyPress();
  }, []);

  return (
    <FocusTrap>
      <div className="modal-overlay confirmation-modal ">
        <div className="modal">
          <div className="modal-header">
            <h1>{title}</h1>
          </div>

          <div className="modal-content">
            <p>{description}</p>
          </div>

          <div className="modal-footer">
            {enableSecondaryBtn && (
              <Button
                variant={'secondary'}
                label={secondaryBtnName}
                onClick={() => {
                  if (!loader) {
                    if (secondaryBtnCallback) {
                      secondaryBtnCallback();
                    } else {
                      closeModal();
                    }
                  }
                }}
              />
            )}
            <Button
              loading={loader}
              label={primaryBtnName}
              onClick={() => {
                if (!loader) {
                  primaryBtnCallback();
                }
              }}
            />
          </div>
        </div>
      </div>
    </FocusTrap>
  );
};
