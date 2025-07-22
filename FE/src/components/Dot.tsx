import { DotUi } from 'Components/interfaces/components';
import React from 'react';

function Dot({ className = '' }: DotUi) {
  return <div className={`default-dot ${className}`}></div>;
}

export default Dot;
