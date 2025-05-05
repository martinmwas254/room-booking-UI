import { useState } from 'react';
import { Mail, Twitter, Linkedin, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [year] = useState(new Date().getFullYear());
  
  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and tagline */}
          <div className="md:col-span-1">
            <h2 className="text-lg font-bold text-gray-900">Room Booking</h2>
            <p className="mt-2 text-sm text-gray-600">
              Simple and efficient room booking solution for your organization.
            </p>
          </div>
          
          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Navigation
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/" className="text-base text-gray-600 hover:text-gray-900">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/rooms" className="text-base text-gray-600 hover:text-gray-900">
                  Rooms
                </Link>
              </li>
              <li>
                <Link to="/bookings" className="text-base text-gray-600 hover:text-gray-900">
                  My Bookings
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Resources
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/faq" className="text-base text-gray-600 hover:text-gray-900">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-base text-gray-600 hover:text-gray-900">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-base text-gray-600 hover:text-gray-900">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Legal
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/privacy" className="text-base text-gray-600 hover:text-gray-900">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-base text-gray-600 hover:text-gray-900">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Social links and copyright */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-6 md:order-2">
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Mail</span>
                <Mail className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
            <p className="mt-8 md:mt-0 md:order-1 text-center md:text-left text-base text-gray-400 flex items-center justify-center">
              <span>&copy; {year} Room Booking. All rights reserved. </span>
              
              <Heart className="h-4 w-4 mx-1 text-red-500" />
            </p>
          </div>
        </div>
        
        {/* Newsletter subscription - optional */}
        <div className="mt-8 border-t border-gray-200 pt-8">
          {/* <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
            Subscribe to our newsletter
          </h3> */}
          {/* <p className="mt-2 text-base text-gray-600">
            Get the latest news and updates directly to your inbox.
          </p>
          <form className="mt-4 sm:flex sm:max-w-md">
            <label htmlFor="email-address" className="sr-only">
              Email address
            </label>
            <input
              type="email"
              name="email-address"
              id="email-address"
              autoComplete="email"
              required
              placeholder="Enter your email"
              className="w-full min-w-0 px-4 py-2 text-base text-gray-900 placeholder-gray-500 bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="mt-3 rounded-md sm:mt-0 sm:ml-3 sm:flex-shrink-0">
              <button
                type="submit"
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Subscribe
              </button>
            </div>
          </form> */}
        </div>
      </div>
      <p className='text-center bg-white'>Designed by <a href='https://vextech.netlify.app/' className='text-blue-600' target="_blank"> Vextech Solutions</a>.</p>
    </footer>
  );
};

export default Footer;