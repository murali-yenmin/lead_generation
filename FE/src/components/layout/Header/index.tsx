import Notification from './Notification';
import ProfileDropDown from './ProfileDropDown';
import Logo from '../../images/layout/Logo';
import Hamburger from '../../images/layout/Hamburger';

interface HeaderProps {
  isMobile: boolean;
  toggleSidebar: () => void;
}

const Header = ({ isMobile, toggleSidebar }: HeaderProps) => {
  return (
    <>
      {!isMobile ? (
        <> 
          <ProfileDropDown />
        </>
      ) : (
        <div className="mobile-header">
          <div className="mobile-logo">
            <Logo />
          </div>
          <div className="hamburger" onClick={toggleSidebar}>
            <Hamburger />
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
