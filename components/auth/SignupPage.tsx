import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { UserPlus, Sparkles, AlertCircle, Building2 } from 'lucide-react';
import LogoUpload from '../settings/LogoUpload';

interface SignupPageProps {
  onGoToLogin: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onGoToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [segment, setSegment] = useState('');
  const [logoBase64, setLogoBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Criar Auth User
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Criar Perfil da Empresa na tabela profiles
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            company_name: companyName,
            segment: segment,
            logo_url: logoBase64 || '',
            updated_at: new Date().toISOString()
          });

        if (profileError) throw profileError;
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta empresarial');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container flex items-center justify-center px-4 py-8 min-h-screen bg-black overflow-y-auto">
      <div className="w-full max-w-lg space-y-6 bg-brand-surface/40 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
        <div className="text-center">
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Nova <span className="text-brand-primary">Empresa</span></h1>
          <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold mt-2">Plataforma de Alta Performance</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle size={14} />
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Building2 size={14} className="text-brand-primary" />
              <h3 className="text-[10px] font-black uppercase text-brand-primary tracking-widest">Identidade do Negócio</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                id="companyName"
                label="Nome da Empresa"
                placeholder="Ex: Educale Moda"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
              <div className="flex flex-col w-full">
                <label className="mb-1 text-[var(--brand-text-light)] text-sm font-medium">Segmento</label>
                <select 
                  value={segment} 
                  onChange={(e) => setSegment(e.target.value)}
                  className="bg-white/5 text-white border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary h-[46px]"
                  required
                >
                  <option value="" disabled className="bg-black">Selecione...</option>
                  <option value="Varejo Moda" className="bg-black">Varejo Moda</option>
                  <option value="Alimentação" className="bg-black">Alimentação</option>
                  <option value="Serviços" className="bg-black">Serviços</option>
                  <option value="Indústria" className="bg-black">Indústria</option>
                </select>
              </div>
            </div>

            <LogoUpload
              onLogoFileChange={(base64) => setLogoBase64(base64)}
              onRemoveLogo={() => setLogoBase64(null)}
            />
          </div>

          <div className="space-y-4 pt-2 border-t border-white/5">
            <h3 className="text-[10px] font-black uppercase text-white/40 tracking-widest">Credenciais de Acesso</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                id="email"
                type="email"
                label="E-mail"
                placeholder="gestor@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                id="password"
                type="password"
                label="Senha"
                placeholder="Mín. 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          
          <Button type="submit" loading={loading} className="w-full py-5 text-xs font-black tracking-[0.2em] uppercase bg-brand-primary text-black mt-2">
            Iniciar Ecossistema <UserPlus size={16} className="ml-2" />
          </Button>
        </form>

        <div className="text-center pt-2">
          <button 
            onClick={onGoToLogin}
            className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-brand-primary transition-colors"
          >
            Já possui acesso? <span className="text-brand-primary underline">Entrar agora</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;