import keywordsIcon from '../../assets/images/keywords-media.png';
import linkedInIcon from '../../assets/images/linked-in.png';
import emailSenderIcon from '../../assets/images/email.png';
import googleAds from '../../assets/images/google-ads.png';

interface SocialMediaProps {
  id: number;
  img: string;
  title: string;
}

export const socialMediaDatas: SocialMediaProps[] = [
  //   {
  //     id: 1,
  //     img: keywordsIcon,
  //     title: 'Keywords',
  //   },
  {
    id: 2,
    img: linkedInIcon,
    title: 'LinkedIn',
  },
  {
    id: 3,
    img: emailSenderIcon,
    title: 'Email Sender',
  },
  {
    id: 4,
    img: googleAds,
    title: 'Google Ads',
  },
];
