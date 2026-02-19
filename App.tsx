
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { DailyRegister, MonthlyDRE, KPI, CompanyInfo, AppPage, ColorPalette, AuditoriaMeta } from './types';
import { localStorageService } from './services/localStorageService';
import { calculateAllKpis } from './utils/kpiCalculations';
import { ALL_KPIS } from './constants';
import Navbar from './components/layout/Navbar';
import Header from './components/layout/Header';
import DashboardPage from './components/DashboardPage';
import DataEntryPage from './components/DataEntryPage';
import HistoryPage from './components/HistoryPage';
import SettingsPage from './components/SettingsPage';
import InventoryAnalysisPage from './components/InventoryAnalysisPage';
import useThemeGenerator from './hooks/useThemeGenerator';

function App() {
  const [dailyRegisters, setDailyRegisters] = useState<DailyRegister[]>(() =>
    localStorageService.getItem('dailyRegisters', [])
  );
  const [monthlyDREs, setMonthlyDREs] = useState<MonthlyDRE[]>(() =>
    localStorageService.getItem('monthlyDREs', [])
  );
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(() =>
    localStorageService.getItem('companyInfo', { name: 'Minha Loja', cnpj: '', taxRegime: '', logoUrl: '' })
  );
  const [allKpis, setAllKpis] = useState<KPI[]>(() =>
    localStorageService.getItem('allKpis', ALL_KPIS)
  );
  const [currentPage, setCurrentPage] = useState<AppPage>(AppPage.Dashboard);
  const [mesesFiltro, setMesesFiltro] = useState(1); 

  const [rawLogoBase64, setRawLogoBase64] = useState<string | null>(() =>
    localStorageService.getItem('rawLogoBase64', null)
  );

  const { processedLogoUrl, primaryColor, secondaryColor, accentColor, bgTintColor, brandSurface, brandTextLight, brandTextMuted, isLoadingTheme } =
    useThemeGenerator(rawLogoBase64);

  useEffect(() => {
    if (processedLogoUrl !== undefined && companyInfo.logoUrl !== processedLogoUrl) {
      setCompanyInfo(prev => ({ ...prev, logoUrl: processedLogoUrl || '' }));
    }
  }, [processedLogoUrl, companyInfo.logoUrl]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--brand-primary', primaryColor || '#D4AF37');
    root.style.setProperty('--brand-secondary', secondaryColor || '#B8860B');
    root.style.setProperty('--brand-accent', accentColor || '#FFD700');
    root.style.setProperty('--brand-bg-tint', bgTintColor || 'rgba(212, 175, 55, 0.1)');
    root.style.setProperty('--brand-surface', brandSurface || '#121217');
    root.style.setProperty('--brand-text-light', brandTextLight || '#E0E0E0');
    root.style.setProperty('--brand-text-muted', brandTextMuted || 'rgba(255, 255, 255, 0.6)');
    
    localStorageService.setItem('rawLogoBase64', rawLogoBase64);
    localStorageService.setItem('currentPalette', { primary: primaryColor, secondary: secondaryColor, accent: accentColor, bgTint: bgTintColor, brandSurface: brandSurface, brandTextLight: brandTextLight, brandTextMuted: brandTextMuted });

  }, [primaryColor, secondaryColor, accentColor, bgTintColor, brandSurface, brandTextLight, brandTextMuted, rawLogoBase64]);

  useEffect(() => { localStorageService.setItem('dailyRegisters', dailyRegisters); }, [dailyRegisters]);
  useEffect(() => { localStorageService.setItem('monthlyDREs', monthlyDREs); }, [monthlyDREs]);
  useEffect(() => { localStorageService.setItem('companyInfo', companyInfo); }, [companyInfo]);
  useEffect(() => { localStorageService.setItem('allKpis', allKpis); }, [allKpis]);

  const handleLogoFileChange = useCallback((raw: string | null) => setRawLogoBase64(raw), []);
  const handleRemoveLogo = useCallback(() => { setRawLogoBase64(null); setCompanyInfo(prev => ({ ...prev, logoUrl: '' })); }, []);

  const { kpis: calculatedKpis, auditoriaMeta } = useMemo(() => {
    return calculateAllKpis(dailyRegisters, monthlyDREs, mesesFiltro);
  }, [dailyRegisters, monthlyDREs, mesesFiltro]);

  const finalKpis = useMemo(() => {
    return allKpis.map(kpi => {
      const calc = calculatedKpis.find(ck => ck.id === kpi.id);
      return { 
        ...kpi, 
        value: calc?.value ?? null, 
        comparisonDelta: calc?.comparisonDelta,
        comparisonDeltaFormatted: calc?.comparisonDeltaFormatted,
        comparisonIsFavorable: calc?.comparisonIsFavorable,
        comparisonColorClass: calc?.comparisonColorClass,
        referenceExplanation: calc?.referenceExplanation 
      };
    });
  }, [allKpis, calculatedKpis]);

  const renderPage = () => {
    const props = {
      kpis: finalKpis,
      monthlyDREs,
      dailyRegisters,
      primaryColor,
      secondaryColor,
      accentColor,
      brandTextLight,
      brandTextMuted,
      setMesesFiltro,
      auditoriaMeta,
    };

    switch (currentPage) {
      case AppPage.Dashboard: return <DashboardPage {...props} />;
      case AppPage.DataEntry: return <DataEntryPage 
        onAddDailyRegister={(r) => setDailyRegisters(prev => {
          const existingIndex = prev.findIndex(item => item.date === r.date);
          if (existingIndex !== -1) {
            const updated = [...prev];
            updated[existingIndex] = r;
            return updated;
          }
          return [...prev, r];
        })} 
        onAddMonthlyDRE={(d) => setMonthlyDREs(prev => {
          const existingIndex = prev.findIndex(item => item.monthYear === d.monthYear);
          if (existingIndex !== -1) {
            const updated = [...prev];
            updated[existingIndex] = d;
            return updated;
          }
          return [...prev, d];
        })} 
      />;
      case AppPage.Inventory: return <InventoryAnalysisPage />;
      case AppPage.History: return <HistoryPage 
        dailyRegisters={dailyRegisters} 
        monthlyDREs={monthlyDREs} 
        onEditDailyRegister={(updated) => setDailyRegisters(prev => prev.map(r => r.id === updated.id ? updated : r))}
        onDeleteDailyRegister={(id) => setDailyRegisters(p => p.filter(r => r.id !== id))} 
        onEditMonthlyDRE={(updated) => setMonthlyDREs(prev => prev.map(d => d.id === updated.id ? updated : d))}
        onDeleteMonthlyDRE={(id) => setMonthlyDREs(p => p.filter(d => d.id !== id))} 
      />;
      case AppPage.Settings: return <SettingsPage 
        companyInfo={companyInfo} 
        allKpis={finalKpis} 
        processedLogoUrl={processedLogoUrl} 
        isLoadingTheme={isLoadingTheme} 
        onUpdateCompanyInfo={setCompanyInfo} 
        onUpdateKpiSelection={(ids) => setAllKpis(prev => prev.map(k => ({ ...k, selected: ids.includes(k.id) })))} 
        onLogoFileChange={handleLogoFileChange} 
        onRemoveLogo={handleRemoveLogo} 
      />;
      default: return <DashboardPage {...props} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black" style={{ color: `var(--brand-text-light)` }}>
      <Header companyName={companyInfo.name} logoUrl={processedLogoUrl} primaryColor={primaryColor} />
      <main className="flex-grow w-full max-w-4xl mx-auto px-4 mt-2">
        {isLoadingTheme ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--brand-primary)]"></div>
            <p className="text-[var(--brand-primary)] font-bold animate-pulse uppercase tracking-widest text-xs">Sincronizando Marca...</p>
          </div>
        ) : renderPage()}
      </main>
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
    </div>
  );
}

export default App;
