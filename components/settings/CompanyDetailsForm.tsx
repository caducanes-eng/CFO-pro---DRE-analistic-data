import React, { useState, useEffect } from 'react';
import { CompanyInfo } from '../../types';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface CompanyDetailsFormProps {
  initialData: CompanyInfo;
  onSave: (data: CompanyInfo) => void;
}

const CompanyDetailsForm: React.FC<CompanyDetailsFormProps> = ({ initialData, onSave }) => {
  const [formData, setFormData] = useState<CompanyInfo>(initialData);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = 'Nome da Empresa é obrigatório';
    if (!formData.cnpj.trim()) newErrors.cnpj = 'CNPJ é obrigatório';
    // Basic CNPJ format validation (not full validation)
    if (formData.cnpj.trim() && !/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$|^\d{14}$/.test(formData.cnpj.trim().replace(/\D/g, ''))) newErrors.cnpj = 'CNPJ inválido';
    if (!formData.taxRegime.trim()) newErrors.taxRegime = 'Regime Tributário é obrigatório';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3"> {/* Reduzido space-y-4 para space-y-3 */}
      <Input
        id="name"
        label="Nome da Empresa"
        type="text"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        required
      />
      <Input
        id="cnpj"
        label="CNPJ"
        type="text"
        value={formData.cnpj}
        onChange={handleChange}
        error={errors.cnpj}
        placeholder="XX.XXX.XXX/XXXX-XX"
        required
      />
      <div>
        <label htmlFor="taxRegime" className="mb-1 text-[var(--brand-text-light)] text-sm font-medium block">
          Regime Tributário
        </label>
        <select
          id="taxRegime"
          value={formData.taxRegime}
          onChange={handleChange}
          // Estilos de select aprimorados
          className={`bg-white/5 text-[var(--brand-text-light)] border border-white/10 rounded-lg px-4 py-3 w-full
            focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)]
            transition-colors duration-200 ${errors.taxRegime ? 'border-red-500 focus:ring-red-500' : ''}`}
          required
        >
          <option value="">Selecione um regime</option>
          <option value="Simples Nacional">Simples Nacional</option>
          <option value="Lucro Presumido">Lucro Presumido</option>
          <option value="Lucro Real">Lucro Real</option>
        </select>
        {errors.taxRegime && <p className="mt-1 text-sm text-red-500">{errors.taxRegime}</p>}
      </div>
      <div className="flex justify-end">
        <Button type="submit">Salvar Dados</Button>
      </div>
    </form>
  );
};

export default CompanyDetailsForm;