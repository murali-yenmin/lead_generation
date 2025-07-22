import { useEffect, useRef, useState } from 'react';
import Bell from '../../images/layout/Bell';
import DoubleTick from '../../images/layout/DoubleTick';
import Dollar from '../../images/layout/Dollar';
import Password from '../../images/layout/Password';
import { Link, useNavigate } from 'react-router-dom';
import { outSideClick } from 'UI-Library';

const Notification = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      outSideClick({ wrapperRef, setIsOpen });
    }
  }, [isOpen]);
  const handleNavigation = () => {
    navigate('/notification');
    setIsOpen(false);
  };
  const notifications = [
    {
      id: 1,
      message: 'Your Password has been Successfully Changed.',
      icon: <Password />,
      type: 'password',
      date: 'Jul 25, 2024 at 09:15 AM',
    },
    {
      id: 2,
      message: 'Your payment was successfully received by the landlord.',
      icon: <Dollar />,
      type: 'payment',
      date: 'Jul 25, 2024 at 09:15 AM',
    },
    {
      id: 3,
      message: 'Your payment was successfully received by the landlord.',
      icon: <Dollar />,
      type: 'payment',
      date: 'Jul 25, 2024 at 09:15 AM',
    },
  ];

  // Close dropdown when clicking outside
  const closeDropdown = () => {
    setIsOpen(false);
  };

  return (
    <div className="notif-container" ref={wrapperRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="notif-bell-btn">
        <Bell />
      </button>
      {isOpen && <div className="notif-overlay" onClick={closeDropdown}></div>}

      {isOpen && (
        <div className="notif-dropdown">
          <div className="notif-header">
            <h3>Notifications</h3>
            <button className="notif-mark-read">
              <DoubleTick /> Mark as read
            </button>
          </div>

          <div className="notif-list">
            {notifications.slice(0, 3).map(
              (
                notif, // Show only first 3 items
              ) => (
                <div key={notif.id} className="notif-item">
                  <div className="notif-details">
                    <div className="notif-text">
                      <div>
                        <span className="notif-dot"></span>
                      </div>
                      <div className="notif-description">
                        <p>{notif.message}</p>
                        <span>{notif.date}</span>
                      </div>
                    </div>
                    <div>
                      <div className={`notif-icon ${notif.type}`}>{notif.icon}</div>
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>

          <div className="notif-footer">
            <button className="notif-view-all" onClick={handleNavigation}>
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;
