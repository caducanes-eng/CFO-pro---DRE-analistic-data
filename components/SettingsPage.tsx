import React from 'react';
import { KPI, CompanyInfo } from '../types';
import LogoUpload from './settings/LogoUpload';
import KpiSelection from './settings/KpiSelection';
import CompanyDetailsForm from './settings/CompanyDetailsForm';

interface SettingsPageProps {
  companyInfo: CompanyInfo;
  allKpis: KPI[];
  processedLogoUrl?: string | null; // The processed logo URL from the theme generator
  isLoadingTheme: boolean; // Indicates if theme generation is in progress
  onUpdateCompanyInfo: (info: CompanyInfo) => void;
  onUpdateKpiSelection: (selectedIds: string[]) => void;
  onLogoFileChange: (rawBase64: string | null) => void; // New prop to handle raw logo file change
  onRemoveLogo: () => void; // New prop to handle logo removal
}

const SettingsPage: React.FC<SettingsPageProps> = ({
  companyInfo,
  allKpis,
  processedLogoUrl,
  isLoadingTheme,
  onUpdateCompanyInfo,
  onUpdateKpiSelection,
  onLogoFileChange,
  onRemoveLogo,
}) => {
  return (
    <div className="p-4 pb-4 space-y-6 animate-in fade-in duration-500"> {/* Reduzido space-y-8 para space-y-6 e pb-24 para pb-4 */}
      <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-2"> {/* Adicionado mb-2 */}
        CONFIGURAÇÕES DA <span className="text-[var(--brand-primary)]">PLATAFORMA</span>
      </h1>

      <div className="space-y-6"> {/* Reduzido space-y-8 para space-y-6 */}
        {/* Company Logo & Primary Color */}
        <div className="bg-[var(--brand-surface)] border border-white/5 rounded-3xl p-5 shadow-2xl"> {/* Reduzido p-6 para p-5 */}
          <h2 className="text-sm font-black uppercase tracking-[0.15em] text-[var(--brand-primary)] mb-3">Logo da Empresa & Tema</h2> {/* Reduzido mb-4 para mb-3 */}
          <LogoUpload
            currentLogoUrl={processedLogoUrl}
            isLoading={isLoadingTheme}
            onLogoFileChange={onLogoFileChange}
            onRemoveLogo={onRemoveLogo}
          />
        </div>

        {/* KPI Selection */}
        <div className="bg-[var(--brand-surface)] border border-white/5 rounded-3xl p-5 shadow-2xl"> {/* Reduzido p-6 para p-5 */}
          <h2 className="text-sm font-black uppercase tracking-[0.15em] text-[var(--brand-primary)] mb-3">Seleção de KPIs</h2> {/* Reduzido mb-4 para mb-3 */}
          <KpiSelection
            allKpis={allKpis}
            onSave={onUpdateKpiSelection}
          />
        </div>

        {/* Company Details */}
        <div className="bg-[var(--brand-surface)] border border-white/5 rounded-3xl p-5 shadow-2xl"> {/* Reduzido p-6 para p-5 */}
          <h2 className="text-sm font-black uppercase tracking-[0.15em] text-[var(--brand-primary)] mb-3">Dados da Empresa</h2> {/* Reduzido mb-4 para mb-3 */}
          <CompanyDetailsForm
            initialData={companyInfo}
            onSave={onUpdateCompanyInfo}
          />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;