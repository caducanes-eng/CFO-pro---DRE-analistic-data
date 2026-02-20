import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { LogIn, Sparkles, AlertCircle } from 'lucide-react';

interface LoginPageProps {
  onGoToSignup: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onGoToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message === 'Invalid login credentials' ? 'Credenciais inválidas. Verifique e-mail e senha.' : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container flex items-center justify-center px-4 min-h-screen bg-black">
      <div className="w-full max-w-md space-y-8 bg-brand-surface/40 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl">
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-3 bg-brand-primary/10 rounded-2xl mb-4">
            <Sparkles className="text-brand-primary" size={32} />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Educale <span className="text-brand-primary">Gestão</span></h1>
          <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold mt-2">Central Business Intelligence</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-xs flex items-center gap-2 animate-in slide-in-from-top-2">
            <AlertCircle size={14} />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            id="email"
            type="email"
            label="E-mail Corporativo"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            id="password"
            type="password"
            label="Senha"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <Button type="submit" loading={loading} className="w-full py-4 text-xs font-black tracking-widest uppercase mt-4">
            Acessar Dashboard <LogIn size={16} className="ml-2" />
          </Button>
        </form>

        <div className="text-center pt-4 border-t border-white/5">
          <button 
            onClick={onGoToSignup}
            className="text-[10px] font-black uppercase tracking-widest text-brand-primary hover:text-brand-accent transition-colors"
          >
            Não possui conta? <span className="underline">Cadastrar Empresa</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;