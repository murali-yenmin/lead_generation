import React, { useState } from 'react';
import Password from '../../images/layout/Password';
import Dollar from '../../images/layout/Dollar';
import { Tabs } from 'UI-Library';

const notifications = [
  {
    id: 1,
    message: 'Your Password has been Successfully Changed.',
    date: 'Jul 25, 2024 at 09:15 AM',
    type: 'password',
    unread: true,
  },
  {
    id: 2,
    message: 'Your Password has been Successfully Changed.',
    date: 'Jul 25, 2024 at 09:15 AM',
    type: 'password',
    unread: true,
  },
  {
    id: 3,
    message: 'Your payment was successfully received by the landlord.',
    date: 'Jul 25, 2024 at 09:15 AM',
    type: 'payment',
    unread: false,
  },
  {
    id: 4,
    message: 'Your payment was successfully received by the landlord.',
    date: 'Jul 25, 2024 at 09:15 AM',
    type: 'payment',
    unread: false,
  },
  {
    id: 5,
    message: 'Your Password has been Successfully Changed.',
    date: 'Jul 25, 2024 at 09:15 AM',
    type: 'password',
    unread: true,
  },
];

const NotificationList = () => {
  const tabs = [
    {
      label: 'All',
      content: (
        <div className="notifications-list ">
          {notifications.map((notif) => (
            <div key={notif.id} className={`notif-item ${notif.unread ? 'unread' : ''}`}>
              <div className="notif-details">
                <div>
                  <span className="notif-dot"></span>
                </div>
                <div className="notif-description">
                  <p>{notif.message}</p>
                  <span>{notif.date}</span>
                </div>
              </div>
              <div>
                <div className={`notif-icon ${notif.type}`}>
                  {notif.type === 'password' ? <Password /> : <Dollar />}
                </div>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      label: 'Unread',
      content: (
        <div className="notifications-list">
          {notifications
            .filter((notif) => notif.unread)
            .map((notif) => (
              <div key={notif.id} className={`notif-item unread`}>
                <div className="notif-details">
                  <div>
                    <span className="notif-dot"></span>
                  </div>
                  <div className="notif-description">
                    <p>{notif.message}</p>
                    <span>{notif.date}</span>
                  </div>
                </div>
                <div>
                  <div className={`notif-icon ${notif.type}`}>
                    {notif.type === 'password' ? <Password /> : <Dollar />}
                  </div>
                </div>
              </div>
            ))}
        </div>
      ),
    },
  ];
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifications =
    filter === 'unread' ? notifications.filter((notif) => notif.unread) : notifications;

  return (
    <div className="notification-wrapper">
      <div className="notification">
        <div className="notifications-container">
          <div className="notifications-header">
            <h6>Notifications</h6>
          </div>

          <Tabs
            tabs={tabs}
            tabWrapperClass="tabs-wrapper"
            tabHeaderClass="tabs-header"
            tabButtonClass="tab-button"
          />
        </div>
        <button className="view-more">View more notifications</button>
      </div>
    </div>
  );
};

export default NotificationList;
