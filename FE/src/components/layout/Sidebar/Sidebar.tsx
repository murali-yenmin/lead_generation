import { useState } from 'react';
import { SidebarItem } from './SidebarItem';
import Dashboard from '../../images/layout/Dashboard';
import Admin from '../../images/layout/Admin';
import Reward from '../../images/layout/Reward';
import Logout from '../../images/layout/Logout';
import Logo from '../../images/layout/Logo';
import { Link } from 'react-router-dom';
import LogoSymbol from '../../images/layout/LogoSymbol';
import ProfileDropDown from '../Header/ProfileDropDown';
import Close from '../../images/layout/Close';
import KeyIcon from '../../images/layout/KeyIcon';
import Wallet from '../../images/layout/Wallet';
import Approvals from '../../images/layout/Approvals';
import Activity from '../../images/layout/Activity';
import Verified from '../../images/layout/Verified';
import Unverified from '../../images/layout/Unverified';
import CreditCard from '../../images/layout/CreditCard';
import DebitCard from '../../images/layout/DebitCard';
import MenuToggleIcon from '../../../components/images/MenuToggleIcon';
import { useAppDispatch } from '../../../store/store';

interface SidebarProps {
  isMobile: boolean;
  isMobileMenuOpen: boolean;
  toggleSidebar: () => void;
}

export const menuItems = [
  { icon: <Dashboard />, path: '/dashboard', text: 'Dashboard', title: 'Dashboard' },
  { icon: <Admin />, path: '/admins', text: 'Admins', title: 'Admins' },
];

export const Sidebar = ({ isMobile, isMobileMenuOpen, toggleSidebar }: SidebarProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  // Close Sidebar
  const closeSideBar = () => {
    toggleSidebar();
  };

  return (
    <>
      <div className={`${isMobileMenuOpen ? 'overlay active' : ''}`}></div>

      <div
        className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'} ${
          !isMobile ? '' : 'mobile-menu'
        } ${isMobileMenuOpen ? 'mobile-open' : ''}`}
      >
        {/* Sidebar Header */}
        {!isMobile ? (
          <div className="sidebar-header">
            <Link className={`sidebar-logo ${!isExpanded ? 'hide' : ''}`} to={`/`}>
              <Logo />
            </Link>
            <Link className={`sidebar-logo ${isExpanded ? 'hide' : ''}`} to={`/`}>
              <LogoSymbol />
            </Link>
            <button
              className="toggle-btn"
              title={isExpanded ? 'Collapse Sidebar' : 'Expand Sidebar'}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <MenuToggleIcon />
            </button>
          </div>
        ) : (
          <div className={`${isMobileMenuOpen ? 'close-mb-nav' : ''}`}>
            <button onClick={closeSideBar}>
              <Close />
            </button>
          </div>
        )}

        {/* mobile profile bar */}
        {!isMobile ? '' : <ProfileDropDown />}

        {/* Menu Items */}
        <nav className="menu">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.text}
              icon={item.icon}
              text={item.text}
              path={item.path}
              isExpanded={isExpanded}
              onClick={isMobile ? closeSideBar : undefined}
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
            />
          ))}
        </nav>

        {/* Logout */}
        <div className="logout">
          <SidebarItem
            icon={<Logout />}
            text="Logout"
            path={'/signin'}
            isExpanded={isExpanded}
            onClick={() => {
              // dispatch(getUserLogout());
            }}
            openDropdown={openDropdown}
            setOpenDropdown={setOpenDropdown}
          />
        </div>
      </div>
    </>
  );
};
