// components/dataentry/MonthlyEntryForm.tsx
import React, { useState, useEffect } from 'react';
import { MonthlyDRE, MonthlyParsedData } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { v4 as uuidv4 } from 'uuid';
import { X, Sparkles, LayoutGrid, CheckCircle2, CalendarDays } from 'lucide-react';

// Utilitário de limpeza de dados financeiros brasileiros
const parseBRL = (v: string): number => {
  if (!v) return 0;
  let cleaned = v.replace(/\s+/g, '').replace(/[^\d,\.]/g, '');
  if (!cleaned) return 0;
  
  const lastComma = cleaned.lastIndexOf(',');
  const lastDot = cleaned.lastIndexOf('.');
  
  if (lastComma > lastDot && (cleaned.length - lastComma <= 3)) {
    cleaned = cleaned.replace(/\./g, '').replace(',', '.');
  } else if (lastDot > lastComma && (cleaned.length - lastDot <= 3)) {
    cleaned = cleaned.replace(/,/g, '');
  } else {
    cleaned = cleaned.replace(/[,\.]/g, (m, offset, str) => 
      offset === str.lastIndexOf(m) && (str.length - offset <= 3) ? '.' : ''
    );
  }
  return parseFloat(cleaned) || 0;
};

const extractDataFromRawString = (raw: string): Partial<MonthlyParsedData> => {
  const parsed: any = {};
  const lines = raw.split('\n');

  // Definição de mapeamento inteligente por palavra-chave
  const mappings = [
    { key: 'taxes', keyPct: 'taxesPercent', regex: /(?:IMPOSTOS|B4|C4)/i },
    { key: 'grossRevenue', keyPct: null, regex: /(?:RECEITA\s*BRUTA|FATURAMENTO|B2)/i },
    { key: 'netRevenue', keyPct: null, regex: /(?:RECEITA\s*LÍQUIDA|B7)/i },
    { key: 'cmv', keyPct: 'cmvRatioPercent', regex: /(?:CMV|CPV|CUSTO\s*MERCADORIA|B10)/i },
    { key: 'grossProfit', keyPct: 'grossMarginPercent', regex: /(?:LUCRO\s*BRUTO|B11)/i },
    { key: 'discount', keyPct: 'discountPercent', regex: /(?:DESCONTOS|B6|C6)/i },
    { key: 'returns', keyPct: 'returnRatePercent', regex: /(?:DEVOLUÇÕES|B5|C5)/i },
    { key: 'marketingAds', keyPct: null, regex: /(?:MARKETING\s*\(ADS\)|ADS|B16)/i },
    { key: 'contributionMarginValue', keyPct: 'contributionMarginPercent', regex: /(?:MARGEM\s*CONTRIB|B17)/i },
    { key: 'ebitda', keyPct: null, regex: /(?:EBITDA|LAJIDA|B23)/i },
    { key: 'netProfit', keyPct: null, regex: /(?:LUCRO\s*LÍQUIDO|RESULTADO|B27)/i },
    { key: 'personnelCost', keyPct: null, regex: /(?:PESSOAL|FIXO|FOLHA|B19)/i },
    { key: 'occupancyCost', keyPct: 'occupancyCostPercent', regex: /(?:OCUPAÇÃO|ALUGUEL|B20)/i },
    { id: 'markup', keyPct: null, regex: /(?:MARKUP|B9)/i }
  ];

  lines.forEach(line => {
    mappings.forEach(map => {
      if (map.regex.test(line)) {
        const matches = line.match(/([\d\.,]+)\s*(%|R\$)?/g);
        
        if (matches) {
          matches.forEach(m => {
            const isPercent = m.includes('%');
            const val = parseBRL(m);
            
            if (isPercent && map.keyPct) {
              parsed[map.keyPct] = val;
            } else if (!isPercent && map.key) {
              parsed[map.key] = val;
            } else if (!isPercent && map.id === 'markup') {
              parsed.markup = val;
            }
          });
        }
      }
    });
  });

  return parsed;
};

