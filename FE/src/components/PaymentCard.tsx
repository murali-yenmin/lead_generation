import BankLogo from './images/BankLogo';
import SecondaryButton from './SecondaryButton';
import { PaymentCardProps } from '../interfaces/components';
import BrandLogo from './BrandLogo';
import { PaymentMethods } from '../utils/enum';
import { TooltipWrapper } from 'UI-Library';

function PaymentCard({
  ACHCard = false,
  creditCard = false,
  debitCard = false,
  className = '',
  onClick,
  ViewDetailOpt = true,
  cardInfo,
  isDefalut,
}: PaymentCardProps) {
  const changeNextScreen = (cardType: string) => {
    onClick && onClick(3, cardType);
  };
  return (
    <div
      className={`payment-card ${className} ${ACHCard ? 'p16' : 'p23'} ${
        ACHCard && 'ach-card-bg'
      }  ${creditCard && 'credit-card-bg'} ${debitCard && 'debit-card-bg'}`}
    >
      <div className={`bank-info card-more-info-wrap`}>
        <div>
          <p
            className={`user-name text-uppercase`}
            data-tooltip-id={cardInfo?.number ?? ''}
            data-tooltip-content={cardInfo?.name}
          >
            {cardInfo?.name}
          </p>
          {!ACHCard && (
            <TooltipWrapper id={cardInfo?.number ?? ''} content={cardInfo?.name ?? ''} />
          )}
          <p className={`card-num text-uppercase`}>
            {ACHCard ? cardInfo?.number : `**** **** **** ${cardInfo?.number}`}
          </p>
        </div>
        {isDefalut && <p className="default-style">Default</p>}
      </div>

      <div>
        <>
          <div className={`card-more-info-wrap ${ACHCard ? 'account' : ''}`}>
            {!ACHCard && (
              <div className="expiry-date">
                <p className="label">Expiry Date</p>
                <p className="date">
                  {cardInfo?.exp_month}/{cardInfo?.exp_year}
                </p>
              </div>
            )}
            {ViewDetailOpt ? (
              <SecondaryButton
                label="View details"
                className="view-details-btn"
                onClick={() => {
                  if (creditCard) changeNextScreen(PaymentMethods.credit);
                  else if (debitCard) changeNextScreen(PaymentMethods.debit);
                  else changeNextScreen(PaymentMethods.ach);
                }}
              />
            ) : null}
            {!ACHCard && (
              <div>
                <BrandLogo brand={cardInfo?.brand ?? ''} />
              </div>
            )}
            {ACHCard && (
              <div className="bank-logo-wrap">
                <BankLogo />
              </div>
            )}
          </div>
        </>
      </div>
    </div>
  );
}

export default PaymentCard;
