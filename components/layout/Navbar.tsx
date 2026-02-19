import React from 'react';
import { NAV_ITEMS } from '../../constants';
import { AppPage } from '../../types';

interface NavbarProps {
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[9999] w-full h-20 bg-black border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,1)] flex items-center justify-center">
      <ul className="flex justify-around items-center w-full max-w-lg h-full">
        {NAV_ITEMS.map((item) => (
          <li key={item.id} className="flex-1 text-center h-full">
            <button
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center w-full h-full text-xs font-medium
                          transition-all duration-200
                          ${currentPage === item.id 
                            ? 'text-[var(--brand-primary)] scale-110' 
                            : 'text-white/40 hover:text-white/70'}`}
            >
              <item.icon size={24} className="mb-0.5" /> {/* Reduzido mb-1.5 para mb-0.5 */}
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;