const MonthlyEntryForm: React.FC<any> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState<MonthlyDRE>(initialData || {
    id: uuidv4(), monthYear: new Date().toISOString().slice(0, 7), rawContent: '', parsedData: {} as MonthlyParsedData
  });
  const [smartPasteContent, setSmartPasteContent] = useState<string>(initialData?.rawContent || '');
  const [processedLines, setProcessedLines] = useState(0);

  useEffect(() => {
    if (smartPasteContent.trim()) {
      const extracted = extractDataFromRawString(smartPasteContent);
      const count = Object.keys(extracted).length;
      setProcessedLines(count);
      
      setFormData(prev => ({
        ...prev, 
        rawContent: smartPasteContent,
        parsedData: { ...prev.parsedData, ...extracted }, 
      }));
    } else {
      setProcessedLines(0);
    }
  }, [smartPasteContent]);

  const handleChange = (id: string, value: string) => {
    setFormData(prev => ({
      ...prev, parsedData: { ...prev.parsedData, [id]: value === '' ? null : parseFloat(value) }
    }));
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      monthYear: e.target.value
    }));
  };

  const fieldGroups = [
    { 
      title: "Financeiro Consolidado (R$)", 
      fields: [
        { id: 'grossRevenue', label: 'Venda Bruta' }, 
        { id: 'netRevenue', label: 'Rec. Líquida' }, 
        { id: 'cmv', label: 'CMV' }, 
        { id: 'grossProfit', label: 'Lucro Bruto' },
        { id: 'taxes', label: 'Impostos (R$)' },
        { id: 'ebitda', label: 'EBITDA' }, 
        { id: 'netProfit', label: 'Lucro Líquido' }
      ] 
    },
    {
      title: "Indicadores Verticais (%)",
      fields: [
        { id: 'markup', label: 'Markup' }, 
        { id: 'cmvRatioPercent', label: 'CMV %' },
        { id: 'taxesPercent', label: 'Impostos %' },
        { id: 'contributionMarginPercent', label: 'Margem C. %' }, 
        { id: 'grossMarginPercent', label: 'M. Bruta %' }
      ]
    }
  ];

  return (
    <div className="space-y-4">
      {/* Seletor de Competência - Nova Adição */}
      <div className="bg-brand-surface border border-white/5 p-3 rounded-2xl flex items-center gap-3">
        <CalendarDays size={18} className="text-brand-primary shrink-0" />
        <div className="flex-grow">
          <label className="text-[8px] font-black uppercase text-white/30 tracking-widest block mb-1">Mês de Referência da DRE</label>
          <input 
            type="month" 
            value={formData.monthYear}
            onChange={handleMonthChange}
            className="w-full !bg-transparent !border-none !p-0 !text-white !font-black !text-sm focus:!ring-0 cursor-pointer"
          />
        </div>
      </div>

      {/* Terminal Smart Paste - Destaque Neon */}
      <div className="bg-brand-surface border-2 border-brand-primary/20 p-4 rounded-2xl shadow-[0_0_30px_rgba(212,175,55,0.05)]">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-brand-primary animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-brand-primary">DRE Parser Intelligence</span>
          </div>
          {processedLines > 0 && (
            <div className="flex items-center gap-1 text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full border border-green-400/20">
              <CheckCircle2 size={10} />
              <span className="text-[8px] font-black uppercase">{processedLines} Campos Detectados</span>
            </div>
          )}
        </div>
        
        <div className="relative">
          <textarea 
            className="w-full h-24 bg-black/60 border-2 border-dashed border-white/10 text-[12px] font-mono p-3 focus:border-brand-primary focus:bg-brand-primary/5 transition-all placeholder-white/10 resize-none rounded-xl" 
            placeholder="COLE AQUI: (-) Impostos 4,00% 2.090,43..." 
            value={smartPasteContent} 
            onChange={(e) => setSmartPasteContent(e.target.value)}
          ></textarea>
          {smartPasteContent && (
            <button onClick={() => setSmartPasteContent('')} className="absolute top-2 right-2 text-white/20 hover:text-red-500">
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Grid de Conferência */}
      <div className="max-h-[40vh] overflow-y-auto pr-1 space-y-4 custom-scrollbar">
        {fieldGroups.map(group => (
          <div key={group.title} className="bg-brand-surface/60 p-4 rounded-2xl border border-white/5">
            <h4 className="text-[10px] font-black uppercase text-brand-primary/80 mb-4 tracking-[0.25em] flex items-center gap-2 border-b border-white/5 pb-2">
              <LayoutGrid size={14} /> {group.title}
            </h4>
            <div className="grid grid-cols-2 gap-4">
              {group.fields.map(f => (
                <div key={f.id} className="relative group">
                  <label className="text-[9px] uppercase text-white/40 font-black ml-1 mb-1 block group-focus-within:text-brand-primary transition-colors">
                    {f.label}
                  </label>
                  <input 
                    type="number" 
                    step="0.01" 
                    className="w-full !py-3 !px-4 !bg-black/40 !border-white/10 !text-white !font-bold rounded-xl focus:!border-brand-primary"
                    value={(formData.parsedData as any)[f.id] ?? ''} 
                    onChange={(e) => handleChange(f.id, e.target.value)} 
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Button 
        type="submit" 
        onClick={() => onSave(formData)} 
        className="w-full py-5 text-[11px] font-black tracking-[0.3em] shadow-[0_10px_30px_rgba(212,175,55,0.15)] bg-brand-primary text-black hover:scale-[1.02] active:scale-[0.98] transition-all"
      >
        SINCRONIZAR INDICADORES
      </Button>
    </div>
  );
};

export default MonthlyEntryForm;
