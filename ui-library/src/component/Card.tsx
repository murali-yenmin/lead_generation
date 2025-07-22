import { CardProps } from '../interfaces/components';

export const Card = ({
  title,
  children,
  footer,
  Icons,
  cardClass = '',
  cardHeaderClass = '',
}: CardProps) => {
  return (
    <div className={`card ${cardClass}`}>
      {title && (
        <div className={`card-header ${cardHeaderClass}`}>
          {title} {Icons}
        </div>
      )}
      <div className="card-body">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
};
