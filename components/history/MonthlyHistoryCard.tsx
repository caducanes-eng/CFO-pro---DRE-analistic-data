// components/history/MonthlyHistoryCard.tsx
import React, { useState } from 'react';
import { MonthlyDRE } from '../../types';
import Accordion from '../ui/Accordion';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import MonthlyEntryForm from '../dataentry/MonthlyEntryForm';
import { formatCurrency, formatPercent } from '../../utils/formatters';

interface MonthlyHistoryCardProps {
  dre: MonthlyDRE;
  onEdit: (data: MonthlyDRE) => void;
  onDelete: (id: string) => void;
}

const MonthlyHistoryCard: React.FC<MonthlyHistoryCardProps> = ({ dre, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const formattedMonthYear = new Date(dre.monthYear + '-01').toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="mb-2">
      <Accordion
        title={
          <div className="flex justify-between items-center w-full pr-2 text-xs">
            <span className="text-[var(--brand-text-light)]">{formattedMonthYear}</span>
            <span className="text-[var(--brand-primary)] font-bold">{formatCurrency(dre.parsedData.netRevenue || 0)}</span>
          </div>
        }
      >
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] text-[var(--brand-text-muted)]">
          {Object.entries(dre.parsedData).filter(([_, v]) => v !== null && typeof v === 'number').map(([key, value]) => {
            const isCurrency = ['grossRevenue', 'netRevenue', 'cmv', 'ebitda', 'netProfit', 'grossProfit'].includes(key);
            const isPercent = key.toLowerCase().includes('percent') || key === 'markup';
            
            const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();

            return (
              <p key={key} className="border-b border-white/5 py-1">
                <strong>{label}:</strong> {isCurrency ? formatCurrency(value as number) : isPercent ? formatPercent(value as number) : value}
              </p>
            );
          })}
        </div>
        <div className="flex justify-end gap-2 mt-3">
          <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)} className="text-[10px]">Editar</Button>
          <Button variant="danger" size="sm" onClick={() => setShowDeleteConfirm(true)} className="text-[10px]">Excluir</Button>
        </div>
      </Accordion>

      <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} title={`Editar DRE - ${formattedMonthYear}`}>
        <MonthlyEntryForm
          initialData={dre}
          onSave={(updatedData) => {
            onEdit(updatedData);
            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
        />
      </Modal>

      <Modal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} title="Confirmar Exclusão">
        <p className="text-[var(--brand-text-light)] text-sm mb-4">Excluir DRE de {formattedMonthYear}?</p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={() => setShowDeleteConfirm(false)}>Cancelar</Button>
          <Button variant="danger" size="sm" onClick={() => { onDelete(dre.id); setShowDeleteConfirm(false); }}>Excluir</Button>
        </div>
      </Modal>
    </div>
  );
};

export default MonthlyHistoryCard;