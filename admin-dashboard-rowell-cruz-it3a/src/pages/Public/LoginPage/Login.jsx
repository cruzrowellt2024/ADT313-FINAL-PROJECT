import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../../utils/hooks/useDebounce';
import axios from 'axios';
import { useUserContext } from '../../../context/UserContext';
import './Login.css';

const Login = () => {
    const { setRole, setAccessToken, setUserInfo } = useUserContext();

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

    let apiUrl;

    if (window.location.pathname.includes('/admin')) {
        apiUrl = '/admin/login';
    } else {
        apiUrl = '/user/login';
    }

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

        try {
            const res = await axios({
                method: 'post',
                url: apiUrl,
                data,
                headers: { 'Access-Control-Allow-Origin': '*' },
            });

            const { access_token, user } = res.data;
            if (access_token && user) {
                setAccessToken(access_token);
                setRole(user.role);
                setUserInfo(user);

                localStorage.setItem('accessToken', access_token);
                localStorage.setItem('role', user.role);
                localStorage.setItem('userInfo', JSON.stringify(user));

                if (apiUrl === '/admin/login') {
                    navigate('/main/movies');
                } else {
                    navigate('/home');
                }
            } else {
                console.error('Invalid login response');
            }

            setResult(res);
            setStatus('idle');
        } catch (e) {
            setError(e.response?.data?.message || 'An error occurred');
            console.log(e);
            setStatus('idle');
        }
    };

    useEffect(() => {
        setDebounceState(true);
    }, [userInputDebounce]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsFieldsDirty(true);

        if (email === '') {
            emailRef.current.focus();
        } else if (password === '') {
            passwordRef.current.focus();
        } else {
            handleLogin();
        }
    };

    const getInputClass = (field) => {
        if (isFieldsDirty) {
            if (field === 'email' && email === '') {
                return 'input-error';
            } else if (field === 'password' && password === '') {
                return 'input-error';
            }
        }
        return '';
    };

    return (
        <div className="login-container">
            <div className="title-container">
                <h1>The Movie DB</h1>
            </div>
            <div className="login-form">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type='text'
                            name='email'
                            ref={emailRef}
                            id="email"
                            placeholder="Enter your email"
                            onChange={(e) => handleOnChange(e, 'email')}
                            className={getInputClass('email')}
                        />
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
                                className={getInputClass('password')}
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
                    <button
                        type="submit"
                        className="login-button"
                        disabled={status === 'loading'}
                    >
                        {status === 'idle' ? 'Login' : 'Loading'}
                    </button>
                </form>
                {error && <p className="error-message">{error}</p>}
                <p className="register-link">
                    Don't have an account? <a href="/register">Register here</a>
                </p>
            </div>
        </div>
    );
};

export default Login;