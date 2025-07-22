import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './assets/scss/app.scss';
import { Provider } from 'react-redux';
import store from './store/store';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import { setApiBaseUrl, ToasterProvider } from 'UI-Library';
import SignIn from './screen/authentication/SignIn';
import AuthLayout from './screen/authentication/AuthLayout';
import { HelmetProvider } from 'react-helmet-async';
import MainLayout from './components/layout';
import { BreadcrumbTitleProvider } from './components/BreadcrumbTitleContext';
import ResponsiveAlert from './components/ResponsiveAlert';
import Dashboard from './screen/dashboard/Dashboard';
import LinkedIn from './components/LinkedIn';
import Emailsender from './components/Emailsender';
import GoogleAds from './components/GoogleAds';

const root = createRoot(document.getElementById('root') as HTMLElement);

const App = () => {
  setApiBaseUrl(`${process.env.REACT_APP_BACKEND_URL}`);

  return (
    <BreadcrumbTitleProvider>
      <HelmetProvider>
        <Provider store={store}>
          <ToasterProvider />
          <ResponsiveAlert />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<AuthLayout />}>
                <Route index element={<SignIn />} />
                <Route path="/signin" element={<SignIn />} />
              </Route>

              <Route
                path="/*"
                element={
                  <MainLayout>
                    <Routes>
                      <Route path="dashboard" element={<Outlet />}>
                        <Route index element={<Dashboard />} />
                        <Route path="linkedin" element={<LinkedIn />} />
                        <Route path="emailsender" element={<Emailsender />} />
                        <Route path="googleads" element={<GoogleAds />} />
                      </Route>
                    </Routes>
                  </MainLayout>
                }
              ></Route>
            </Routes>
          </BrowserRouter>
        </Provider>
      </HelmetProvider>
    </BreadcrumbTitleProvider>
  );
};

root.render(<App />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
