import React from 'react';
import { ButtonProps } from '../interfaces/buttons';

export const Button = ({
  label,
  type = 'submit',
  onClick,
  disabled = false,
  variant = 'primary',
  icon,
  loading = false,
  className,
}: ButtonProps) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const circle = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    circle.style.width = circle.style.height = `${size}px`;
    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;
    circle.className = 'ripple';

    button.appendChild(circle);
    setTimeout(() => circle.remove(), 600);

    if (onClick) onClick(e);
  };

  return (
    <button
      type={type}
      onClick={(e) => {
        if (!loading) handleClick(e);
      }}
      disabled={disabled}
      className={`button ${variant}-btn ${disabled ? 'disabled' : ''} ${className}`}
    >
      {loading ? (
        <div className="loader"></div>
      ) : (
        <>
          {label}
          {icon && <span className="icon">{icon}</span>}
        </>
      )}
    </button>
  );
};
