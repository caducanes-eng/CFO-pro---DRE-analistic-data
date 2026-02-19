import React, { useState, useEffect } from 'react';
import { DailyRegister } from '../../types';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { v4 as uuidvv4 } from 'uuid';
import { formatCurrency } from '../../utils/formatters';

interface DailyEntryFormProps {
  initialData?: DailyRegister;
  onSave: (data: DailyRegister) => void;
  onCancel?: () => void;
}

const DailyEntryForm: React.FC<DailyEntryFormProps> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState<DailyRegister>(initialData || {
    id: uuidvv4(),
    date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    grossSales: null,
    cash: null,
    card: null,
    pix: null,
    discount: null,
    returns: null,
    customers: null,
    itemsSold: null,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type } = e.target;
    // For number inputs, parse to float or set to null if empty string
    setFormData(prev => ({
      ...prev,
      [id]: type === 'number' ? (value === '' ? null : parseFloat(value) || 0) : value,
    }));
    // Clear error for the field being edited
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
    if (!formData.date) newErrors.date = 'Data é obrigatória';
    if (formData.grossSales !== null && formData.grossSales < 0) newErrors.grossSales = 'Vendas Brutas não podem ser negativas';
    if (formData.customers !== null && formData.customers < 0) newErrors.customers = 'Clientes não podem ser negativos';
    if (formData.itemsSold !== null && formData.itemsSold < 0) newErrors.itemsSold = 'Itens Vendidos não podem ser negativos';
    // Add more validation rules as needed
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  const totalSales = (formData.cash || 0) + (formData.card || 0) + (formData.pix || 0);
  const discrepancy = (formData.grossSales || 0) - totalSales;

  return (
    <form onSubmit={handleSubmit} className="space-y-3"> {/* Reduzido space-y-4 para space-y-3 */}
      <Input
        id="date"
        label="Data"
        type="date"
        value={formData.date}
        onChange={handleChange}
        error={errors.date}
        required
      />
      <Input
        id="grossSales"
        label="Vendas Brutas (R$)"
        type="number"
        step="0.01"
        value={formData.grossSales}
        onChange={handleChange}
        error={errors.grossSales}
        required
      />
      <Input
        id="cash"
        label="Pagamento em Dinheiro (R$)"
        type="number"
        step="0.01"
        value={formData.cash}
        onChange={handleChange}
      />
      <Input
        id="card"
        label="Pagamento em Cartão (R$)"
        type="number"
        step="0.01"
        value={formData.card}
        onChange={handleChange}
      />
      <Input
        id="pix"
        label="Pagamento em PIX (R$)"
        type="number"
        step="0.01"
        value={formData.pix}
        onChange={handleChange}
      />

      {/* Discrepancy warning */}
      {Math.abs(discrepancy) > 0.01 && (formData.grossSales !== null || totalSales !== 0) && (
        <p className="text-sm text-yellow-500 bg-yellow-900/20 p-2 rounded-md">
          Atenção: Vendas Brutas (<span className="text-white/60">{formatCurrency(formData.grossSales)}</span>) não batem com a soma dos pagamentos (<span className="text-white/60">{formatCurrency(totalSales)}</span>). Discrepância: <span className="text-white/60">{formatCurrency(discrepancy)}</span>
        </p>
      )}

      <Input
        id="discount"
        label="Descontos Concedidos (R$)"
        type="number"
        step="0.01"
        value={formData.discount}
        onChange={handleChange}
      />
      <Input
        id="returns"
        label="Devoluções (R$)"
        type="number"
        step="0.01"
        value={formData.returns}
        onChange={handleChange}
      />
      <Input
        id="customers"
        label="Número de Clientes"
        type="number"
        step="1"
        value={formData.customers}
        onChange={handleChange}
        error={errors.customers}
      />
      <Input
        id="itemsSold"
        label="Itens Vendidos"
        type="number"
        step="1"
        value={formData.itemsSold}
        onChange={handleChange}
        error={errors.itemsSold}
      />

      <div className="flex justify-end space-x-2">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit">
          {initialData ? 'Atualizar Registro' : 'Adicionar Registro'}
        </Button>
      </div>
    </form>
  );
};

export default DailyEntryForm;