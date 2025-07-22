import React from 'react';

interface CloseIconProps {
  color?: string;
}

const CloseIcon: React.FC<CloseIconProps> = ({ color = 'currentColor' }) => {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.343675 0.343186C0.734199 -0.0473381 1.36736 -0.0473381 1.75789 0.343186L11.6574 10.2427C12.0479 10.6332 12.0479 11.2664 11.6574 11.6569C11.2669 12.0474 10.6337 12.0474 10.2432 11.6569L0.343675 1.7574C-0.0468496 1.36688 -0.0468496 0.733711 0.343675 0.343186Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.6574 0.343186C12.0479 0.733711 12.0479 1.36688 11.6574 1.7574L1.75789 11.6569C1.36736 12.0474 0.734199 12.0474 0.343675 11.6569C-0.0468497 11.2664 -0.04685 10.6332 0.343675 10.2427L10.2432 0.343186C10.6337 -0.0473381 11.2669 -0.0473381 11.6574 0.343186Z"
        fill={color}
      />
    </svg>
  );
};

export default CloseIcon;
