import { ChangeEvent, useState } from 'react';
import Camera from '../assets/Camera';
import { PreLoader } from '../assets/PreLoader';

const pageConstant = {
  EMPTY_FIELD: '--',
};

export const ProfileUpload = ({
  pic,
  name,
  email,
  loader,
  onChange,
  accept,
  removeDisabled = false,
  removeOnClick,
}: {
  pic?: string;
  name: string;
  email: string;
  loader: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  accept?: string;
  removeDisabled?: boolean;
  removeOnClick?: () => void;
}) => {
  const userInitial = name?.charAt(0)?.toUpperCase();
  const [openProfile, setOpenProfile] = useState(false);

  return (
    <div className="profile-header">
      <div className={`profile-image-container ${openProfile ? 'profile-opened' : ''}`}>
        <button
          className="profile-placeholder"
          onClick={() => {
            setOpenProfile(true);
          }}
        >
          <div className={`close ${pic ? '' : 'initial'}`}>
            {pic ? (
              <img src={pic} alt="profile" />
            ) : name ? (
              userInitial
            ) : (
              <img src="https://www.gravatar.com/avatar/?d=mp" alt="avatar-img" />
            )}
            {openProfile && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpenProfile(false);
                }}
              >
                &times;
              </button>
            )}
          </div>
        </button>
        <label
          className={`camera-icon ${loader ? 'uploading' : ''}`}
          htmlFor="profile"
          title="Upload profile"
        >
          <input
            id="profile"
            type="file"
            accept={accept ?? 'image/jpeg, image/png, image/jpg, image/webp'}
            onChange={(e) => {
              onChange(e);
              // Reset the input value so that selecting the same file triggers onChange next time
              e.currentTarget.value = '';
            }}
            onClick={(e) => {
              if (loader) {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
          />
          {loader ? <PreLoader /> : <Camera />}
        </label>
      </div>
      {pic && (
        <button disabled={removeDisabled} className="remove" onClick={removeOnClick}>
          Remove
        </button>
      )}
      <h3>{name || pageConstant.EMPTY_FIELD}</h3>
      <p>{email || pageConstant.EMPTY_FIELD}</p>
    </div>
  );
};
