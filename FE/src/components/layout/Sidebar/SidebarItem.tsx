import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import React from 'react';
import Arrow from '../../../components/images/Arrow';

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  path: string;
  isExpanded: boolean;
  onClick?: () => void;
  submenu?: { text: string; path: string; icon: React.ReactNode }[];
  openDropdown: string | null;
  setOpenDropdown: (text: string | null) => void;
}

export const SidebarItem = ({
  icon,
  text,
  path,
  isExpanded,
  onClick,
  submenu = [],
  openDropdown,
  setOpenDropdown,
}: SidebarItemProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = location.pathname.startsWith(path);
  const isSubmenuOpen = openDropdown === text;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (submenu.length > 0) {
      setOpenDropdown(isSubmenuOpen ? null : text);
    } else {
      setOpenDropdown(null); // Close any open submenu
      if (onClick) onClick();
      navigate(path);
    }
  };

  return (
    <div
      className={`sidebar-item ${isActive ? 'active' : ''} ${
        isSubmenuOpen ? 'dropdown dropdown-active' : ''
      }`}
    >
      <a href={path} className="menu-item" onClick={handleClick}>
        <div className="icon">{icon}</div>
        <span className={`text ${isExpanded ? 'visible' : 'hover-style'}`}>{text}</span>
        {submenu.length > 0 && (
          <div className="arrow-icon">
            <Arrow />
          </div>
        )}
      </a>
      {submenu.length > 0 && isSubmenuOpen && (
        <div className="submenu">
          {submenu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `submenu-item ${isActive ? 'active' : ''}`}
              onClick={onClick} // No toggle here to keep dropdown open
            >
              <span className="icon">{item.icon}</span>
              <span>{item.text}</span>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};
