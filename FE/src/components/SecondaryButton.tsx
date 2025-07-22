import { SecondaryBtn } from '../interfaces/components';

function SecondaryButton({ label, className = '', onClick }: SecondaryBtn) {
  return (
    <button type="button" className={`secondary-btn ${className}`} onClick={() => onClick(0)}>
      {label}
    </button>
  );
}

export default SecondaryButton;
