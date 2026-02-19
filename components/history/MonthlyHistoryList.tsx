import React from 'react';
import { MonthlyDRE } from '../../types';
import MonthlyHistoryCard from './MonthlyHistoryCard';

interface MonthlyHistoryListProps {
  dres: MonthlyDRE[];
  onEdit: (data: MonthlyDRE) => void;
  onDelete: (id: string) => void;
}

const MonthlyHistoryList: React.FC<MonthlyHistoryListProps> = ({ dres, onEdit, onDelete }) => {
  const sortedDREs = [...dres].sort((a, b) => b.monthYear.localeCompare(a.monthYear));

  if (sortedDREs.length === 0) {
    return <p className="text-[var(--brand-text-muted)] italic text-center py-8">Nenhum DRE mensal encontrado.</p>;
  }

  return (
    <div className="space-y-3"> {/* Reduzido space-y-4 para space-y-3 */}
      {sortedDREs.map((dre) => (
        <MonthlyHistoryCard
          key={dre.id}
          dre={dre}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default MonthlyHistoryList;