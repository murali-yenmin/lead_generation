export const preventEscapeKeyPress = () => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  window.addEventListener('keydown', handleKeyDown, true); // Use capture phase

  return () => {
    window.removeEventListener('keydown', handleKeyDown, true);
  };
};
