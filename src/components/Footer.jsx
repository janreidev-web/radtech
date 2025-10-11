import React from 'react';
import Icon from './Icon'; // Import the centralized Icon component

/**
 * A creative and mobile-friendly footer for a Radiotechnology application.
 * Matches the style of the Header component.
 */
function Footer() {
  const footerNav = [
    { name: 'About', href: '#' },
    { name: 'Contact Us', href: '#' },
  ];

  const legalNav = [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
  ];

  const socialLinks = [
    { name: 'Twitter', href: '#', icon: 'twitter' },
    { name: 'GitHub', href: '#', icon: 'github' },
    { name: 'LinkedIn', href: '#', icon: 'linkedin' },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 border-t border-gray-700/50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            {/* Logo and App Name */}
            <a href="#" className="flex items-center space-x-3">
              <Icon name="logo" className="h-10 w-10 text-teal-400" />
              <span className="text-2xl font-bold text-white tracking-wider">
                RadTech<span className="text-teal-400">3D</span>
              </span>
            </a>
            <p className="text-gray-400 text-base">
              Revolutionizing radiological positioning with immersive 3D models.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div>
              <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Navigation</h3>
              <ul role="list" className="mt-4 space-y-4">
                {footerNav.map((item) => (
                  <li key={item.name}>
                    <a href={item.href} className="text-base text-gray-400 hover:text-teal-400 transition-colors">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-0">
              <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Legal</h3>
              <ul role="list" className="mt-4 space-y-4">
                {legalNav.map((item) => (
                    <li key={item.name}>
                        <a href={item.href} className="text-base text-gray-400 hover:text-teal-400 transition-colors">{item.name}</a>
                    </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700/50 pt-8 flex flex-col sm:flex-row items-center justify-between">
          <div className="flex space-x-6">
            {socialLinks.map((item) => (
              <a key={item.name} href={item.href} className="text-gray-400 hover:text-teal-400 transition-colors">
                <span className="sr-only">{item.name}</span>
                <Icon name={item.icon} className="h-6 w-6" />
              </a>
            ))}
          </div>
          <p className="mt-8 text-base text-gray-400 sm:mt-0">
            &copy; {currentYear} RadTech3D, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;