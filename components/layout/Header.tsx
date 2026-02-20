import React, { useLayoutEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';

interface HeaderProps {
  companyName: string;
  logoUrl?: string | null;
  primaryColor: string;
}

const Header: React.FC<HeaderProps> = ({ companyName, logoUrl, primaryColor }) => {
  const headerRef = useRef<HTMLDivElement>(null);

  // Efeito para sincronizar a altura real do header com a variável CSS global
  useLayoutEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        const height = headerRef.current.offsetHeight;
        document.documentElement.style.setProperty('--header-height', `${height}px`);
      }
    };

    // Atualiza imediatamente e após o carregamento da imagem
    updateHeaderHeight();
    
    // Observer para capturar mudanças de tamanho (como carregamento de imagem lenta)
    const resizeObserver = new ResizeObserver(updateHeaderHeight);
    if (headerRef.current) resizeObserver.observe(headerRef.current);

    window.addEventListener('resize', updateHeaderHeight);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateHeaderHeight);
    };
  }, [logoUrl]);

  return (
    <header 
      ref={headerRef}
      className="sticky top-0 left-0 right-0 z-30 w-full min-h-[40px] py-3 bg-black/95 backdrop-blur-md flex items-center justify-center border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] transition-all duration-300"
    >
      <div className="flex items-center justify-center w-full max-w-4xl px-4 animate-in fade-in zoom-in duration-700">
        {logoUrl ? (
          <div className="logo-container max-w-[200px] flex justify-center drop-shadow-[0_0_15px_rgba(255,255,255,0.05)]">
            <img 
              src={logoUrl} 
              alt={`${companyName} Logo`} 
              className="max-h-20 w-auto object-contain transition-all duration-500 ease-out"
              onLoad={() => {
                // Força uma nova medição quando a imagem terminar de carregar
                if (headerRef.current) {
                   document.documentElement.style.setProperty('--header-height', `${headerRef.current.offsetHeight}px`);
                }
              }}
            />
          </div>
        ) : (
          <h1 className="text-2xl font-black text-[var(--brand-primary)] flex items-center tracking-tighter">
            <Sparkles size={24} style={{ color: primaryColor }} className="mr-2 animate-pulse" />
            {companyName || 'Educale Gestão'}
          </h1>
        )}
      </div>
    </header>
  );
};

export default Header;