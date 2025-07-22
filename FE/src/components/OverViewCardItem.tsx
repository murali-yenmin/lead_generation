import Skeleton from 'react-loading-skeleton';
interface OverViewCardItemProps {
  icon?: React.ReactNode;
  label: string;
  amount: string | number;
  className: string;
  loader?: boolean;
}

export const OverViewCardItem = ({
  icon,
  label,
  amount,
  className,
  loader = false,
}: OverViewCardItemProps) => (
  <div className={`over-view-card ${!loader ? className : ''}`}>
    {icon && (
      <>
        {loader ? (
          <div className="icon">
            <Skeleton width={38} height={38} borderRadius={50} />
          </div>
        ) : (
          <div>
            <div className="icon">{icon}</div>
          </div>
        )}
      </>
    )}
    {loader ? (
      <div>
        <p>
          <Skeleton width={180} height={12} />
        </p>

        <Skeleton width={180} height={20} />
      </div>
    ) : (
      <div>
        <p>{label}</p>
        <h6>{amount}</h6>
      </div>
    )}
  </div>
);
