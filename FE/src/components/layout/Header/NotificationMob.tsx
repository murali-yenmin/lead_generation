import { Badge } from 'UI-Library';
import Bell from '../../images/layout/Bell';

const NotificationMob = () => {
  return (
    <div className="mobile-notify">
      <div className="d-flex align-item-center">
        <Bell />
        <div className="text-notify">Notification</div>
      </div>
      <Badge text={'12'} type="secondary" />
    </div>
  );
};

export default NotificationMob;
