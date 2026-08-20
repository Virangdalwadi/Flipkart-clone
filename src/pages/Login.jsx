import React, { useState } from 'react';
import Loginimg from "../assets/Login Image/Login.png";
import Footer from '../components/Footer';
import Navbar3 from '../components/Navbar3';

const Login = () => {

  window.scrollTo(0, 0);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({ ...currentData, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!isLogin && formData.password !== formData.confirmPassword) {
      return;
    }

    console.log(isLogin ? 'Logging in with:' : 'Registering with:', formData);
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
                  required
                />
                <input
                  className='w-full border-b border-gray-300 px-1 py-2 outline-none focus:border-blue-600'
                  name='password'
                  value={formData.password}
                  onChange={handleChange}
                  placeholder='Enter Password'
                  type='password'
                  required
                />
                {!isLogin && (
                  <input
                    className='w-full border-b border-gray-300 px-1 py-2 outline-none focus:border-blue-600'
                    name='confirmPassword'
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder='Confirm Password'
                    type='password'
                    required
                  />
                )}
                <p className='mt-2 text-sm text-gray-500'>By continuing, you agree to Flipkart's <span className='text-blue-600 cursor-pointer'>Terms of Use</span> and <span className='text-blue-600 cursor-pointer'>Privacy Policy</span>.</p>

                <button type='submit' className='mt-1 w-full border-none bg-[#fb641b] py-3 text-white shadow-sm font-semibold'>
                  {isLogin ? 'Login' : 'Register'}
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
                  }}
                  className="text-blue-600 font-semibold hover: bg-transparent border-none cursor-pointer"
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
