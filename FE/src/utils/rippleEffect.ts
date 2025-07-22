export const rippleEffectClick = (e: React.MouseEvent<HTMLButtonElement>) => {
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
};
