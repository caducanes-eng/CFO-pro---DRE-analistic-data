import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { DailyRegister, MonthlyDRE, KPI, CompanyInfo, AppPage, AuditoriaMeta } from './types';
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
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './components/auth/LoginPage';
import SignupPage from './components/auth/SignupPage';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { AlertTriangle, ExternalLink, Loader2 } from 'lucide-react';

function AppContent() {
  const { user, loading: authLoading } = useAuth();
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  const [dataLoading, setDataLoading] = useState(false);

  // Estados Locais (Sincronizados com Supabase)
  const [dailyRegisters, setDailyRegisters] = useState<DailyRegister[]>([]);
  const [monthlyDREs, setMonthlyDREs] = useState<MonthlyDRE[]>([]);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({ name: 'Carregando...', cnpj: '', taxRegime: '', logoUrl: '' });
  const [allKpis, setAllKpis] = useState<KPI[]>(ALL_KPIS);
  const [currentPage, setCurrentPage] = useState<AppPage>(AppPage.Dashboard);
  const [mesesFiltro, setMesesFiltro] = useState(1); 
  const [rawLogoBase64, setRawLogoBase64] = useState<string | null>(null);

  const { processedLogoUrl, primaryColor, secondaryColor, accentColor, brandSurface, brandTextLight, brandTextMuted, isLoadingTheme } =
    useThemeGenerator(rawLogoBase64);

  // --- SINCRONIZAÇÃO INICIAL (RECUPERAÇÃO) ---
  useEffect(() => {
    if (user && isSupabaseConfigured) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user || !isSupabaseConfigured) return;
    setDataLoading(true);
    try {
      // 1. Perfil e Marca
      const { data: profile, error: pError } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (profile) {
        setCompanyInfo({
          name: profile.company_name,
          cnpj: profile.cnpj || '',
          taxRegime: profile.tax_regime || '',
          logoUrl: profile.logo_url || ''
        });
        setRawLogoBase64(profile.logo_url || null);
      } else if (pError && pError.code !== 'PGRST116') {
        console.error("Erro ao carregar perfil:", pError);
      }

      // 2. Registros Diários
      const { data: dailies } = await supabase.from('daily_registers').select('*').eq('user_id', user.id).order('date', { ascending: false });
      if (dailies) setDailyRegisters(dailies);

      // 3. DREs Mensais
      const { data: dres } = await supabase.from('monthly_dres').select('*').eq('user_id', user.id).order('month_year', { ascending: false });
      if (dres) {
        setMonthlyDREs(dres.map(d => ({
          id: d.id,
          monthYear: d.month_year,
          rawContent: d.raw_content,
          parsedData: d.parsed_data
        })));
      }

      // 4. Configurações de KPI
      const { data: kpiSettings } = await supabase.from('kpi_settings').select('*').eq('user_id', user.id).single();
      if (kpiSettings) {
        setAllKpis(prev => prev.map(k => ({
          ...k,
          selected: kpiSettings.selected_ids.includes(k.id)
        })));
      }

    } catch (err) {
      console.error("Erro fatal ao carregar dados do usuário:", err);
    } finally {
      setDataLoading(false);
    }
  };

  // --- SINCRONIZAÇÃO DE PERSISTÊNCIA (UPSERTS) ---
  const syncDaily = async (register: DailyRegister) => {
    if (!user) return;
    try {
      const { error } = await supabase.from('daily_registers').upsert({ 
        ...register, 
        user_id: user.id,
        updated_at: new Date().toISOString()
      });
      if (error) throw error;
    } catch (e) {
      console.error("Falha ao persistir registro diário:", e);
    }
  };

  const syncMonthly = async (dre: MonthlyDRE) => {
    if (!user) return;
    try {
      const { error } = await supabase.from('monthly_dres').upsert({
        id: dre.id,
        user_id: user.id,
        month_year: dre.monthYear,
        raw_content: dre.rawContent,
        parsed_data: dre.parsedData,
        updated_at: new Date().toISOString()
      });
      if (error) throw error;
    } catch (e) {
      console.error("Falha ao persistir DRE:", e);
    }
  };

  const syncProfile = async (info: CompanyInfo, logo: string | null) => {
    if (!user) return;
    try {
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        company_name: info.name,
        cnpj: info.cnpj,
        tax_regime: info.taxRegime,
        logo_url: logo,
        updated_at: new Date().toISOString()
      });
      if (error) throw error;
    } catch (e) {
      console.error("Falha ao persistir perfil:", e);
    }
  };

  // --- LÓGICA DE TEMA (CSS VARIABLES ADAPTATIVAS) ---
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--brand-primary', primaryColor || '#D4AF37');
    root.style.setProperty('--brand-secondary', secondaryColor || '#B8860B');
    root.style.setProperty('--brand-accent', accentColor || '#FFD700');
    root.style.setProperty('--brand-surface', brandSurface || '#121217');
    root.style.setProperty('--brand-text-light', brandTextLight || '#E0E0E0');
    root.style.setProperty('--brand-text-muted', brandTextMuted || 'rgba(255, 255, 255, 0.6)');
  }, [primaryColor, secondaryColor, accentColor, brandSurface, brandTextLight, brandTextMuted]);

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

  if (authLoading || dataLoading) {
    return (
      <div className="h-screen w-screen bg-black flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-brand-primary" size={40} />
        <p className="text-brand-primary font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Educale Data Syncing...</p>
      </div>
    );
  }

  if (!user) {
    return authView === 'login' 
      ? <LoginPage onGoToSignup={() => setAuthView('signup')} /> 
      : <SignupPage onGoToLogin={() => setAuthView('login')} />;
  }

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
        onAddDailyRegister={(r) => {
          setDailyRegisters(prev => {
            const index = prev.findIndex(item => item.date === r.date);
            const updated = index !== -1 ? [...prev] : [...prev, r];
            if (index !== -1) updated[index] = r;
            return updated;
          });
          syncDaily(r);
        }} 
        onAddMonthlyDRE={(d) => {
          setMonthlyDREs(prev => {
            const index = prev.findIndex(item => item.monthYear === d.monthYear);
            const updated = index !== -1 ? [...prev] : [...prev, d];
            if (index !== -1) updated[index] = d;
            return updated;
          });
          syncMonthly(d);
        }} 
      />;
      case AppPage.Inventory: return <InventoryAnalysisPage />;
      case AppPage.History: return <HistoryPage 
        dailyRegisters={dailyRegisters} 
        monthlyDREs={monthlyDREs} 
        onEditDailyRegister={(updated) => {
          setDailyRegisters(prev => prev.map(r => r.id === updated.id ? updated : r));
          syncDaily(updated);
        }}
        onDeleteDailyRegister={async (id) => {
          setDailyRegisters(p => p.filter(r => r.id !== id));
          await supabase.from('daily_registers').delete().eq('id', id);
        }} 
        onEditMonthlyDRE={(updated) => {
          setMonthlyDREs(prev => prev.map(d => d.id === updated.id ? updated : d));
          syncMonthly(updated);
        }}
        onDeleteMonthlyDRE={async (id) => {
          setMonthlyDREs(p => p.filter(d => d.id !== id));
          await supabase.from('monthly_dres').delete().eq('id', id);
        }} 
      />;
      case AppPage.Settings: return <SettingsPage 
        companyInfo={companyInfo} 
        allKpis={finalKpis} 
        processedLogoUrl={processedLogoUrl} 
        isLoadingTheme={isLoadingTheme} 
        onUpdateCompanyInfo={(info) => {
          setCompanyInfo(info);
          syncProfile(info, rawLogoBase64);
        }} 
        onUpdateKpiSelection={async (ids) => {
          setAllKpis(prev => prev.map(k => ({ ...k, selected: ids.includes(k.id) })));
          await supabase.from('kpi_settings').upsert({ user_id: user.id, selected_ids: ids });
        }} 
        onLogoFileChange={(raw) => {
          setRawLogoBase64(raw);
          syncProfile(companyInfo, raw);
        }} 
        onRemoveLogo={() => {
          setRawLogoBase64(null);
          setCompanyInfo(prev => ({ ...prev, logoUrl: '' }));
          syncProfile(companyInfo, null);
        }} 
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
            <Loader2 className="animate-spin text-brand-primary" size={32} />
            <p className="text-brand-primary font-bold animate-pulse uppercase tracking-widest text-[10px]">Marca Digitalizada...</p>
          </div>
        ) : renderPage()}
      </main>
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;