import React, { useState } from 'react';
import { NavSection } from '../types';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  activeSection: NavSection;
  onSectionChange: (section: NavSection) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeSection, onSectionChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: { id: NavSection; label: string }[] = [
    { id: 'calculators', label: 'Calculators' },
    { id: 'plans', label: 'Training Plans' },
    { id: 'tips', label: 'Training Tips' },
    { id: 'blog', label: 'Blog' },
    { id: 'about', label: 'About' },
  ];

  const handleNavClick = (section: NavSection) => {
    onSectionChange(section);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-purple-700 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo and Desktop Navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold">Pace Calculator</span>
            </div>
            {/* Desktop Navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                    activeSection === item.id
                      ? 'border-white text-white'
                      : 'border-transparent text-purple-100 hover:border-purple-100 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-purple-100 hover:text-white hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-0 z-40 transform transition-transform duration-300 ease-in-out sm:hidden`}
      >
        {/* Backdrop */}
        <div
          className={`${
            isMobileMenuOpen ? 'opacity-50' : 'opacity-0'
          } fixed inset-0 bg-black transition-opacity duration-300 ease-in-out`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Slide-out menu */}
        <div className="relative flex flex-col w-64 h-full bg-purple-800 shadow-xl">
          <div className="px-4 pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div className="text-xl font-bold text-white">Pace Calculator</div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-md text-purple-100 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-6">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                    activeSection === item.id
                      ? 'bg-purple-900 text-white'
                      : 'text-purple-100 hover:bg-purple-700 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
