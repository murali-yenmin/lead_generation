import { useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import { Sidebar } from './Sidebar/Sidebar';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { useEffect, useState } from 'react';
import { CheckIdle, Interceptor } from 'UI-Library';
import IdleIMage from '../../assets/svg/idle-timer.svg';
import { usePageTitle } from '../../hooks/usePageTitle';
import { ChevronRightIcon } from '../images/ChevronRightIcon';
import Home from '../images/Home';
import ScrollToTop from '../ScrollToTop';
import useWindowSize from '../../hooks/useWindowSize';

const MainLayout = ({ children }: any) => {
  const dispatch = useAppDispatch();

  const token = useAppSelector((state) => state.authReducer.token);
  const navigate = useNavigate();
  const location = useLocation();
  const { width } = useWindowSize();
  const [isMobile, setIsMobile] = useState(width <= 992);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pageTitle = usePageTitle();

  useEffect(() => {
    if (width) setIsMobile(width <= 992);
  }, [width]);

  useEffect(() => {
    if (!token) {
      navigate('/signin');
    }
  }, [token, location.pathname]);

  //MObile
  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileMenuOpen((prev) => !prev);
    }
  };
  const handleTimeout = () => {
    navigate('/signin');
  };

  return (
    <div className="admin-layout">
      <Interceptor
        handleLogout={() => {
          dispatch({ type: 'LOGOUT' });
          navigate('/signin');
        }}
      />
      <CheckIdle
        idleImage={IdleIMage}
        handleTimeout={handleTimeout}
        content={
          'Your idle for too long please click continue to stay otherwise we will be redirect to sign in.'
        }
      />
      {/* Auto scroll to top */}
      <ScrollToTop />
      {/* Sidebar */}
      <aside className="">
        <Sidebar
          isMobile={isMobile}
          isMobileMenuOpen={isMobileMenuOpen}
          toggleSidebar={toggleSidebar}
        />
      </aside>

      {/* Main Content Area */}
      <div className="main-content">
        {/* Header */}
        <div className="header">
          <Header isMobile={isMobile} toggleSidebar={toggleSidebar} />
        </div>

        {/* Main Section */}
        <main className="content">
          <div className="children">
            <div className="main-page-title">
              <span
                className="icon"
                onClick={() => {
                  navigate('/dashboard');
                }}
              >
                <Home />
              </span>
              <ChevronRightIcon />
              <span className="title-text">{pageTitle}</span>
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
