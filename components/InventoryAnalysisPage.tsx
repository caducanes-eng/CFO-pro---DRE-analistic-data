// components/InventoryAnalysisPage.tsx
import React, { useState, useMemo } from 'react';
import Input from './ui/Input';
import Button from './ui/Button';
import { Clock, ShoppingCart, Calculator, AlertCircle, Info, BarChart3 } from 'lucide-react';

const InventoryAnalysisPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'lt' | 'quantity'>('lt');

  // --- ESTADO ABA 1 (Lead Time) ---
  const [diasUltimoPedido, setDiasUltimoPedido] = useState<string>('');
  const [qtdPedidas, setQtdPedidas] = useState<string>('');
  const [qtdVendidasPeriodo, setQtdVendidasPeriodo] = useState<string>('');
  const [prazoEntrega, setPrazoEntrega] = useState<string>('');
  const [resultLT, setResultLT] = useState<number | null>(null);

  // --- ESTADO ABA 2 (Quantidade do Pedido) ---
  const [vendasPeriodoAba2, setVendasPeriodoAba2] = useState<string>('');
  const [diasPeriodoAba2, setDiasPeriodoAba2] = useState<string>('');
  const [sazonalidade, setSazonalidade] = useState<string>('');
  const [periodoCalculo, setPeriodoCalculo] = useState<string>('');
  const [resultQty, setResultQty] = useState<number | null>(null);

  // --- CÁLCULOS AUTOMÁTICOS (REATIVOS) ---
  const pecasRestantes = useMemo(() => {
    const p = parseFloat(qtdPedidas);
    const v = parseFloat(qtdVendidasPeriodo);
    if (isNaN(p) || isNaN(v)) return null;
    return p - v;
  }, [qtdPedidas, qtdVendidasPeriodo]);

  const vpdCalculadoAba1 = useMemo(() => {
    const d = parseFloat(diasUltimoPedido);
    const v = parseFloat(qtdVendidasPeriodo);
    if (!d || !v) return 0;
    return v / d;
  }, [diasUltimoPedido, qtdVendidasPeriodo]);

  const vpdCalculadoAba2 = useMemo(() => {
    const v = parseFloat(vendasPeriodoAba2);
    const d = parseFloat(diasPeriodoAba2);
    if (!v || !d) return 0;
    return v / d;
  }, [vendasPeriodoAba2, diasPeriodoAba2]);

  // --- VALIDAÇÕES DE BOTÃO (OBRIGATORIEDADE) ---
  const isAba1Ready = diasUltimoPedido !== '' && qtdPedidas !== '' && qtdVendidasPeriodo !== '' && prazoEntrega !== '';
  const isAba2Ready = vendasPeriodoAba2 !== '' && diasPeriodoAba2 !== '' && sazonalidade !== '' && periodoCalculo !== '';

  // --- LÓGICA DE CÁLCULO ---
  const handleCalculateLT = () => {
    if (!isAba1Ready) return;
    const vpd = vpdCalculadoAba1;
    const restantes = pecasRestantes || 0;
    const prazo = parseFloat(prazoEntrega);
    
    if (vpd === 0) return setResultLT(0);
    
    const diasParaNovoPedido = (restantes / vpd) - prazo;
    setResultLT(diasParaNovoPedido);
  };

  const handleCalculateQty = () => {
    if (!isAba2Ready) return;
    const vpd = vpdCalculadoAba2;
    const saz = parseFloat(sazonalidade);
    const per = parseFloat(periodoCalculo);

    // Fórmula: (Giro * Sazonalidade) * Período Alvo
    const qtdNecessaria = (vpd * saz) * per;
    setResultQty(qtdNecessaria);
  };

  return (
    <div className="px-3 space-y-4 animate-in fade-in duration-500">
      <header className="pt-2">
        <h1 className="text-2xl font-black uppercase tracking-tighter text-white">
          INVENTORY <span className="text-[var(--brand-primary)]">INTEL</span>
        </h1>
        <p className="text-[9px] text-[var(--brand-text-muted)] font-black uppercase tracking-[0.2em]">
          Lead Time & Purchase Flow
        </p>
      </header>

      {/* Seletor de Abas */}
      <div className="flex bg-[var(--brand-surface)] p-1 rounded-xl border border-white/5 shadow-inner">
        <button
          onClick={() => setActiveTab('lt')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-[10px] font-black uppercase transition-all ${
            activeTab === 'lt' ? 'bg-[var(--brand-primary)] text-black' : 'text-white/30'
          }`}
        >
          <Clock size={14} /> Lead Time
        </button>
        <button
          onClick={() => setActiveTab('quantity')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-[10px] font-black uppercase transition-all ${
            activeTab === 'quantity' ? 'bg-[var(--brand-primary)] text-black' : 'text-white/30'
          }`}
        >
          <ShoppingCart size={14} /> Vol. Pedido
        </button>
      </div>

      <main className="bg-[var(--brand-surface)] border border-white/5 rounded-2xl p-4 shadow-2xl relative">
        {activeTab === 'lt' ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input 
                id="dias" label="Dias Últ. Pedido" type="number" 
                value={diasUltimoPedido} onChange={(e) => setDiasUltimoPedido(e.target.value)} 
              />
              <Input 
                id="qtdP" label="Qtd Pedida" type="number" 
                value={qtdPedidas} onChange={(e) => setQtdPedidas(e.target.value)} 
              />
              <Input 
                id="qtdV" label="Qtd Vendida" type="number" 
                value={qtdVendidasPeriodo} onChange={(e) => setQtdVendidasPeriodo(e.target.value)} 
              />
              <Input 
                id="prazo" label="Prazo de entrega" type="number" 
                value={prazoEntrega} onChange={(e) => setPrazoEntrega(e.target.value)} 
              />
            </div>

            <div className="bg-black/40 p-3 rounded-xl border border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Info size={12} className="text-[var(--brand-primary)]" />
                <span className="text-[9px] uppercase font-black text-white/40">Estoque Remanescente:</span>
              </div>
              <span className={`text-lg font-black ${pecasRestantes !== null && pecasRestantes < 0 ? 'text-red-500' : 'text-white'}`}>
                {pecasRestantes ?? '--'}
              </span>
            </div>

            <Button 
              onClick={handleCalculateLT} 
              disabled={!isAba1Ready}
              className="w-full py-4 text-[11px] font-black tracking-widest shadow-lg active:scale-95 transition-all"
            >
              <Calculator size={16} className="mr-2" /> CALCULAR DATA DE REPOSIÇÃO
            </Button>

            {resultLT !== null && (
              <div className="mt-4 p-5 bg-gradient-to-br from-[var(--brand-primary)]/10 to-transparent border border-[var(--brand-primary)]/30 rounded-2xl animate-in slide-in-from-bottom-2">
                <p className="text-[9px] uppercase font-black text-[var(--brand-primary)] mb-1 tracking-widest">Janela de Compra Segura</p>
                <div className="text-4xl font-black text-white tracking-tighter">
                  {resultLT < 0 ? 'RUPTURA' : Math.floor(resultLT)} <span className="text-lg">{resultLT < 0 ? 'DETECTADA' : 'Dias'}</span>
                </div>
                <p className="text-[10px] text-[var(--brand-text-muted)] mt-2 font-medium leading-tight">
                  {resultLT < 0 
                    ? "Alerta: Seu estoque já está insuficiente para cobrir o Prazo de entrega." 
                    : `Você deve realizar o pedido em até ${Math.floor(resultLT)} dias para garantir a continuidade.`}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Cálculo de Giro Automático - Nova Adição */}
            <div className="bg-black/20 p-4 rounded-xl border border-white/5 space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 size={14} className="text-[var(--brand-primary)]" />
                <h3 className="text-[9px] font-black uppercase text-white/40 tracking-widest">Cálculo de Giro Diário</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input 
                  id="vendasPeriodoAba2" label="Vendas do período" type="number" 
                  value={vendasPeriodoAba2} onChange={(e) => setVendasPeriodoAba2(e.target.value)} 
                />
                <Input 
                  id="diasPeriodoAba2" label="Período (Dias)" type="number" 
                  value={diasPeriodoAba2} onChange={(e) => setDiasPeriodoAba2(e.target.value)} 
                />
              </div>
              
              {vpdCalculadoAba2 > 0 && (
                <div className="flex justify-between items-center pt-1">
                   <span className="text-[8px] font-black uppercase text-[var(--brand-primary)]">VPD Identificado:</span>
                   <span className="text-xs font-black text-white">{vpdCalculadoAba2.toFixed(2)} pçs/dia</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input 
                id="saz" label="Sazonalidade (Ex: 1.15)" type="number" step="0.01"
                value={sazonalidade} onChange={(e) => setSazonalidade(e.target.value)} 
              />
              <Input 
                id="per" label="Período Alvo (Dias)" type="number" 
                value={periodoCalculo} onChange={(e) => setPeriodoCalculo(e.target.value)} 
              />
            </div>

            <Button 
              onClick={handleCalculateQty} 
              disabled={!isAba2Ready}
              className="w-full py-4 text-[11px] font-black tracking-widest shadow-lg"
            >
              <Calculator size={16} className="mr-2" /> CALCULAR LOTE ÓTIMO
            </Button>

            {resultQty !== null && (
              <div className="mt-4 p-5 bg-gradient-to-br from-[var(--brand-primary)]/10 to-transparent border border-[var(--brand-primary)]/30 rounded-2xl animate-in zoom-in">
                <p className="text-[9px] uppercase font-black text-[var(--brand-primary)] mb-1 tracking-widest">Volume Sugerido do Lote</p>
                <div className="text-4xl font-black text-white tracking-tighter">
                  {Math.ceil(resultQty)} <span className="text-lg">Unidades</span>
                </div>
                <p className="text-[10px] text-[var(--brand-text-muted)] mt-2 font-medium">
                  Abastecimento calculado para cobrir {periodoCalculo} dias com giro de {vpdCalculadoAba2.toFixed(2)} VPD e sazonalidade de {((parseFloat(sazonalidade) - 1) * 100).toFixed(0)}%.
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer Informativo */}
      <footer className="bg-brand-surface/30 p-4 rounded-xl border border-white/5 flex gap-3 items-start">
        <AlertCircle size={16} className="text-[var(--brand-primary)] shrink-0 mt-0.5" />
        <p className="text-[9px] text-[var(--brand-text-muted)] uppercase font-bold leading-relaxed">
          Os cálculos de inventário utilizam o método de Erosão Linear. 
          A precisão depende da integridade dos registros diários de vendas.
        </p>
      </footer>
    </div>
  );
};

export default InventoryAnalysisPage;
