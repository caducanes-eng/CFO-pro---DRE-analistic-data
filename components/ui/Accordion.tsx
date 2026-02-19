import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface AccordionProps {
  title: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

const Accordion: React.FC<AccordionProps> = ({ title, children, defaultOpen = false, className = '' }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`border border-white/10 rounded-xl overflow-hidden ${className}`}>
      <button
        className="flex items-center justify-between w-full p-4 bg-[var(--brand-surface)]/20 hover:bg-[var(--brand-surface)]/40 transition-colors duration-200 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="text-[var(--brand-text-light)] font-medium">{title}</span>
        {isOpen ? <ChevronUp size={20} className="text-[var(--brand-primary)]" /> : <ChevronDown size={20} className="text-[var(--brand-text-muted)]" />}
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="p-4 bg-[var(--brand-surface)] border-t border-white/10 text-[var(--brand-text-muted)]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accordion;