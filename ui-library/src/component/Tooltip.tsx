export interface TooltipProps {
  children: React.ReactNode;
  tooltipId: string;
  btntext: string;
}

export const Tooltip = ({ tooltipId = '', children, btntext }: TooltipProps) => {
  return (
    <div className="tooltip-container">
      <button aria-describedby={tooltipId} className="help-button">
        {btntext ? btntext : 'Need Help?'}
      </button>
      <div role="tooltip" id={tooltipId} className="tooltip">
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Tooltip;
