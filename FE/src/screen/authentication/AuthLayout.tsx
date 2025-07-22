import Slider from 'react-slick';
import { Link, Outlet } from 'react-router-dom';
import { setApiBaseUrl } from 'UI-Library';
import AuthImage from '../../assets/svg/auth-left.svg';
import AppLogo from '../../assets/svg/logo.svg';

const AuthLayout = () => {
  setApiBaseUrl(`${process.env.REACT_APP_BACKEND_URL}`);

  const settings = {
    dots: true,
    infinite: true,
    arrows: false,
    speed: 500,
    fade: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };
  return (
    <div className="auth-layout">
      <div className="auth-bg">
        <div className="app-logo">
          <span>
            <Link to={'/'}>
              <img src={AppLogo} alt="AppLogo" />
            </Link>
          </span>
        </div>
        <div className="auth-placeholder">
          <img src={AuthImage} alt="image" />
        </div>
        <div className="slider-grp">
          <ul className="slider-content">
            <Slider {...settings}>
              <li>
                Pay rent effortlessly
                <br />
                with <span>just a few clicks!</span>
              </li>
              <li>
                Pay rent effortlessly
                <br />
                with <span>just a few clicks!</span>
              </li>
              <li>
                Pay rent effortlessly
                <br />
                with <span>just a few clicks!</span>
              </li>
            </Slider>
          </ul>
        </div>
      </div>
      <div className="auth-forms">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
