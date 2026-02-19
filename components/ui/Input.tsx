import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id: string;
  error?: string;
  value?: string | number | null; // Aceita null para inputs numéricos vazios
}

const Input: React.FC<InputProps> = ({ label, id, error, className = '', value, type, ...props }) => {
  // Ajuste para exibir string vazia se o valor for null ou undefined (especialmente para type="number")
  const displayValue = type === 'number' && (value === null || value === undefined) ? '' : value;

  return (
    <div className="flex flex-col w-full">
      {label && (
        <label htmlFor={id} className="mb-1 text-[var(--brand-text-light)] text-sm font-medium">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type} // Passa o tipo para o input
        value={displayValue} // Usa o valor ajustado para exibição
        // Estilos de inputs aprimorados para a estética desejada
        className={`bg-white/5 text-[var(--brand-text-light)] border border-white/10 rounded-lg px-4 py-3
          focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)]
          placeholder-[var(--brand-text-muted)] transition-all duration-200
          ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Input;