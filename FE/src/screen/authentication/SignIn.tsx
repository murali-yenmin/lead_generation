import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginForm } from '../../utils/yupValidations';
import { LoginFormInputs } from '../../interfaces/components';
import { Link, useNavigate } from 'react-router-dom';
import { Title, Input, Password, Button, setToken, clearToken } from 'UI-Library';
import { signinUser } from '../../store/asyncThunks/auth';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { Helmet } from 'react-helmet-async';
import { projectName } from '../../utils/constFile';
import { jwtDecode } from 'jwt-decode';
import { storeToken } from '../../store/slice/authentication/authSlice';
const SignIn = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const signinLoader = useAppSelector((state) => state.signinReducer.loading);

  const {
    handleSubmit,
    control,
    setFocus,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(loginForm),

    defaultValues: {
      email_address: '',
      password: '',
    },
  });

  const navigateAfterSignin = (token?: string) => {
    if (token) {
      navigate('/dashboard');
      setToken(token);
      const decoded = jwtDecode(token);
      console.log(decoded);
      dispatch(storeToken(token));
    }
  };

  const backToVerify = () => {
    navigate('/verify-account');
  };

  const onSubmit = (data: LoginFormInputs) => {
    let loginData: any = {};
    loginData['email'] = data?.email_address?.toLowerCase();
    loginData['password'] = data?.password;
    dispatch(signinUser({ loginData, navigateAfterSignin, backToVerify }));
  };

  useEffect(() => {
    clearToken();
    setFocus('email_address');
  }, []);

  return (
    <>
      <Helmet>
        <title> Sign In - {projectName}</title>
      </Helmet>
      <div className="screen-container">
        <div className="auth-screen sign-in">
          <Title text="Sign in" />
          <p>Please login to continue to your account.</p>
          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Input
                name="email_address"
                control={control}
                label="Email address"
                error={errors.email_address}
                required={true}
              />

              <div className="Password-input">
                <Password
                  control={control}
                  label="Password"
                  name="password"
                  sizeMin={8}
                  error={errors.password}
                  required={true}
                />
              </div>
              <div className="forgot">
                <div>
                  <p>
                    <Link to="/forgot-password">Forgot password?</Link>
                  </p>
                </div>
              </div>
              <div className="submit-btn">
                <Button loading={signinLoader} label="Sign in" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
