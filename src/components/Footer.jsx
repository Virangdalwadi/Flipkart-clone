import React from 'react'
import { NavLink } from 'react-router-dom'
// import { img } from '@fortawesome/react-fontawesome'

// Images
import faFacebookF from "../assets/images/Footer images/Facebook.svg";
import faXTwitter from "../assets/images/Footer images/Twitter.svg";
import faYoutube from "../assets/images/Footer images/YoutubeLogo.svg";
import faInstagram from "../assets/images/Footer images/Instagram.svg";

import faStore from "../assets/images/Footer images/Become seller.svg";
import faBullhorn from "../assets/images/Footer images/Advetise.svg";
import faGift from "../assets/images/Footer images/Gift-card.svg";
import faCircleQuestion from "../assets/images/Footer images/Help-centre.svg";
import paymentMethods from '../assets/images/Footer images/payment-methods.svg'


const Footer = () => {
  return (
    <>
      <footer className="bottom-0 left-0 right-0 bg-[#212121] px-6 pt-12 sm:px-8 lg:pt-12">
        <div className='mx-auto grid w-full max-w-8xl grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-1'>
          <div className='flex min-w-0 flex-col'>
            <div>
              <h1 className='text-gray-300 cursor-default mb-2 text-xs font-light'>
                ABOUT
              </h1>
            </div>
            <div>
              <ul className='text-white text-xs font-semibold'>
                <NavLink to="/">
                  <li className='hover:underline'>Contact US</li>
                </NavLink>
                <li className='hover:underline cursor-pointer
                '>About Us</li>
                <li className='hover:underline cursor-pointer
                '>Careers</li>
                <li className='hover:underline cursor-pointer
                '>Flipkart Stories</li>
                <li className='hover:underline cursor-pointer
                '>Press</li>
                <li className='hover:underline cursor-pointer
                '>Corporate Information</li>

              </ul>
            </div>
          </div>

          <div className='flex min-w-0 flex-col'>
            <div>
              <h1 className='text-gray-300 cursor-default mb-2 text-xs font-light'>
                GROUP COMPANIES
              </h1>
            </div>

            <div>
              <ul className='text-white text-xs font-semibold'>
                <li className='hover:underline cursor-pointer'>Myntra</li>
                <li className='hover:underline cursor-pointer'>Cleartrip</li>
                <li className='hover:underline cursor-pointer'>Shopsy</li>
              </ul>
            </div>
          </div>

          <div className='flex min-w-0 flex-col'>
            <div>
              <h1 className='text-gray-300 mb-1 cursor-default text-xs font-light'>
                HELP
              </h1>
            </div>
            <div>
              <ul className='text-white text-xs font-semibold'>
                <li className='hover:underline cursor-pointer'>Payments</li>
                <li className='hover:underline cursor-pointer'>Shipping</li>
                <li className='hover:underline cursor-pointer'>Cancellation & Returns</li>
                <li className='hover:underline cursor-pointer'>FAQ</li>
              </ul>
            </div>
          </div>

          <div className='flex min-w-0 flex-col'>
            <div>
              <h1 className='text-gray-300 mb-2 cursor-default text-xs font-light'>
                CONSUMER POLICY
              </h1>
            </div>
            <div>
              <ul className='text-white text-xs font-semibold'>
                <li className='hover:underline cursor-pointer'>Cancellation & Returns</li>
                <li className='hover:underline cursor-pointer'>Terms Of Use</li>
                <li className='hover:underline cursor-pointer'>Security</li>
                <li className='hover:underline cursor-pointer'>Privacy</li>
                <li className='hover:underline cursor-pointer'>Sitemap</li>
                <li className='hover:underline cursor-pointer'>Grievance Redressal</li>
                <li className='hover:underline cursor-pointer'>EPR Compliance</li>
                <li className='hover:underline cursor-pointer'>FSSAI Food Safety Connect App</li>
              </ul>
            </div>
          </div>

          <div className='flex min-w-0 flex-col border-l border-gray-600 pl-4 sm:col-span-2 sm:border-l-0 sm:pl-0 lg:col-span-1 lg:border-l lg:pl-6'>
            <div>
              <h1 className='text-gray-300 mb-2 text-xs font-light cursor-default'>
                Mail Us:
              </h1>
            </div>
            <div>
              <ul className='wrap-break-words text-xs font-semibold text-white'>
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
                  <img width="25" height="24" src={faFacebookF} size="xs" alt="Facebook logo" />
                </a>
                <a href="#" aria-label="X (Twitter)" className='flex size-7 items-center justify-center  text-white transition-colors hover:border-white'>
                  <img width="24" height="24" src={faXTwitter} size="xs" alt="Twitter X Logo" />
                </a>
                <a href="#" aria-label="YouTube" className='flex size-7 items-center justify-center  text-white transition-colors hover:border-white'>
                  <img width="25" height="24" src={faYoutube} size="xs" alt="Youtube Logo" />
                </a>
                <a href="#" aria-label="Instagram" className='flex size-5 items-center justify-center  text-white transition-colors hover:border-white'>
                  <img width="24" height="24" src={faInstagram} size="xs" alt="Instagram Logo" />
                </a>
              </div>
            </div>
          </div>

          <div className='flex min-w-0 flex-col'>
            <div>
              <h1 className='text-gray-300 mb-2 text-xs font-light cursor-default'>
                Registered Office Address:
              </h1>
            </div>
            <div>
              <ul className='wrap-break-word text-xs font-semibold text-white'>
                <li className='cursor-default'>Flipkart Internet Private Limited,</li>
                <li className='cursor-default'>Building Alyssa, Begonia &</li>
                <li className='cursor-default'>Clove Embassy Tech Village,</li>
                <li className='cursor-default'>Outer Ring Road, Devarabeesanahalli Village,</li>
                <li className='cursor-default'>Bengaluru, 560103,</li>
                <li className='cursor-default'>Karnataka, India</li>
                <li className='cursor-default'>CIN: U51109KA2012PTC066107</li>
                <li className='cursor-default'>Telephone: <span className='text-blue-600 mb-1 text-xs cursor-pointer'>044-45614700</span> / <span className='text-blue-600 mb-1 text-sm cursor-pointer'>044-67415800</span></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className='w-full mt-3 border-t border-gray-700 '></div>
        <div className='mx-auto mt-3 flex w-full max-w-7xl flex-col gap-4 pt-5 pb-4 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex flex-wrap items-center gap-x-20 gap-y-2 text-xs text-white'>
            <span className='flex cursor-pointer items-center gap-2'>
              <img width="16" height="16" src={faStore} className='text-gray-300' alt="Store" />
              Become a Seller
            </span>
            <span className='flex cursor-pointer items-center gap-2'>
              <img width="17" height="16" src={faBullhorn} className='text-gray-300' alt="Advertise" />
              Advertise
            </span>
            <span className='flex cursor-pointer items-center gap-2'>
              <img width="17" height="16" src={faGift} className='text-gray-300' alt="Gift" />
              Gift Cards
            </span>
            <span className='flex cursor-pointer items-center gap-2'>
              <img width="17" height="16" src={faCircleQuestion} className='text-gray-300' alt="Help" />
              Help Center
            </span>
          </div>

          <p className='text-sm text-gray-300'>© 2007-2026 Flipkart.com</p>

          {/* Payment method icons — placeholders, swap src with real logos */}
          {/* Payment method icons */}
          <div className='flex items-center'>
            <img
              width="377"
              height="18"
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
