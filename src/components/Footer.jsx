import React from 'react'
import { NavLink } from 'react-router-dom'
// import { img } from '@fortawesome/react-fontawesome'

// Images
import faFacebookF from "../assets/Footer images/Facebook.svg";
import faXTwitter from "../assets/Footer images/Twitter.svg";
import faYoutube from "../assets/Footer images/YoutubeLogo.svg";
import faInstagram from "../assets/Footer images/Instagram.svg";

import faStore from "../assets/Footer images/Become seller.svg";
import faBullhorn from "../assets/Footer images/Advetise.svg";
import faGift from "../assets/Footer images/Gift-card.svg";
import faCircleQuestion from "../assets/Footer images/Help-centre.svg";
import paymentMethods from '../assets/Footer images/payment-methods.svg'


const Footer = () => {
  return (
    <>
      <footer className="bottom-0 left-0 right-0 mb-15 bg-[#212121] px-6 pt-12 sm:px-8 lg:pt-16">
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
              <ul className='wrap-break-words text-sm text-white'>
                <li className='cursor-default'>Flipkart Internet Private Limited,</li>
                <li className='cursor-default'>Building Alyssa, Begonia &</li>
                <li className='cursor-default'>Clove Embassy Tech Village,</li>
                <li className='cursor-default'>Outer Ring Road, Devarabeesanahalli Village,</li>
                <li className='cursor-default'>Bengaluru, 560103,</li>
                <li className='cursor-default'>Karnataka, India</li>
              </ul>
            </div>

            {/* Social section */}
            <div className='mt-6'>
              <h1 className='text-gray-300 mb-2 text-sm font-light cursor-default'>
                Social:
              </h1>
              <div className='flex items-center gap-3'>
                <a href="#" aria-label="Facebook" className='flex size-7 items-center justify-center  text-white transition-colors hover:border-white'>
                  <img src={faFacebookF} size="xs" />
                </a>
                <a href="#" aria-label="X (Twitter)" className='flex size-7 items-center justify-center  text-white transition-colors hover:border-white'>
                  <img src={faXTwitter} size="xs" />
                </a>
                <a href="#" aria-label="YouTube" className='flex size-7 items-center justify-center  text-white transition-colors hover:border-white'>
                  <img src={faYoutube} size="xs" />
                </a>
                <a href="#" aria-label="Instagram" className='flex size-5 items-center justify-center  text-white transition-colors hover:border-white'>
                  <img src={faInstagram} size="xs" />
                </a>
              </div>
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
                <li className='cursor-default'>Telephone: <span className='text-blue-600 mb-1 text-sm cursor-pointer'>044-45614700</span> / <span className='text-blue-600 mb-1 text-sm cursor-pointer'>044-67415800</span></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className='mx-auto mt-10 flex w-full max-w-7xl flex-col gap-4 border-t border-gray-700 pt-5 pb-4 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white'>
            <span className='flex cursor-pointer items-center gap-2'>
              <img src={faStore} className='text-gray-300' />
              Become a Seller
            </span>
            <span className='flex cursor-pointer items-center gap-2'>
              <img src={faBullhorn} className='text-gray-300' />
              Advertise
            </span>
            <span className='flex cursor-pointer items-center gap-2'>
              <img src={faGift} className='text-gray-300' />
              Gift Cards
            </span>
            <span className='flex cursor-pointer items-center gap-2'>
              <img src={faCircleQuestion} className='text-gray-300' />
              Help Center
            </span>
          </div>

          <p className='text-sm text-gray-300'>© 2007-2026 Flipkart.com</p>

          {/* Payment method icons — placeholders, swap src with real logos */}
          {/* Payment method icons */}
          <div className='flex items-center'>
            <img
              src={paymentMethods}
              alt="Accepted payment methods: Visa, Mastercard, Maestro, Amex, Diners, Discover, RuPay, Net Banking, Cash on Delivery, EMI"
              className='h-4 sm:h-5 w-auto'
            />
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer
