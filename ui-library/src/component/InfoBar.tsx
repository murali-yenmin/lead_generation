import React from 'react';
import Info from './Images/Info';
import { InfoBarProps } from '../interfaces/components';

export const InfoBar = ({ children, type = 'info' }: InfoBarProps) => {
  return (
    <div className={`info-bar ${type}`}>
      <div>
        <Info />
      </div>
      <div>{children as React.ReactNode}</div>
    </div>
  );
};
