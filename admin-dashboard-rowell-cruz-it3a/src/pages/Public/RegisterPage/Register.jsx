import { useState, useRef, useCallback, useEffect } from 'react';
import './Register.css';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../../utils/hooks/useDebounce';
import axios from 'axios';
import { useUserContext } from '../../../context/UserContext';

function Register() {
  const { setRole, setAccessToken, setUserInfo } = useUserContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [role, setRoleLocal] = useState('');
  const [isFieldsDirty, setIsFieldsDirty] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const firstNameRef = useRef();
  const middleNameRef = useRef();
  const lastNameRef = useRef();
  const contactNoRef = useRef();
  const roleRef = useRef();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const userInputDebounce = useDebounce({ email, password, firstName, middleName, lastName, contactNo, role }, 2000);
  const [debounceState, setDebounceState] = useState(false);
  const [status, setStatus] = useState('idle');

  const navigate = useNavigate();

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
      case 'firstName':
        setFirstName(event.target.value);
        break;
      case 'middleName':
        setMiddleName(event.target.value);
        break;
      case 'lastName':
        setLastName(event.target.value);
        break;
      case 'contactNo':
        setContactNo(event.target.value);
        break;
      case 'role':
        setRoleLocal(event.target.value);
        break;
      default:
        break;
    }
  };

  const handleRegister = async () => {
    const data = { email, password, firstName, middleName, lastName, contactNo, role };
    setStatus('loading');
    
    try {
      const response = await axios.post('/admin/register', data);
      console.log(response.data);

      if (response.data && response.data.access_token && response.data.user) {
        const { access_token, user } = response.data;
        setAccessToken(access_token);
        setRole(user.role);
        setUserInfo(user);

        localStorage.setItem('accessToken', access_token);

        if (user.role === 'admin') {
          navigate('/main/movies');
        } else {
          navigate('/home');
        }
      } else {
        console.error('Invalid registration response:', response.data);
      }
    
      setStatus('idle');
    } catch (e) {
      setStatus('idle');
      console.error(e);
      navigate('/');
    }
  };
  
  useEffect(() => {
    setDebounceState(true);
  }, [userInputDebounce]);

  return (
    <div className="Register">
      <div className="main-container">
        <div className="title-container">
          <h1>The Movie DB</h1>
        </div>
        <form>
          <div className="register-form-container">
            <h2>Register</h2>
            <div className="form-group">
              <label>First Name:</label>
              <input
                type="text"
                name="firstName"
                ref={firstNameRef}
                onChange={(e) => handleOnChange(e, 'firstName')}
              />
              {debounceState && isFieldsDirty && firstName === '' && (
                <span className="errors">This field is required</span>
              )}
            </div>
            <div className="form-group">
              <label>Middle Name:</label>
              <input
                type="text"
                name="middleName"
                ref={middleNameRef}
                onChange={(e) => handleOnChange(e, 'middleName')}
              />
              {debounceState && isFieldsDirty && middleName === '' && (
                <span className="errors">This field is required</span>
              )}
            </div>
            <div className="form-group">
              <label>Last Name:</label>
              <input
                type="text"
                name="lastName"
                ref={lastNameRef}
                onChange={(e) => handleOnChange(e, 'lastName')}
              />
              {debounceState && isFieldsDirty && lastName === '' && (
                <span className="errors">This field is required</span>
              )}
            </div>
            <div className="form-group">
              <label>Contact Number:</label>
              <input
                type="text"
                name="contactNo"
                ref={contactNoRef}
                onChange={(e) => handleOnChange(e, 'contactNo')}
              />
              {debounceState && isFieldsDirty && contactNo === '' && (
                <span className="errors">This field is required</span>
              )}
            </div>
            <div className="form-group">
              <label>Role:</label>
              <input
                type="text"
                name="role"
                ref={roleRef}
                onChange={(e) => handleOnChange(e, 'role')}
              />
              {debounceState && isFieldsDirty && role === '' && (
                <span className="errors">This field is required</span>
              )}
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="text"
                name="email"
                ref={emailRef}
                onChange={(e) => handleOnChange(e, 'email')}
              />
              {debounceState && isFieldsDirty && email === '' && (
                <span className="errors">This field is required</span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-container">
                <input
                  type={isShowPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="Enter your password"
                  name="password"
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
              {debounceState && isFieldsDirty && password === '' && (
                <span className="errors">This field is required</span>
              )}
            </div>
            <div className="submit-container">
              <button
                type="button"
                className="register-button"
                disabled={status === 'loading'}
                onClick={handleRegister}
              >
                {status === 'idle' ? 'Register' : 'Loading'}
              </button>
            </div>
            <p className="register-link">
              Already have an account? <a href="/">Login</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;