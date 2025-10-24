import React, { useState, useEffect } from 'react';
import Icon from './Icon';

function Header({ onNavClick, currentPage }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'Model Viewer', id: 'model' },
    { name: 'About', id: 'about' } // You can handle this later
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled || isMenuOpen
          ? 'bg-gray-900/95 backdrop-blur-sm shadow-xl'
          : 'bg-gray-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Icon name="logo" className="h-10 w-10 text-teal-400" />
            <span className="text-2xl font-bold text-white tracking-wider">
              RadTech<span className="text-teal-400">3D</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onNavClick(link.id)}
                  className={`transition-colors duration-300 text-sm font-medium relative group ${
                    isActive
                      ? 'text-teal-400 underline underline-offset-2 decoration-2 decoration-teal-400'
                      : 'text-gray-300 hover:text-teal-400'
                  }`}
                >
                  {link.name}
                  {!isActive && (
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal-400 transition-all duration-300 group-hover:w-full"></span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <Icon name="x" className="h-6 w-6" />
              ) : (
                <Icon name="menu" className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden transition-all duration-500 ease-in-out ${
          isMenuOpen ? 'max-h-96 opacity-100 visible' : 'max-h-0 opacity-0 invisible'
        } overflow-hidden`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-900">
          {navLinks.map((link) => {
            const isActive = currentPage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  onNavClick(link.id);
                  setIsMenuOpen(false);
                }}
                className={`w-full text-left block px-3 py-3 rounded-md text-base font-medium transition-colors ${
                  isActive
                    ? 'text-teal-400 bg-gray-700 border'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {link.name}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}

export default Header;
