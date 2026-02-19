import React from 'react';
import { Sparkles } from 'lucide-react';

interface HeaderProps {
  companyName: string;
  logoUrl?: string | null; // This will be the processed logo URL
  primaryColor: string;
}

const Header: React.FC<HeaderProps> = ({ companyName, logoUrl, primaryColor }) => {
  return (
    <header className="sticky top-0 left-0 right-0 z-30 w-full h-[var(--header-height)] bg-black flex items-center justify-center border-b border-white/10 shadow-lg">
      <div className="flex items-center justify-center w-full max-w-4xl px-4">
        {logoUrl ? (
          // Display a larger, more prominent logo
          <div className="logo-container max-w-xs w-2/3 flex justify-center"> {/* Adicionado max-w-xs para controlar o tamanho */}
            <img src={logoUrl} alt={`${companyName} Logo`} className="max-h-16 h-auto object-contain" /> {/* Reduzido max-h-28 para max-h-16 */}
          </div>
        ) : (
          // Fallback to company name with primary-colored sparkle
          <h1 className="text-3xl font-bold text-[var(--brand-primary)] flex items-center">
            <Sparkles size={28} style={{ color: primaryColor }} className="mr-3" />
            {companyName || 'LojaGestão PRO'}
          </h1>
        )}
      </div>
    </header>
  );
};

export default Header;