// hooks/useOutsideClick.ts
import { useEffect } from 'react';

export const useOutsideClick = (
  ref: React.RefObject<HTMLElement>,
  callback: () => void,
  exceptions: React.RefObject<HTMLElement>[] = [],
) => {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const isOutside =
        ref.current &&
        !ref.current.contains(event.target as Node) &&
        exceptions.every((exceptionRef) => !exceptionRef.current?.contains(event.target as Node));

      if (isOutside) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [ref, callback, exceptions]);
};
