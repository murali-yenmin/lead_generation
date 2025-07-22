import VerifiedStatus from './VerifiedIcon';

interface Props {
  status?: boolean;
  label?: React.ReactNode;
  statusBar?: boolean;
  icon?: boolean;
}

const VerifiedStatusLabel: React.FC<Props> = ({
  status = true,
  label,
  statusBar = false,
  icon = true,
}) => {
  return (
    <div
      className={`verified-status-label ${statusBar ? 'status-bar' : ''}  ${
        status ? 'active' : 'inactive'
      }`}
    >
      {icon && (
        <VerifiedStatus status={status} verified={{ background: '#43B75D', icon: '#fff' }} />
      )}
      {label && <span>{label}</span>}
    </div>
  );
};

export default VerifiedStatusLabel;
