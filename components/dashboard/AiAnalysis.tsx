// components/dashboard/AiAnalysis.tsx
import React, { useState, useCallback } from 'react';
import { Sparkles } from 'lucide-react';
import { KPI } from '../../types';
import { getAiAnalysis } from '../../services/geminiService';
import Button from '../ui/Button';

interface AiAnalysisProps {
  kpis: KPI[];
  primaryColor: string;
}

const AiAnalysis: React.FC<AiAnalysisProps> = ({ kpis, primaryColor }) => {
  const [analysisText, setAnalysisText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchAnalysis = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getAiAnalysis(kpis);
      setAnalysisText(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [kpis]);

  return (
    <div className="bg-brand-surface border border-brand-primary/20 rounded-2xl p-4 shadow-2xl relative overflow-hidden group">
      {/* Efeito de Brilho de Fundo */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-primary/10 blur-3xl rounded-full"></div>
      
      <div className="flex items-center mb-3">
        <Sparkles size={20} className="text-brand-primary mr-2" />
        <h3 className="text-xs font-black uppercase tracking-widest text-brand-primary">Análise Estratégica IA</h3>
      </div>

      {analysisText ? (
        <div className="text-[12px] text-white/80 leading-relaxed font-medium space-y-2">
          {analysisText.split('\n').map((line, i) => <p key={i}>{line}</p>)}
        </div>
      ) : (
        <p className="text-[10px] text-white/40 italic font-bold uppercase mb-4">Aguardando processamento de indicadores para gerar insights...</p>
      )}

      <div className="mt-4">
        <Button 
          onClick={fetchAnalysis} 
          loading={isLoading} 
          className="w-full !py-3 !text-[10px] !font-black !tracking-widest"
        >
          {analysisText ? 'REPROCESSAR INSIGHTS' : 'GERAR ANÁLISE AGORA'}
        </Button>
      </div>
    </div>
  );
};

export default AiAnalysis;