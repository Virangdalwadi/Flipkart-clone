import React from 'react'
import { NavLink } from 'react-router-dom'

const Footer = () => {
  return (
    <>
      <footer className="bottom-0 left-0 right-0 mb-15 bg-[#212121] px-6 py-12 sm:px-8 lg:py-16">
        <div className='mx-auto grid w-full max-w-7xl grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-8'>
          <div className='flex min-w-0 flex-col'>
            <div>
              <h1 className='text-gray-300 mb-1 text-sm font-light'>
                About
              </h1>
            </div>
            <div>
              <ul className='text-white text-sm'>
                <NavLink to="/">
                  <li className='hover:underline'>Contact US</li>
                </NavLink>
                <li className='hover:underline'>About Us</li>
                <li className='hover:underline'>Careers</li>
                <li className='hover:underline'>Flipkart Stories</li>
                <li className='hover:underline'>Press</li>
                <li className='hover:underline'>Corporate Information</li>

              </ul>
            </div>
          </div>

          <div className='flex min-w-0 flex-col'>
            <div>
              <h1 className='text-gray-300 mb-1 text-sm font-light'>
                GROUP COMPANIES
              </h1>
            </div>

            <div>
              <ul className='text-white text-sm'>
                <li className='hover:underline'>Myntra</li>
                <li className='hover:underline'>Cleartrip</li>
                <li className='hover:underline'>Shopsy</li>
              </ul>
            </div>
          </div>

          <div className='flex min-w-0 flex-col'>
            <div>
              <h1 className='text-gray-300 mb-1 text-sm font-light'>
                HELP
              </h1>
            </div>
            <div>
              <ul className='text-white text-sm'>
                <li className='hover:underline'>Payments</li>
                <li className='hover:underline'>Shipping</li>
                <li className='hover:underline'>Cancellation & Returns</li>
                <li className='hover:underline'>FAQ</li>
              </ul>
            </div>
          </div>

          <div className='flex min-w-0 flex-col'>
            <div>
              <h1 className='text-gray-300 mb-1 text-sm font-light'>
                CONSUMER POLICY
              </h1>
            </div>
            <div>
              <ul className='text-white text-sm'>
                <li className='hover:underline'>Cancellation & Returns</li>
                <li className='hover:underline'>Terms Of Use</li>
                <li className='hover:underline'>Security</li>
                <li className='hover:underline'>Privacy</li>
                <li className='hover:underline'>Sitemap</li>
                <li className='hover:underline'>Grievance Redressal</li>
                <li className='hover:underline'>EPR Compliance</li>
                <li className='hover:underline'>FSSAI Food Safety Connect App</li>
              </ul>
            </div>
          </div>

          <div className='flex min-w-0 flex-col border-l border-gray-600 pl-4 sm:col-span-2 sm:border-l-0 sm:pl-0 lg:col-span-1 lg:border-l lg:pl-6'>
            <div>
              <h1 className='text-gray-300 mb-1 text-sm font-light cursor-default'>
                Mail Us:
              </h1>
            </div>
            <div>
              <ul className='wrap-break-word text-sm text-white'>
                <li className='cursor-default'>Flipkart Internet Private Limited,</li>
                <li className='cursor-default'>Building Alyssa, Begonia &</li>
                <li className='cursor-default'>Clove Embassy Tech Village,</li>
                <li className='cursor-default'>Outer Ring Road, Devarabeesanahalli Village,</li>
                <li className='cursor-default'>Bengaluru, 560103,</li>
                <li className='cursor-default'>Karnataka, India</li>
              </ul>
            </div>
          </div>

          <div className='flex min-w-0 flex-col'>
            <div>
              <h1 className='text-gray-300 mb-1 text-sm font-light cursor-default'>
                Registered Office Address:
              </h1>
            </div>
            <div>
              <ul className='wrap-break-word text-sm text-white'>
                <li className='cursor-default'>Flipkart Internet Private Limited,</li>
                <li className='cursor-default'>Building Alyssa, Begonia &</li>
                <li className='cursor-default'>Clove Embassy Tech Village,</li>
                <li className='cursor-default'>Outer Ring Road, Devarabeesanahalli Village,</li>
                <li className='cursor-default'>Bengaluru, 560103,</li>
                <li className='cursor-default'>Karnataka, India</li>
                <li className='cursor-default'>CIN: U51109KA2012PTC066107</li>
                <li className='cursor-default'>Telephone: <span className='text-blue-600 mb-1 text-sm cursor-pointer'>044-45614709</span> / <span className='text-blue-600 mb-1 text-sm cursor-pointer'>  044-4571409</span></li>

              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer

