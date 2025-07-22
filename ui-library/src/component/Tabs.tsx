import React, { ReactNode, useState } from 'react';
import { TabsProps } from '../interfaces/components';

export const Tabs = ({
  tabs,
  tabWrapperClass = '',
  tabHeaderClass = '',
  tabButtonClass = '',
}: TabsProps) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <div className={`tabs-container ${tabWrapperClass}`}>
      <div className={`tabs-header ${tabHeaderClass}`}>
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`tab-button ${tabButtonClass} ${index === activeTab ? 'active' : ''}`}
            onClick={() => setActiveTab(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tabs-content">{tabs[activeTab]?.content}</div>
    </div>
  );
};
