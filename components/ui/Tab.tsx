import React from 'react';

interface TabProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const Tab: React.FC<TabProps> = ({ label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`py-2 px-4 text-sm font-medium transition-colors duration-200
        ${isActive
          ? 'text-black bg-[var(--brand-primary)] rounded-md' // Tab ativa com fundo dourado, texto preto
          : 'text-[var(--brand-text-muted)] hover:text-[var(--brand-text-light)]' // Tab inativa mais sutil
        }`}
    >
      {label}
    </button>
  );
};

export default Tab;