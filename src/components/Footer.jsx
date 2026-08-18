import React from 'react'
import ProductButtons from './ProductButtons'

const Footer = () => {
  return (
    <>
      <div className=" flex scroll bottom-0 left-0 right-0 p-25 bg-[#212121] justify-center mb-15">
        <div className='flex gap-5'>
          <div className='flex flex-col'>
            <div>
              <h1 className='text-gray-300 mb-1 text-sm font-light'>
                About
              </h1>
            </div>
            <div>
              <ul className='text-white text-sm'>
                <li className='hover:underline'>Contact US</li>
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
        </div>

      </div>
      {/* <ProductButtons /> */}
    </>
  )
}

export default Footer

