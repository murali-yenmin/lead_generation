import { useEffect, useState } from 'react';
import IdleModal from './Modal/IdleModal';

interface CheckIdleProps {
  toggle?: Function;
  idleImage: string;
  content: string;
  handleTimeout: () => void;
  waitingMinutes?: number;
}

export const CheckIdle = ({
  idleImage,
  content,
  handleTimeout,
  waitingMinutes = 5,
}: CheckIdleProps) => {
  const [showModal, setShowModal] = useState(false);

  const checkInactivity = () => {
    const expiryTime: any = localStorage.getItem('expireTime');
    if (expiryTime && Number(expiryTime) < Date.now()) {
      setShowModal(true);
    }
  };

  const updateExpireTime = () => {
    const expireTime = Date.now() + 1000 * (60 * waitingMinutes);
    localStorage.setItem('expireTime', expireTime?.toString());
  };

  useEffect(() => {
    const interval = setInterval(() => {
      checkInactivity();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    updateExpireTime();
    window.addEventListener('click', updateExpireTime);
    window.addEventListener('keypress', updateExpireTime);
    window.addEventListener('scroll', updateExpireTime);
    window.addEventListener('mousemove', updateExpireTime);

    return () => {
      window.removeEventListener('click', updateExpireTime);
      window.removeEventListener('keypress', updateExpireTime);
      window.removeEventListener('scroll', updateExpireTime);
      window.removeEventListener('mousemove', updateExpireTime);
    };
  }, []);
  return (
    <>
      <IdleModal
        showModal={showModal}
        idleImage={idleImage}
        content={content}
        handleTimeout={handleTimeout}
        toggle={() => {
          setShowModal(!showModal);
        }}
      />
    </>
  );
};
