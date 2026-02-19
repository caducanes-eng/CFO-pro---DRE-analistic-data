import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, className = '' }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-lg p-4"
      onClick={(e) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
          onClose();
        }
      }}
    >
      <div
        ref={modalRef}
        // Ajuste de estilos para o modal
        className={`bg-[var(--brand-surface)] border border-white/10 rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto
          w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl
          flex flex-col animate-fade-in-up ${className}`}
      >
        <div className="flex justify-between items-center p-4 border-b border-white/10">
          <h2 className="text-xl font-bold text-[var(--brand-primary)]">{title}</h2>
          <button
            onClick={onClose}
            className="text-[var(--brand-text-muted)] hover:text-[var(--brand-primary)] transition-colors duration-200"
            aria-label="Fechar modal"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-4 flex-grow text-[var(--brand-text-light)]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;