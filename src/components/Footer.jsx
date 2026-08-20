import React from 'react'
import ProductButtons from './ProductButtons'
import { NavLink } from 'react-router-dom'

const Footer = () => {
  return (
    <>
      <div className=" flex scroll bottom-0 left-0 right-0 py-17 px-7 bg-[#212121] justify-center mb-15">
        <div className='flex gap-9'>
          <div className='flex flex-col'>
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

          <div className='flex flex-col'>
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

          <div className='flex flex-col'>
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

          <div className='flex flex-col'>
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

          <hr className="border-t3 border-gray-300 my-6" />

          <div className='flex flex-col'>
            <div>
              <h1 className='text-gray-300 mb-1 text-sm font-light cursor-default'>
                Mail Us:
              </h1>
            </div>
            <div>
              <ul className='text-white text-sm'>
                <li className='cursor-default'>Flipkart Internet Private Limited,</li>
                <li className='cursor-default'>Building Alyssa, Begonia &</li>
                <li className='cursor-default'>Clove Embassy Tech Village,</li>
                <li className='cursor-default'>Outer Ring Road, Devarabeesanahalli Village,</li>
                <li className='cursor-default'>Bengaluru, 560103,</li>
                <li className='cursor-default'>Karnataka, India</li>
              </ul>
            </div>
          </div>

          <div className='flex flex-col'>
            <div>
              <h1 className='text-gray-300 mb-1 text-sm font-light cursor-default'>
                Registered Office Address:
              </h1>
            </div>
            <div>
              <ul className='text-white text-sm'>
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
      </div>

      {/* <ProductButtons /> */}
    </>
  )
}

export default Footer

