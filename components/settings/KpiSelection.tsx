import React, { useState, useEffect, useMemo } from 'react';
import { KPI } from '../../types';
import ToggleSwitch from '../ui/ToggleSwitch';
import Button from '../ui/Button';

interface KpiSelectionProps {
  allKpis: KPI[];
  onSave: (selectedKpiIds: string[]) => void;
}

const KpiSelection: React.FC<KpiSelectionProps> = ({ allKpis, onSave }) => {
  const [currentSelections, setCurrentSelections] = useState<{ [id: string]: boolean }>(() => {
    return allKpis.reduce((acc, kpi) => ({ ...acc, [kpi.id]: kpi.selected }), {});
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCurrentSelections(allKpis.reduce((acc, kpi) => ({ ...acc, [kpi.id]: kpi.selected }), {}));
  }, [allKpis]);

  // Agrupa os KPIs por categoria para facilitar a seleção estratégica
  const groupedKpis = useMemo(() => {
    return allKpis.reduce((acc, kpi) => {
      const category = kpi.category || 'Geral';
      if (!acc[category]) acc[category] = [];
      acc[category].push(kpi);
      return acc;
    }, {} as { [key: string]: KPI[] });
  }, [allKpis]);

  const handleToggle = (id: string, checked: boolean) => {
    setCurrentSelections(prev => ({ ...prev, [id]: checked }));
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedIds = Object.keys(currentSelections).filter(id => currentSelections[id]);
    
    if (selectedIds.length < 5) {
      setError('A Educale recomenda no mínimo 5 KPIs para uma gestão segura.');
      return;
    }
    
    onSave(selectedIds);
    setError('Configurações salvas com sucesso!');
    setTimeout(() => setError(null), 3000);
  };

  const selectedCount = Object.values(currentSelections).filter(Boolean).length;

  return (
    <form onSubmit={handleSubmit} className="space-y-6"> {/* Reduzido space-y-8 para space-y-6 */}
      <div className="border-b border-white/10 pb-3"> {/* Reduzido pb-4 para pb-3 */}
        <p className="text-[var(--brand-text-light)] text-sm">
          Selecione as métricas que compõem sua Central de Comando.
        </p>
      </div>

      {error && (
        <div className={`p-4 rounded-lg text-xs font-bold uppercase tracking-wider animate-in fade-in ${
          error.includes("salvas") 
          ? "bg-green-500/10 text-green-400 border border-green-500/20" 
          : "bg-red-500/10 text-red-400 border border-red-500/20"
        }`}>
          {error}
        </div>
      )}

      <div className="space-y-6"> {/* Reduzido space-y-10 para space-y-6 */}
        {/* Explicitly cast Object.entries result to help TypeScript */}
        {(Object.entries(groupedKpis) as [string, KPI[]][]).map(([category, kpis]) => (
          <div key={category} className="space-y-3"> {/* Reduzido space-y-4 para space-y-3 */}
            {/* Título da Categoria em Dourado */}
            <h4 className="text-[var(--brand-primary)] text-xs font-black uppercase tracking-[0.2em] border-l-2 border-[var(--brand-primary)] pl-3">
              {category}
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {kpis.map((kpi) => (
                <div 
                  key={kpi.id} 
                  className={`p-3 rounded-xl border transition-all duration-300 ${ /* Reduzido p-4 para p-3 */
                    currentSelections[kpi.id] 
                    ? 'bg-[var(--brand-surface)] border-[var(--brand-primary)]/30' 
                    : 'bg-[var(--brand-surface)]/50 border-white/5 opacity-60' // Fundo mais sutil quando não selecionado
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-white font-bold text-sm uppercase tracking-tight">
                        {kpi.name}
                      </p>
                      <p className="text-[var(--brand-text-muted)] text-[10px] leading-relaxed">
                        {kpi.description}
                      </p>
                    </div>
                    <div className="pt-1">
                      <ToggleSwitch
                        id={kpi.id}
                        checked={currentSelections[kpi.id]}
                        onChange={(checked) => handleToggle(kpi.id, checked)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Botão Flutuante ou de Rodapé */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10 sticky bottom-0 bg-black/80 backdrop-blur-md py-3"> {/* Reduzido pt-6 py-4 para pt-4 py-3 */}
        <p className="text-[10px] text-[var(--brand-text-muted)] font-medium">
          <span className="text-[var(--brand-primary)] font-black text-sm">{selectedCount}</span> KPIs selecionados
        </p>
        <Button 
          type="submit" 
          disabled={selectedCount < 5}
          className="shadow-[0_0_20px_rgba(212,175,55,0.2)]"
        >
          Salvar Estratégia
        </Button>
      </div>
    </form>
  );
};

export default KpiSelection;