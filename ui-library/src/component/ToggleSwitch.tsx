import { ToggleSwitchProps } from '../interfaces/formFields';
import React, { useState, useEffect } from 'react';

export const ToggleSwitch = ({
  label,
  name,
  onClick,
  disabled = false,
  defaultChecked = false,
  value,
}: ToggleSwitchProps) => {
  const isControlled = typeof value === 'boolean';
  const [internalChecked, setInternalChecked] = useState<boolean>(defaultChecked);

  const checked = isControlled ? value : internalChecked;

  useEffect(() => {
    setInternalChecked(defaultChecked);
  }, [defaultChecked]);

  const handleToggle = () => {
    if (disabled) return;

    const newChecked = !checked;
    if (!isControlled && !onClick) {
      setInternalChecked(newChecked);
    }
    if (onClick) {
      onClick(newChecked);
    }
  };

  return (
    <div className="toggle-container">
      {label && (
        <label htmlFor={name} className="toggle-label">
          {label}
        </label>
      )}
      <button
        onClick={handleToggle}
        className={`toggle-button ${checked ? 'checked' : 'unchecked'}`}
        disabled={disabled}
      >
        <div className={`toggle-circle ${checked ? 'checked' : 'unchecked'}`} />
      </button>
    </div>
  );
};
