// components/DataEntryPage.tsx
import React, { useState } from 'react';
import DailyEntryForm from './dataentry/DailyEntryForm';
import MonthlyEntryForm from './dataentry/MonthlyEntryForm';
import { DailyRegister, MonthlyDRE } from '../types';
import { CheckCircle2, Database, Zap } from 'lucide-react';

interface DataEntryPageProps {
  onAddDailyRegister: (data: DailyRegister) => void;
  onAddMonthlyDRE: (data: MonthlyDRE) => void;
}

const DataEntryPage: React.FC<DataEntryPageProps> = ({ onAddDailyRegister, onAddMonthlyDRE }) => {
  const [activeTab, setActiveTab] = useState<'daily' | 'monthly'>('monthly'); // Monthly como default para destaque
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSaveSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="px-3 space-y-2">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-lg font-black tracking-tighter uppercase leading-none">
            CENTRAL <span className="text-[var(--brand-primary)]">ANALYTICS</span>
          </h1>
          <p className="text-[8px] text-[var(--brand-text-muted)] font-bold uppercase tracking-widest">
            Entrada de Dados Estratégicos
          </p>
        </div>
        {showSuccess && (
          <div className="flex items-center gap-1 text-green-400 bg-green-400/10 px-2 py-0.5 rounded border border-green-400/20 animate-in fade-in zoom-in">
            <CheckCircle2 size={10} />
            <span className="text-[7px] font-black uppercase">Sincronizado</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-1 bg-white/5 p-0.5 rounded-md border border-white/10">
        <button
          onClick={() => setActiveTab('daily')}
          className={`flex items-center justify-center gap-2 py-1.5 rounded text-[9px] font-black uppercase transition-all ${
            activeTab === 'daily' ? 'bg-[var(--brand-primary)] text-black' : 'text-white/20 hover:text-white/40'
          }`}
        >
          <Zap size={10} /> Vendas Diárias
        </button>
        <button
          onClick={() => setActiveTab('monthly')}
          className={`flex items-center justify-center gap-2 py-1.5 rounded text-[9px] font-black uppercase transition-all ${
            activeTab === 'monthly' ? 'bg-[var(--brand-primary)] text-black' : 'text-white/20 hover:text-white/40'
          }`}
        >
          <Database size={10} /> Smart DRE
        </button>
      </div>

      <div className="bg-[#0D0D0F] border border-white/5 rounded-lg p-2.5 shadow-2xl relative overflow-hidden">
        {activeTab === 'daily' ? (
          <DailyEntryForm onSave={(data) => { onAddDailyRegister(data); handleSaveSuccess(); }} />
        ) : (
          <MonthlyEntryForm onSave={(data) => { onAddMonthlyDRE(data); handleSaveSuccess(); }} />
        )}
      </div>
    </div>
  );
};

export default DataEntryPage;