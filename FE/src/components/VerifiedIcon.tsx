interface Color {
  background: string | undefined;
  icon: string | undefined;
}

interface VerifiedStatusProps {
  status: boolean;
  verified?: Color;
  unverified?: Color;
}

const VerifiedStatus = ({ status, verified, unverified }: VerifiedStatusProps) => {
  const verifiedBackground = verified?.background ?? '#D0F4CE';
  const verifiedIcon = verified?.icon ?? '#145214';
  const unverifiedBackground = unverified?.background ?? '#FFECD1';
  const unverifiedIcon = unverified?.icon ?? '#B27820';

  return (
    <div className="verifiedIcon">
      {status ? (
        <svg
          width="16"
          height="17"
          viewBox="0 0 16 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect y="0.302734" width="16" height="16" rx="8" fill={verifiedBackground} />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.7793 6.27289C11.0722 6.56579 11.0722 7.04066 10.7793 7.33355L7.77998 10.3328C7.48708 10.6257 7.01221 10.6257 6.71932 10.3328L5.21967 8.8332C4.92678 8.5403 4.92678 8.06543 5.21967 7.77254C5.51256 7.47964 5.98744 7.47964 6.28033 7.77254L7.24965 8.74185L9.71861 6.27289C10.0115 5.98 10.4864 5.98 10.7793 6.27289Z"
            fill={verifiedIcon}
          />
        </svg>
      ) : (
        <svg
          width="16"
          height="17"
          viewBox="0 0 16 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect y="0.302734" width="16" height="16" rx="8" fill={unverifiedBackground} />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7.99414 4.18652C8.40835 4.18652 8.74414 4.52231 8.74414 4.93652V8.93652C8.74414 9.35074 8.40835 9.68652 7.99414 9.68652C7.57993 9.68652 7.24414 9.35074 7.24414 8.93652V4.93652C7.24414 4.52231 7.57993 4.18652 7.99414 4.18652Z"
            fill={unverifiedIcon}
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7.24414 11.6687C7.24414 11.2545 7.57993 10.9187 7.99414 10.9187H8.00414C8.41835 10.9187 8.75414 11.2545 8.75414 11.6687C8.75414 12.0829 8.41835 12.4187 8.00414 12.4187H7.99414C7.57993 12.4187 7.24414 12.0829 7.24414 11.6687Z"
            fill={unverifiedIcon}
          />
        </svg>
      )}
    </div>
  );
};

export default VerifiedStatus;
