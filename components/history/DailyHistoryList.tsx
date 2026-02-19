import React from 'react';
import { DailyRegister } from '../../types';
import DailyHistoryCard from './DailyHistoryCard';

interface DailyHistoryListProps {
  registers: DailyRegister[];
  onEdit: (data: DailyRegister) => void;
  onDelete: (id: string) => void;
}

const DailyHistoryList: React.FC<DailyHistoryListProps> = ({ registers, onEdit, onDelete }) => {
  const sortedRegisters = [...registers].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (sortedRegisters.length === 0) {
    return <p className="text-[var(--brand-text-muted)] italic text-center py-8">Nenhum registro diário encontrado.</p>;
  }

  return (
    <div className="space-y-3"> {/* Reduzido space-y-4 para space-y-3 */}
      {sortedRegisters.map((register) => (
        <DailyHistoryCard
          key={register.id}
          register={register}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default DailyHistoryList;