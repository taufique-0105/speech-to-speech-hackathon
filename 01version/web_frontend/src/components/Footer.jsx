import { FaGithub, FaTwitter, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { MdLocationOn, MdPhone } from 'react-icons/md';

const Footer = () => {
  return (
    <footer className="w-full bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">OdishaVox</h3>
            <p className="text-sm text-gray-600">
              Empowering voice technology for Odia language and beyond.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-indigo-600 transition">
                <FaGithub className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-indigo-600 transition">
                <FaTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-indigo-600 transition">
                <FaLinkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-indigo-600 transition">Home</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition">Text to Speech</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition">Speech to Text</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition">Feedback</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Contact Us</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-start space-x-2">
                <MdLocationOn className="w-5 h-5 mt-0.5 text-indigo-600" />
                <span>Bhubaneswar, Odisha, India</span>
              </div>
              <div className="flex items-center space-x-2">
                <MdPhone className="w-5 h-5 text-indigo-600" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaEnvelope className="w-5 h-5 text-indigo-600" />
                <span>contact@odishavox.com</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Newsletter</h3>
            <p className="text-sm text-gray-600">
              Subscribe to get updates on new features.
            </p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="px-4 py-2 w-full rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-r-lg transition">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-gray-500">
            © 2025 OdishaVox App. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-xs text-gray-500 hover:text-indigo-600 transition">Privacy Policy</a>
            <a href="#" className="text-xs text-gray-500 hover:text-indigo-600 transition">Terms of Service</a>
            <a href="#" className="text-xs text-gray-500 hover:text-indigo-600 transition">Cookies</a>
          </div>
          <p className="text-xs text-gray-500 mt-4 md:mt-0">Version 1.0.0</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;