import React, { useState } from 'react';
import { DailyRegister } from '../../types';
import Accordion from '../ui/Accordion';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import DailyEntryForm from '../dataentry/DailyEntryForm';
import { formatCurrency } from '../../utils/formatters';

interface DailyHistoryCardProps {
  register: DailyRegister;
  onEdit: (data: DailyRegister) => void;
  onDelete: (id: string) => void;
}

const DailyHistoryCard: React.FC<DailyHistoryCardProps> = ({ register, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const formattedDate = new Date(register.date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <div className="mb-4">
      <Accordion
        title={
          <div className="flex justify-between items-center w-full pr-2 text-sm">
            <span className="text-[var(--brand-text-light)]">Dia: {formattedDate}</span>
            <span className="text-[var(--brand-primary)] font-bold">{formatCurrency(register.grossSales)}</span>
          </div>
        }
      >
        <div className="space-y-2 text-xs text-[var(--brand-text-muted)]">
          <p><strong>Vendas Brutas:</strong> {formatCurrency(register.grossSales)}</p>
          <p><strong>Dinheiro:</strong> {formatCurrency(register.cash)}</p>
          <p><strong>Cartão:</strong> {formatCurrency(register.card)}</p>
          <p><strong>PIX:</strong> {formatCurrency(register.pix)}</p>
          <p><strong>Descontos:</strong> {formatCurrency(register.discount)}</p>
          <p><strong>Devoluções:</strong> {formatCurrency(register.returns)}</p>
          <p><strong>Clientes:</strong> {register.customers}</p>
          <p><strong>Itens Vendidos:</strong> {register.itemsSold}</p>
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
            Editar
          </Button>
          <Button variant="danger" size="sm" onClick={() => setShowDeleteConfirm(true)}>
            Excluir
          </Button>
        </div>
      </Accordion>

      <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} title={`Editar Registro Diário (${formattedDate})`}>
        <DailyEntryForm
          initialData={register}
          onSave={(updatedData) => {
            onEdit(updatedData);
            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
        />
      </Modal>

      <Modal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} title="Confirmar Exclusão">
        <p className="text-[var(--brand-text-light)] mb-4">Tem certeza que deseja excluir o registro do dia <strong>{formattedDate}</strong>?</p>
        <div className="flex justify-end space-x-2">
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={() => { onDelete(register.id); setShowDeleteConfirm(false); }}>
            Excluir
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default DailyHistoryCard;