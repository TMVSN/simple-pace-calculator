import React from 'react';
import { Zap } from 'lucide-react'; // Using Zap as a placeholder logo

type NavSection = 'calculators' | 'plans' | 'tips' | 'blog' | 'about';

interface NavbarProps {
  onNavigate: (section: NavSection) => void;
  activeSection: NavSection;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, activeSection }) => {
  const navItems: { id: NavSection; label: string }[] = [
    { id: 'calculators', label: 'Pace Calculators' },
    { id: 'plans', label: 'Training Plans' },
    { id: 'tips', label: 'Training Tips' },
    { id: 'blog', label: 'Blog' },
    { id: 'about', label: 'About Us' },
  ];

  return (
    <nav className="bg-gray-900 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo and Name */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('calculators')}>
          <Zap className="w-6 h-6 text-purple-500" />
          <span className="text-xl font-bold">RunTools</span>
        </div>

        {/* Navigation Links */}
        <ul className="flex space-x-6">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onNavigate(item.id)}
                className={`text-sm font-medium pb-1 border-b-2 transition-colors duration-200 ease-in-out ${
                  activeSection === item.id
                    ? 'border-purple-500 text-white'
                    : 'border-transparent text-gray-400 hover:text-white hover:border-purple-400'
                }`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
