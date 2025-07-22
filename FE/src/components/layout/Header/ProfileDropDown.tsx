import { useAppSelector } from '../../../store/store';
import { useNavigate } from 'react-router-dom';
import { UserProfile } from 'UI-Library';
import ProfileIcon from '../../images/ProfileIcon';

const ProfileDropDown = () => {
  const navigate = useNavigate();

  return (
    <UserProfile
      imageUrl={''}
      name={'Welcome'}
      enableDropdown={true}
      dropDownItems={[
        {
          label: 'Profile',
          icon: <ProfileIcon />,
          className: '',
          onClick: () => {
            navigate('/profile');
          },
        },
      ]}
      // loader={userInfoLoader}
    />
  );
};

export default ProfileDropDown;
