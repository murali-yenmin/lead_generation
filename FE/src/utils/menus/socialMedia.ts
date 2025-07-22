import keywordsIcon from '../../assets/images/keywords-media.png';
import linkedInIcon from '../../assets/images/linked-in.png';
import emailSenderIcon from '../../assets/images/email.png';
import googleAds from '../../assets/images/google-ads.png';

interface SocialMediaProps {
  id: number;
  img: string;
  title: string;
  path: string;
}

export const socialMediaDatas: SocialMediaProps[] = [
  //   {
  //     id: 1,
  //     img: keywordsIcon,
  //     title: 'Keywords',
  //     path:"keywords",
  //   },
  {
    id: 2,
    img: linkedInIcon,
    title: 'LinkedIn',
    path: 'linkedin',
  },
  {
    id: 3,
    img: emailSenderIcon,
    title: 'Email Sender',
    path: 'emailsender',
  },
  {
    id: 4,
    img: googleAds,
    title: 'Google Ads',
    path: 'googleads',
  },
];
