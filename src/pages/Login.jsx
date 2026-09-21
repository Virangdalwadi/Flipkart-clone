import React, { useState, useEffect } from 'react';
import Loginimg from "../assets/Login Image/Login.png";
import Footer from '../components/Footer';
import Navbar3 from '../components/Navbar3';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const commonPasswords = new Set([
  "password",
  "password123",
  "12345678",
  "qwerty",
  "qwerty123",
  "abc123",
  "welcome",
  "admin123",
]);

const validateRegistrationPassword = (password, username, email) => {
  if (password.length < 8) return "Password must be at least 8 characters long.";
  if (password.length > 128) return "Password must not exceed 128 characters.";
  if (/\s/.test(password)) return "Password must not contain spaces.";
  if (!/[A-Z]/.test(password)) return "Password must contain an uppercase letter.";
  if (!/[a-z]/.test(password)) return "Password must contain a lowercase letter.";
  if (!/\d/.test(password)) return "Password must contain a number.";
  if (!/[^A-Za-z0-9\s]/.test(password)) {
    return "Password must contain a special character.";
  }
  if (/(.)\1\1/.test(password)) {
    return "Password must not contain three repeated characters.";
  }

  const normalizedPassword = password.toLowerCase();
  const normalizedUsername = username.trim().toLowerCase();
  const normalizedEmail = email.trim().toLowerCase();
  const predictablePatterns = [
    "012",
    "123",
    "234",
    "345",
    "456",
    "567",
    "678",
    "789",
    "987",
    "qwerty",
    "asdf",
  ];

  if (commonPasswords.has(normalizedPassword)) {
    return "This password is too common. Please choose a stronger password.";
  }
  if (predictablePatterns.some((pattern) => normalizedPassword.includes(pattern))) {
    return "Password must not contain predictable sequences.";
  }
  if (normalizedUsername && normalizedPassword.includes(normalizedUsername)) {
    return "Password must not contain your name.";
  }
  if (normalizedEmail && normalizedPassword.includes(normalizedEmail)) {
    return "Password must not contain your email.";
  }
  return "";
};

const Login = () => {

  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.state?.mode !== "register");
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({ ...currentData, [name]: value }));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (location.state?.mode === "register") {
      setIsLogin(false);
      return;
    }

    if (location.state?.mode === "login" || !location.state?.mode) {
      setIsLogin(true);
    }
  }, [location.state?.mode]);


  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (!isLogin) {
      const passwordError = validateRegistrationPassword(
        formData.password,
        formData.name,
        formData.email,
      );
      if (passwordError) {
        setError(passwordError);
        return;
      }
    }

    setSubmitting(true);
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.name, formData.email, formData.password);
      }
      const destination = location.state?.from;
      const redirectTo = destination
        ? `${destination.pathname}${destination.search || ""}${destination.hash || ""}`
        : '/';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar3 />
      <div className="flex h-[93vh] items-center justify-center bg-gray-200">
        <div className='mt-14 flex w-211.5 h-138 bg-white'>
          <div className='flex flex-col justify-between bg-[#2874f0] w-[40%] px-8 py-9' >
            <div className='flex flex-col'>
              <h1 className='text-[28px] text-white font-inter-stack'>
                {isLogin ? 'Login' : `Looks like you're new here!`}
              </h1>
              <h2 className='text-[18px] mt-4 text-[#DBDBDB]'>
                {isLogin ? 'Get access to your Orders, Wishlist and Recommendations' : 'Sign up with your email id to get started'}
              </h2>
            </div>
            <img src={Loginimg} />
          </div>

          {/* Right side div */}
          <div className='flex w-[60%] flex-col justify-between px-8.75 pb-4 pt-14'>
            <div className='flex flex-col'>

              <form className='flex flex-col gap-5' onSubmit={handleSubmit}>
                {!isLogin && (
                  <input
                    className='w-full border-b border-gray-300 px-1 py-2 outline-none focus:border-blue-600'
                    name='name'
                    value={formData.name}
                    onChange={handleChange}
                    placeholder='Enter Name'
                    autoComplete='username'
                    required
                  />

                )}
                <input
                  className='w-full border-b border-gray-300 px-1 py-2 outline-none focus:border-blue-600'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  placeholder='Enter Email'
                  type='email'
                  autoComplete='email'
                  required
                />
                <div className='flex items-center border-b border-gray-300 focus-within:border-blue-600'>
                  <input
                    className='w-full px-1 py-2 outline-none'
                    name='password'
                    value={formData.password}
                    onChange={handleChange}
                    placeholder='Enter Password'
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                    minLength={isLogin ? undefined : 8}
                    maxLength={isLogin ? undefined : 128}
                    required
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword((visible) => !visible)}
                    className='px-2 py-2 text-gray-500 hover:text-gray-800'
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </button>
                </div>
                {!isLogin && (
                  <div className='flex items-center border-b border-gray-300 focus-within:border-blue-600'>
                    <input
                      className='w-full px-1 py-2 outline-none'
                      name='confirmPassword'
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder='Confirm Password'
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete='new-password'
                      required
                    />
                    <button
                      type='button'
                      onClick={() => setShowConfirmPassword((visible) => !visible)}
                      className='px-2 py-2 text-gray-500 hover:text-gray-800'
                      aria-label={showConfirmPassword ? 'Hide confirmation password' : 'Show confirmation password'}
                    >
                      <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                    </button>
                  </div>
                )}
                {error && <p className='text-sm text-red-600'>{error}</p>}
                <p className='mt-2 text-sm text-gray-500'>By continuing, you agree to Flipkart's <span className='text-blue-600 cursor-pointer'>Terms of Use</span> and <span className='text-blue-600 cursor-pointer'>Privacy Policy</span>.</p>

                <button type='submit' disabled={submitting} className='mt-1 cursor-pointer w-full border-none bg-[#fb641b] py-3 text-white shadow-sm font-semibold disabled:opacity-60' >
                  {submitting ? 'Please wait...' : (isLogin ? 'Login' : 'Register')}
                </button>
              </form>
            </div>

            <div>
              <div className="mt-6 text-center text-sm text-gray-600">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
                    setError('');
                  }}
                  className="text-blue-600  font-semibold hover: bg-transparent border-none cursor-pointer"
                >
                  {isLogin ? 'Register here' : 'Login here'}
                </button>
              </div>

            </div>

          </div>

        </div>
      </div >
      <Footer />
    </>
  )
}

export default Login
