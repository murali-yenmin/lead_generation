import React from 'react';
import { DateRangeInput } from './DateRangeInput';
import { Button } from './Button';

interface Tab {
  label: string;
  value: string;
  component: React.ReactNode;
}

interface SwitchTabsProps {
  tabs: Tab[];
  activeTab: string;
  dateRange?: boolean;
  range?: { start: string; end: string } | null;
  setRange?: (range: object) => void;
  onTabChange: (value: string) => void;
}

export const SwitchTabs: React.FC<SwitchTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  range,
  setRange,
  dateRange = false,
}) => {
  const activeTabContent = tabs.find((tab) => tab.value === activeTab)?.component;

  const handleDateChange = (value: { start: string; end: string } | null) => {
    if (value && setRange) {
      setRange(value);
    }
  };

  return (
    <div className="switch-tabs-wrapper">
      <div className="switch-header">
        <div className="switch-tabs">
          {tabs.map((tab) => (
            <Button
              label={tab.label}
              key={tab.label}
              onClick={() => onTabChange(tab.value)}
              variant="primary"
              className={`button ${activeTab === tab.value ? 'active' : ''}`}
            />
          ))}
        </div>
        {dateRange && (
          <div>
            <DateRangeInput
              label="Date Range"
              id="switch-tab-date"
              value={range}
              onChange={handleDateChange}
            />
          </div>
        )}
      </div>

      <div className="tab-content">{activeTabContent}</div>
    </div>
  );
};
