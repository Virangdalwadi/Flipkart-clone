import React, { useState, useEffect } from 'react';
import Loginimg from "../assets/Login Image/Login.png";
import Footer from '../components/Footer';
import Navbar3 from '../components/Navbar3';
import logo from "../assets/Login Image/flipkart-logo.svg"
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
      {/* Desktop Navbar - unchanged on desktop */}
      <div className="hidden md:block">
        <Navbar3 />
      </div>

      {/* ================= MOBILE HEADER ================= */}
      <div className="fixed left-0 right-0 top-0 z-50 flex h-21.75 items-center justify-center bg-[#2874f0] md:hidden">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[34px] font-light leading-none text-white"
          aria-label="Close"
        >
          ×
        </button>

        {/* Flipkart Logo */}
        <img
          src={logo}
          alt="Flipkart"
          className="h-8 w-auto"
        />
      </div>

      {/* ================= MAIN CONTAINER ================= */}
      <div className="min-h-screen bg-gray-200 md:flex md:h-[93vh] md:items-center md:justify-center">

        {/* ================= DESKTOP CARD ================= */}
        <div className="mt-14 hidden h-138 w-211.5 bg-white md:flex">

          {/* Left side - DESKTOP ONLY */}
          <div className="flex w-[40%] flex-col justify-between bg-[#2874f0] px-8 py-9">
            <div className="flex flex-col">
              <h1 className="font-inter-stack text-[28px] text-white">
                {isLogin ? 'Login' : `Looks like you're new here!`}
              </h1>

              <h2 className="mt-4 text-[18px] text-[#DBDBDB]">
                {isLogin
                  ? 'Get access to your Orders, Wishlist and Recommendations'
                  : 'Sign up with your email id to get started'}
              </h2>
            </div>

            <img src={Loginimg} alt="Login" />
          </div>

          {/* Right side - DESKTOP */}
          <div className="flex w-[60%] flex-col justify-between px-8.75 pb-4 pt-14">

            <div className="flex flex-col">

              <form
                className="flex flex-col gap-5"
                onSubmit={handleSubmit}
              >

                {!isLogin && (
                  <input
                    className="w-full border-b border-gray-300 px-1 py-2 outline-none focus:border-blue-600"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter Name"
                    autoComplete="username"
                    required
                  />
                )}

                <input
                  className="w-full border-b border-gray-300 px-1 py-2 outline-none focus:border-blue-600"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter Email"
                  type="email"
                  autoComplete="email"
                  required
                />

                <div className="flex items-center border-b border-gray-300 focus-within:border-blue-600">
                  <input
                    className="w-full px-1 py-2 outline-none"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter Password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                    minLength={isLogin ? undefined : 8}
                    maxLength={isLogin ? undefined : 128}
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    className="px-2 py-2 text-gray-500 hover:text-gray-800"
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                  >
                    <FontAwesomeIcon
                      icon={showPassword ? faEyeSlash : faEye}
                    />
                  </button>
                </div>

                {!isLogin && (
                  <div className="flex items-center border-b border-gray-300 focus-within:border-blue-600">
                    <input
                      className="w-full px-1 py-2 outline-none"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm Password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword((visible) => !visible)
                      }
                      className="px-2 py-2 text-gray-500 hover:text-gray-800"
                      aria-label={
                        showConfirmPassword
                          ? 'Hide confirmation password'
                          : 'Show confirmation password'
                      }
                    >
                      <FontAwesomeIcon
                        icon={
                          showConfirmPassword
                            ? faEyeSlash
                            : faEye
                        }
                      />
                    </button>
                  </div>
                )}

                {error && (
                  <p className="text-sm text-red-600">
                    {error}
                  </p>
                )}

                <p className="mt-2 text-sm text-gray-500">
                  By continuing, you agree to Flipkart's{' '}
                  <span className="cursor-pointer text-blue-600">
                    Terms of Use
                  </span>{' '}
                  and{' '}
                  <span className="cursor-pointer text-blue-600">
                    Privacy Policy
                  </span>
                  .
                </p>

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-1 w-full cursor-pointer border-none bg-[#fb641b] py-3 font-semibold text-white shadow-sm disabled:opacity-60"
                >
                  {submitting
                    ? 'Please wait...'
                    : isLogin
                      ? 'Login'
                      : 'Register'}
                </button>
              </form>
            </div>

            <div>
              <div className="mt-6 text-center text-sm text-gray-600">
                {isLogin
                  ? "Don't have an account? "
                  : "Already have an account? "}

                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setFormData({
                      name: '',
                      email: '',
                      password: '',
                      confirmPassword: '',
                    });
                    setError('');
                  }}
                  className="cursor-pointer border-none bg-transparent font-semibold text-blue-600"
                >
                  {isLogin ? 'Register here' : 'Login here'}
                </button>
              </div>
            </div>

          </div>
        </div>


        {/* =====================================================
          MOBILE LOGIN / REGISTER
          ===================================================== */}
        <div className="flex min-h-screen w-full flex-col bg-white pt-21.75 md:hidden">

          {/* White content area */}
          <div className="flex flex-1 flex-col overflow-y-auto rounded-t-2xl px-6 pb-26.25 pt-5">

            <h1 className="text-[21px] font-semibold text-[#212121]">
              {isLogin
                ? 'Log in for the best experience'
                : "Looks like you're new here!"}
            </h1>

            <p className="mt-2 text-[16px] text-gray-500">
              {isLogin
                ? 'Enter your email to continue'
                : 'Sign up with your email id to get started'}
            </p>


            {/* Mobile Form */}
            <form
              id="mobile-auth-form"
              className="mt-7 flex flex-col gap-5"
              onSubmit={handleSubmit}
            >

              {/* NAME - REGISTER ONLY */}
              {!isLogin && (
                <div className="relative">
                  <input
                    className="peer w-full border-b border-gray-300 bg-transparent px-0 py-3 text-[16px] outline-none focus:border-[#2874f0]"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Name"
                    autoComplete="username"
                    required
                  />

                </div>
              )}


              {/* EMAIL */}
              <div className="relative">
                <input
                  className="peer w-full border-b border-gray-300 bg-transparent px-0 py-3 text-[16px] outline-none focus:border-[#2874f0]"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  type="email"
                  autoComplete="email"
                  required
                />
              </div>


              {/* PASSWORD */}
              <div className="relative">
                <div className="flex border-b border-gray-300 focus-within:border-[#2874f0]">
                  <input
                    className="peer w-full bg-transparent px-0 py-3 text-[16px] outline-none"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={
                      isLogin ? 'current-password' : 'new-password'
                    }
                    minLength={isLogin ? undefined : 8}
                    maxLength={isLogin ? undefined : 128}
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((visible) => !visible)
                    }
                    className="px-1 text-gray-500"
                    aria-label={
                      showPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                  >
                    <FontAwesomeIcon
                      icon={
                        showPassword
                          ? faEyeSlash
                          : faEye
                      }
                    />
                  </button>
                </div>


              </div>


              {/* CONFIRM PASSWORD - REGISTER ONLY */}
              {!isLogin && (
                <div className="relative">
                  <div className="flex border-b border-gray-300 focus-within:border-[#2874f0]">
                    <input
                      className="peer w-full bg-transparent px-0 py-3 text-[16px] outline-none"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm Password"
                      type={
                        showConfirmPassword
                          ? 'text'
                          : 'password'
                      }
                      autoComplete="new-password"
                      required
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          (visible) => !visible
                        )
                      }
                      className="px-1 text-gray-500"
                      aria-label={
                        showConfirmPassword
                          ? 'Hide confirmation password'
                          : 'Show confirmation password'
                      }
                    >
                      <FontAwesomeIcon
                        icon={
                          showConfirmPassword
                            ? faEyeSlash
                            : faEye
                        }
                      />
                    </button>
                  </div>


                </div>
              )}


              {/* ERROR */}
              {error && (
                <p className="text-sm text-red-600">
                  {error}
                </p>
              )}


              {/* TERMS */}
              <p className="mt-2 text-[13px] leading-4.5 text-gray-500">
                By continuing, you agree to Flipkart's{' '}
                <span className="cursor-pointer text-[#2874f0]">
                  Terms of Use
                </span>{' '}
                and{' '}
                <span className="cursor-pointer text-[#2874f0]">
                  Privacy Policy
                </span>
                .
              </p>


              {/* LOGIN / REGISTER SWITCH */}
              <div className="mt-4 text-center text-[14px] text-gray-600">
                {isLogin
                  ? "Don't have an account? "
                  : "Already have an account? "}

                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setFormData({
                      name: '',
                      email: '',
                      password: '',
                      confirmPassword: '',
                    });
                    setError('');
                  }}
                  className="border-none bg-transparent font-semibold text-[#2874f0]"
                >
                  {isLogin ? 'Register here' : 'Login here'}
                </button>
              </div>

            </form>
          </div>

          {/* =================================================
            MOBILE BOTTOM BUTTON
            ================================================= */}
          <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-300 bg-white px-3 py-3">
            <button
              type="button"
              disabled={submitting}
              onClick={() => {
                document
                  .getElementById("mobile-auth-form")
                  ?.requestSubmit();
              }}
              className="mt-1 w-full cursor-pointer border-none bg-[#fb641b] py-3 font-semibold text-white shadow-sm disabled:opacity-60"
            >
              {submitting
                ? "Please wait..."
                : isLogin
                  ? "Login"
                  : "Register"}
            </button>
          </div>

        </div>
      </div>

      {/* Desktop Footer only */}
      <div className="hidden md:block">
        <Footer />
      </div>
    </>
  );
}

export default Login
