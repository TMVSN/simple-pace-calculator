import React from 'react';
import { NavSection } from '../types';

interface NavbarProps {
  activeSection: NavSection;
  onSectionChange: (section: NavSection) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeSection, onSectionChange }) => {
  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-600">Pace Calculator</span>
        </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <button
                onClick={() => onSectionChange('calculators')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  activeSection === 'calculators'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Calculators
              </button>
              <button
                onClick={() => onSectionChange('plans')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  activeSection === 'plans'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Training Plans
              </button>
              <button
                onClick={() => onSectionChange('tips')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  activeSection === 'tips'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Tips
              </button>
              <button
                onClick={() => onSectionChange('blog')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  activeSection === 'blog'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Blog
              </button>
              <button
                onClick={() => onSectionChange('about')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  activeSection === 'about'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                About
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
