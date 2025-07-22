import { useRef, useState } from 'react';
import { UserProfileProps } from '../interfaces/components';
import OutsideClick from '../utils/outsideClick';
import { getFirstLetter } from '../utils/getFirstLetter';
import DownArrow from './Images/DownArrow';
import { useWindowSize } from '../hooks/useWindowSize';
import Skeleton from 'react-loading-skeleton';

export const UserProfile = ({
  name,
  role,
  imageUrl,
  enableDropdown,
  dropDownItems,
  onClickProfile,
  loader = false,
}: UserProfileProps) => {
  const profileRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);

  OutsideClick({ wrapperRef: profileRef, setIsOpen });

  const { width } = useWindowSize();

  const isDesktop = width > 992;

  return (
    <div className="profile-container" ref={profileRef}>
      <button
        className="profile"
        onClick={() => {
          setIsOpen(!isOpen);
          if (onClickProfile) {
            onClickProfile();
          }
        }}
      >
        <div className="avatar">
          {loader ? (
            <Skeleton height={`40px`} width={`40px`} borderRadius={`50%`} />
          ) : imageUrl ? (
            <img src={imageUrl} alt={name} className="avatar-image" />
          ) : name ? (
            <span className="avatar-initials">{getFirstLetter(name)}</span>
          ) : (
            <img
              src={'https://www.gravatar.com/avatar/?d=mp'}
              alt={name}
              className="avatar-image"
            />
          )}
        </div>

        <div className="profile-info">
          {loader ? (
            <>
              <Skeleton height={`12px`} width={`70px`} />
              <Skeleton height={`17px`} width={`130px`} />
            </>
          ) : (
            <>
              {!role && <p className="profile-role">Welcome</p>}
              {name && <p className="profile-name">{name}</p>}
              {role && <p className="profile-role">{role}</p>}
            </>
          )}
        </div>
        {isDesktop && (
          <div className="arrow-icon">
            <div>
              <DownArrow />
            </div>
            <div>
              <DownArrow />
            </div>
          </div>
        )}
      </button>
      {enableDropdown && isOpen && (
        <div className="dropdown-menu">
          {dropDownItems ? (
            dropDownItems.map((item, index) => (
              <button
                key={index}
                className={`dropdown-item ${item.className || ''}`}
                onClick={() => {
                  if (item?.onClick) {
                    item?.onClick();
                  }
                  setIsOpen(false);
                }}
              >
                {item?.icon && <span className="icon">{item?.icon}</span>}
                <span>{item.label}</span>
              </button>
            ))
          ) : (
            <button className={`dropdown-item `}>
              <span>No items</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
