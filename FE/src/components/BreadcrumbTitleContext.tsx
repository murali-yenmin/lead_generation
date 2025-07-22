// BreadcrumbTitleContext.tsx
import React, { createContext, useContext, useState } from 'react';

type BreadcrumbTitleContextType = {
  setTitleOverride: (path: string, title: string) => void;
  getTitleOverride: (path: string) => string | undefined;
};

const BreadcrumbTitleContext = createContext<BreadcrumbTitleContextType>({
  setTitleOverride: () => {},
  getTitleOverride: () => undefined,
});

export const BreadcrumbTitleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [titleOverrides, setTitleOverrides] = useState<Record<string, string>>({});

  const setTitleOverride = (path: string, title: string) => {
    setTitleOverrides((prev) => ({ ...prev, [path]: title }));
  };

  const getTitleOverride = (path: string) => titleOverrides[path];

  return (
    <BreadcrumbTitleContext.Provider value={{ setTitleOverride, getTitleOverride }}>
      {children}
    </BreadcrumbTitleContext.Provider>
  );
};

export const useBreadcrumbTitle = () => useContext(BreadcrumbTitleContext);
