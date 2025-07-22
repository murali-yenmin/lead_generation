import { useEffect, useState } from 'react';
import { CoreModal } from './CoreModal';
import { Button } from '../Button';

interface IdleModalProps {
  showModal: boolean;
  toggle: Function;
  idleImage: string;
  content: string;
  handleTimeout: () => void;
}

const IdleModal = (props: IdleModalProps) => {
  const { showModal, toggle, idleImage, content, handleTimeout } = props;

  const [timer, setTimer] = useState(60);

  useEffect(() => {
    if (showModal) {
      setInterval(() => {
        setTimer((prev) => {
          if (prev === 0) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  }, [showModal]);

  useEffect(() => {
    if (showModal && timer === 0) {
      handleTimeout();
    }
  }, [timer, showModal]);

  return (
    <>
      {showModal && (
        <div className="idle-model">
          <CoreModal
            size="md"
            enableFooter={false}
            closeModal={() => toggle()}
            enableHeader={false}
          >
            <div className="modal-header d-block">
              <div className="text-center idle-content">
                <img className="w-75" src={idleImage} alt="idle-img" />
                <h3 className="">{content}</h3>
              </div>
            </div>
            <div className="idle-btn">
              <Button
                label={`Logout`}
                variant="social"
                onClick={() => handleTimeout()}
                type="button"
                icon={timer}
              />
              <Button label={'Continue'} className="mb-1" onClick={() => toggle()} type="button" />
            </div>
          </CoreModal>
        </div>
      )}
    </>
  );
};

export default IdleModal;
