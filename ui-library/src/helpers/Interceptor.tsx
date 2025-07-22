import { axiosApi } from './api_helper';
import { useEffect, useState } from 'react';
import { CoreModal } from '../component/Modal/CoreModal';
import InternalServerError from '../assets/InternalServerError';
import PageNotFound from '../assets/PageNotFound';
import { Button } from '../component/Button';

export const Interceptor = ({
  logoutTimer = 60,
  handleLogout,
}: {
  logoutTimer?: number;
  handleLogout: () => void;
}) => {
  const [internalModal, setInternalModal] = useState(false);
  const [pageNotFoundModal, setPageNotFoundModal] = useState(false);
  const [timer, setTimer] = useState(logoutTimer);

  useEffect(() => {
    if (internalModal) {
      setInterval(() => {
        setTimer((prev) => {
          if (prev === 0) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  }, [internalModal]);

  useEffect(() => {
    const interceptor = axiosApi.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error?.response?.status;
        if (status === 403) {
          handleLogout();
        } else if (status === 401) {
          handleLogout();
        } else if (status === 500) {
          setInternalModal(true);
        } else if (status === 404) {
          setPageNotFoundModal(true);
        }

        return Promise.reject(error);
      },
    );

    // Cleanup interceptor when component unmounts
    return () => {
      axiosApi.interceptors.response.eject(interceptor);
    };
  }, []);

  useEffect(() => {
    if (internalModal && timer === 0) {
      handleLogout();
    }
  }, [timer, internalModal]);

  return (
    <>
      {internalModal && (
        <div className="interceptor-modal">
          <CoreModal
            size="md"
            enableFooter={false}
            enableHeader={false}
            closeModal={() => setInternalModal(false)}
          >
            <div className="image-container">
              <InternalServerError />
            </div>
            <p className="text">Internal Server Error</p>
            <Button variant="social" label="Logout" onClick={() => handleLogout()} icon={timer} />
          </CoreModal>
        </div>
      )}

      {pageNotFoundModal && (
        <div className="interceptor-modal">
          <CoreModal
            size="md"
            enableHeader={false}
            enableFooter={false}
            closeModal={() => setPageNotFoundModal(false)}
          >
            <div className="image-container">
              <PageNotFound />
              <p className="close" onClick={() => setPageNotFoundModal(false)}>
                &times;
              </p>
            </div>
            <p className="text">Page Not Found</p>
          </CoreModal>
        </div>
      )}
    </>
  );
};
