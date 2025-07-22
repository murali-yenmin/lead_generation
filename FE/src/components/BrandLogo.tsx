import VisaWhiteLogo from './images/VisaWhiteLogo';
import MasterCardWhiteLogo from './images/MasterCardWhiteLogo';

const BrandLogo = ({ brand }: { brand: string }) => {
  switch (brand.toLowerCase()) {
    case 'visa':
      return <VisaWhiteLogo />;
    case 'mastercard':
      return <MasterCardWhiteLogo />;
    case 'discover':
      return <MasterCardWhiteLogo />;
    default:
      return null;
  }
};

export default BrandLogo;
