import { useState } from 'react';
import { CollapseProps } from '../interfaces/components';

export const Collapse = ({ title, children, wrapperClass = '' }: CollapseProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className={`collapse-container ${wrapperClass}`}>
      <button className="collapse-header" onClick={() => setIsOpen(!isOpen)}>
        {title}
        <span className={`arrow ${isOpen ? 'open' : ''}`}>&#9662;</span>
      </button>
      <div className={`collapse-content ${isOpen ? 'open' : 'close'}`}>
        <div className="content-inner">{children}</div>
      </div>
    </div>
  );
};
