import { useEffect, useState } from 'react';
import { CoreModal, useWindowSize } from 'UI-Library';
import ResponsiveAlertIcon from './images/ResponsiveAlertIcon';

const ResponsiveAlert = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { width } = useWindowSize();

  useEffect(() => {
    if (width < 768) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [width]);
  return (
    <div className="responiveAlert">
      {isOpen && (
        <CoreModal
          size="md"
          enableFooter={false}
          closeModal={() => setIsOpen(false)}
          enableHeader={false}
          enableCloseIcon={false}
        >
          <div className="modal-body ">
            <ResponsiveAlertIcon />
            <h3>Oops!</h3>
            <p>This feature works best on bigger screens. Try a laptop or tablet.</p>
          </div>
          <button className="closeIcon" onClick={() => setIsOpen(false)}>
            <svg
              width="18"
              height="19"
              viewBox="0 0 18 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0.517465 1.17762C1.10325 0.591835 2.053 0.591835 2.63879 1.17762L17.488 16.0269C18.0738 16.6126 18.0738 17.5624 17.488 18.1482C16.9022 18.734 15.9525 18.734 15.3667 18.1482L0.517465 3.29894C-0.0683212 2.71315 -0.0683212 1.76341 0.517465 1.17762Z"
                fill="#CACACA"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M17.488 1.17762C18.0738 1.76341 18.0738 2.71315 17.488 3.29894L2.63879 18.1482C2.053 18.734 1.10325 18.734 0.517465 18.1482C-0.0683214 17.5624 -0.0683219 16.6126 0.517465 16.0269L15.3667 1.17762C15.9525 0.591835 16.9022 0.591835 17.488 1.17762Z"
                fill="#CACACA"
              />
            </svg>
          </button>
        </CoreModal>
      )}
    </div>
  );
};

export default ResponsiveAlert;
