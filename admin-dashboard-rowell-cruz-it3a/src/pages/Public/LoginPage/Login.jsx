import { useState, useRef, useCallback, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../../utils/hooks/useDebounce';
import axios from 'axios';
import { useUserContext } from '../../../context/UserContext';
import './Login.css';

const Login = () => {
    const { setRole } = useUserContext();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isFieldsDirty, setIsFieldsDirty] = useState(false);
    const emailRef = useRef();
    const passwordRef = useRef();
    const [isShowPassword, setIsShowPassword] = useState(false);
    const userInputDebounce = useDebounce({ email, password }, 2000);
    const [debounceState, setDebounceState] = useState(false);
    const [status, setStatus] = useState('idle');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [result, setResult] = useState();

  const handleShowPassword = useCallback(() => {
    setIsShowPassword((value) => !value);
  }, [isShowPassword]);

  const handleOnChange = (event, type) => {
    setDebounceState(false);
    setIsFieldsDirty(true);

    switch (type) {
      case 'email':
        setEmail(event.target.value);
        break;

      case 'password':
        setPassword(event.target.value);
        break;

      default:
        break;
    }
  };

  const handleLogin = async () => {
    const data = { email, password };
    setStatus('loading');
  
    await axios({
      method: 'post',
      url: '/admin/login',
      data,
      headers: { 'Access-Control-Allow-Origin': '*' },
    })
      .then((res) => {
        console.log('Response:', res);
        const role = res.data.user?.role; 
        localStorage.setItem('accessToken', res.data.access_token);
  
        if (role) {
          setRole(role);
          if (role === 'admin') {
            navigate('/main/movies');
          } else {
            navigate('/home');
          }
        } else {
          console.error('Role is missing in the response');
        }
        setResult(res);
        setStatus('idle');
        console.log('Token:', localStorage.getItem('accessToken'));

      })
      .catch((e) => {
        setError(e.response?.data?.message || 'An error occurred');
        console.log(e);
        setStatus('idle');
      });
  };
  

  useEffect(() => {
    setDebounceState(true);
  }, [userInputDebounce]);

  return (
    <div className="login-container">
      <div className="title-container">
        <h1>The Movie DB</h1>
      </div>
      <div className="login-form">
        <h3>Login</h3>
        <form>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
                  type='text'
                  name='email'
                  ref={emailRef}
                  id="email"
                  placeholder="Enter your email"
                  onChange={(e) => handleOnChange(e, 'email')}
                />
                {debounceState && isFieldsDirty && email == '' && (
                <span className='errors'>This field is required</span>
              )}
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-container">
              <input
                type={isShowPassword ? 'text' : 'password'}
                id="password"
                placeholder="Enter your password"
                name='password'
                ref={passwordRef}
                onChange={(e) => handleOnChange(e, 'password')}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={handleShowPassword}
              >
                {isShowPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          <button type="submit"
            className="login-button"
            disabled={status === 'loading'}
            onClick={() => {
                if (status === 'loading') {
                return;
                }
                if (email && password) {
                handleLogin();
                } else {
                setIsFieldsDirty(true);
                if (email == '') {
                    emailRef.current.focus();
                }

                if (password == '') {
                    passwordRef.current.focus();
                }
                }
            }}>{status === 'idle' ? 'Login' : 'Loading'}</button>
        </form>
        <p className="register-link">
          Don't have an account? <a href="/register">Register here</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
