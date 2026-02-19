import React from 'react';

interface ToggleSwitchProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ id, checked, onChange, label, disabled = false }) => {
  return (
    <div className="flex items-center space-x-2">
      <label htmlFor={id} className="relative inline-flex cursor-pointer items-center">
        <input
          type="checkbox"
          id={id}
          className="sr-only peer"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
        <div
          className={`w-11 h-6 rounded-full peer
            ${checked ? 'bg-[var(--brand-primary)]' : 'bg-[var(--brand-surface)]/50'}
            peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[var(--brand-primary)]/50
            peer-checked:after:translate-x-full peer-checked:after:border-white
            after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[var(--brand-surface)]/30 after:border after:rounded-full after:h-5 after:w-5 after:transition-all
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        ></div>
      </label>
      {label && (
        <label htmlFor={id} className={`text-[var(--brand-text-light)] cursor-pointer ${disabled ? 'opacity-50' : ''}`}>
          {label}
        </label>
      )}
    </div>
  );
};

export default ToggleSwitch;