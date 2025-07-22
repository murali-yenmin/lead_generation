import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRightIcon } from '../components/images/ChevronRightIcon';
import { menuItems } from '../components/layout/Sidebar/Sidebar';
import { useBreadcrumbTitle } from '../components/BreadcrumbTitleContext';

const findTitleFromMenu = (pathPart: string, items: any[]): string | null => {
  for (const item of items) {
    if (item.path?.endsWith(pathPart)) {
      return item.title || item.text || null;
    }
    if (item.submenu) {
      const found = findTitleFromMenu(pathPart, item.submenu);
      if (found) return found;
    }
  }
  return null;
};

const findTitleByPath = (path: string, items = menuItems): React.ReactNode => {
  const parts = path.split('/').filter(Boolean);
  const { getTitleOverride } = useBreadcrumbTitle(); // hook inside component

  if (parts.length > 0) {
    const elements: React.ReactNode[] = [];
    let accumulatedPath = '';
    let breadcrumbIndex = 0;

    parts.forEach((part) => {
      const isId = /^\d+$/.test(part);
      if (isId) return;

      accumulatedPath += `/${part}`;

      const currentMenuItem = findMenuItemByPath(accumulatedPath, items);
      if (currentMenuItem?.submenu) return;

      const overrideTitle = getTitleOverride(accumulatedPath);
      const menuTitle =
        overrideTitle ||
        currentMenuItem?.title ||
        currentMenuItem?.text ||
        part.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

      elements.push(
        <React.Fragment key={accumulatedPath}>
          {breadcrumbIndex > 0 && <ChevronRightIcon />}
          <Link to={accumulatedPath}>{menuTitle}</Link>
        </React.Fragment>,
      );

      breadcrumbIndex++;
    });

    return elements;
  }

  return '';
};

// Helper to find menu item by full path
const findMenuItemByPath = (path: string, items: any[]): any => {
  for (const item of items) {
    if (item.path === path) return item;
    if (item.submenu) {
      const found = findMenuItemByPath(path, item.submenu);
      if (found) return found;
    }
  }
  return null;
};

export const usePageTitle = () => {
  const location = useLocation();
  return findTitleByPath(location.pathname);
};
