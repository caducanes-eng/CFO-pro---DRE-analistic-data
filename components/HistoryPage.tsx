import React, { useState } from 'react';
import Tab from './ui/Tab';
import DailyHistoryList from './history/DailyHistoryList';
import MonthlyHistoryList from './history/MonthlyHistoryList';
import { DailyRegister, MonthlyDRE } from '../types';

interface HistoryPageProps {
  dailyRegisters: DailyRegister[];
  monthlyDREs: MonthlyDRE[];
  onEditDailyRegister: (data: DailyRegister) => void;
  onDeleteDailyRegister: (id: string) => void;
  onEditMonthlyDRE: (data: MonthlyDRE) => void;
  onDeleteMonthlyDRE: (id: string) => void;
}

const HistoryPage: React.FC<HistoryPageProps> = ({
  dailyRegisters,
  monthlyDREs,
  onEditDailyRegister,
  onDeleteDailyRegister,
  onEditMonthlyDRE,
  onDeleteMonthlyDRE,
}) => {
  const [activeTab, setActiveTab] = useState<'daily' | 'monthly'>('daily');

  return (
    <div className="p-4 pb-4 space-y-6 animate-in fade-in duration-500"> {/* Reduzido space-y-8 para space-y-6 e pb-24 para pb-4 */}
      <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-2"> {/* Adicionado mb-2 */}
        HISTÓRICO & <span className="text-[var(--brand-primary)]">GESTÃO</span>
      </h1>

      <div className="bg-[var(--brand-surface)] border border-white/5 rounded-3xl p-5 shadow-2xl mb-4"> {/* Reduzido p-6 para p-5 e mb-6 para mb-4 */}
        <h2 className="text-sm font-black uppercase tracking-[0.15em] text-[var(--brand-primary)] mb-2">Resumo de Integridade</h2> {/* Reduzido mb-3 para mb-2 */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-xs text-[var(--brand-text-muted)] uppercase">Dias Registrados</p>
            <p className="text-xl font-bold text-[var(--brand-text-light)]">{dailyRegisters.length}<span className="text-[var(--brand-text-muted)]">/365</span></p>
          </div>
          <div>
            <p className="text-xs text-[var(--brand-text-muted)] uppercase">Meses de DRE</p>
            <p className="text-xl font-bold text-[var(--brand-text-light)]">{monthlyDREs.length}<span className="text-[var(--brand-text-muted)]">/12</span></p>
          </div>
        </div>
      </div>

      <div className="flex bg-[var(--brand-surface)] p-1 rounded-xl border border-white/5"> {/* Reduzido p-1.5 rounded-2xl para p-1 rounded-xl */}
        <button
          onClick={() => setActiveTab('daily')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${ /* Reduzido py-3 rounded-xl para py-2 rounded-lg */
            activeTab === 'daily' 
            ? 'bg-[var(--brand-primary)] text-black' 
            : 'text-white/40 hover:text-white/70'
          }`}
        >
          Registros Diários
        </button>
        <button
          onClick={() => setActiveTab('monthly')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${ /* Reduzido py-3 rounded-xl para py-2 rounded-lg */
            activeTab === 'monthly' 
            ? 'bg-[var(--brand-primary)] text-black' 
            : 'text-white/40 hover:text-white/70'
          }`}
        >
          DRE Mensal
        </button>
      </div>

      <div className="bg-[var(--brand-surface)] border border-white/5 rounded-3xl p-5 shadow-2xl"> {/* Reduzido p-6 para p-5 */}
        {activeTab === 'daily' ? (
          <DailyHistoryList
            registers={dailyRegisters}
            onEdit={onEditDailyRegister}
            onDelete={onDeleteDailyRegister}
          />
        ) : (
          <MonthlyHistoryList
            dres={monthlyDREs}
            onEdit={onEditMonthlyDRE}
            onDelete={onDeleteMonthlyDRE}
          />
        )}
      </div>
    </div>
  );
};

export default HistoryPage;