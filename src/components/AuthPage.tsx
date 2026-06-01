import React, { useState } from 'react';
import { supabase, USING_MOCK_SUPABASE } from '../lib/supabase';
import { 
  ArrowRight, 
  Lock, 
  Mail, 
  User, 
  Check, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  ArrowLeft,
  Sparkles,
  KeyRound
} from 'lucide-react';
import Logo from './Logo';

interface AuthPageProps {
  onAuthSuccess: (user: any) => void;
  initialEmail?: string;
  onBackToLanding?: () => void;
  initialScreen?: 'login' | 'register' | 'recover' | 'reset';
}

type AuthScreen = 'login' | 'register' | 'recover' | 'reset';

export default function AuthPage({ 
  onAuthSuccess, 
  initialEmail = '', 
  onBackToLanding,
  initialScreen = 'login'
}: AuthPageProps) {
  const [screen, setScreen] = useState<AuthScreen>(initialScreen);
  
  // Form fields
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState(initialEmail);
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  
  // Toggle password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status & states
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Email format validator
  const isValidEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const handleScreenChange = (newScreen: AuthScreen) => {
    setScreen(newScreen);
    setErrorMsg(null);
    setSuccessMsg(null);
    setSenha('');
    setConfirmarSenha('');
    if (newScreen === 'register' && !nome) {
      setNome('');
    }
  };

  // Submit handlers
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const emailClean = email.trim();
    if (!emailClean || !senha) {
      setErrorMsg('Por favor, preencha todos os campos.');
      return;
    }

    if (!isValidEmail(emailClean)) {
      setErrorMsg('Por favor, insira um e-mail válido.');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailClean,
        password: senha
      });

      if (error) {
        setErrorMsg(error.message || 'Erro ao efetuar login. Verifique os dados.');
      } else if (data?.user) {
        onAuthSuccess(data.user);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro inesperado.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const nomeClean = nome.trim();
    const emailClean = email.trim();

    if (!nomeClean || !emailClean || !senha || !confirmarSenha) {
      setErrorMsg('Por favor, preencha todos os campos.');
      return;
    }

    if (!isValidEmail(emailClean)) {
      setErrorMsg('E-mail em formato inválido.');
      return;
    }

    if (senha.length < 8) {
      setErrorMsg('A senha precisa ter no mínimo 8 caracteres.');
      return;
    }

    if (senha !== confirmarSenha) {
      setErrorMsg('As senhas digitadas não batem.');
      return;
    }

    setLoading(true);
    try {
      // Sign up using Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: emailClean,
        password: senha,
        options: {
          data: {
            nome: nomeClean,
            name: nomeClean
          }
        }
      });

      if (error) {
        setErrorMsg(error.message || 'Erro ao registrar.');
      } else if (data?.user) {
        setSuccessMsg('Cadastro realizado com sucesso!');
        // Login immediately
        setTimeout(() => {
          onAuthSuccess(data.user);
        }, 1200);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro inesperado.');
    } finally {
      setLoading(false);
    }
  };

  const handleRecover = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const emailClean = email.trim();
    if (!emailClean) {
      setErrorMsg('Por favor, digite seu e-mail cadastrado.');
      return;
    }

    if (!isValidEmail(emailClean)) {
      setErrorMsg('Por favor, insira um e-mail válido.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(emailClean);
      if (error) {
        setErrorMsg(error.message || 'Erro ao solicitar redefinição.');
      } else {
        setSuccessMsg(
          USING_MOCK_SUPABASE
            ? 'Cenário Simulado: E-mail de recuperação enviado para ' + emailClean + '! Clique no link de redefinição no painel.'
            : 'E-mail de recuperação enviado! Verifique sua caixa de entrada.'
        );
        // If simulation mode, guide them to simulation reset UI
        if (USING_MOCK_SUPABASE) {
          setTimeout(() => {
            handleScreenChange('reset');
          }, 4000);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro de conexão.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!senha || !confirmarSenha) {
      setErrorMsg('Por favor, preencha todos os campos.');
      return;
    }

    if (senha.length < 8) {
      setErrorMsg('A nova senha precisa ter no mínimo 8 caracteres.');
      return;
    }

    if (senha !== confirmarSenha) {
      setErrorMsg('As senhas não conferem.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: senha
      });

      if (error) {
        setErrorMsg(error.message || 'Erro ao redefinir a senha.');
      } else {
        setSuccessMsg('Sua senha foi redefinida com sucesso!');
        setTimeout(() => {
          handleScreenChange('login');
        }, 2000);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro de conexão.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF6F0] min-h-screen text-slate-800 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative selection:bg-purple-100 selection:text-purple-900 overflow-hidden">
      
      {/* Decorative Orbs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-purple-200/20 rounded-full filter blur-3xl opacity-50 pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-200/20 rounded-full filter blur-3xl opacity-50 pointer-events-none"></div>

      <div className="max-w-md w-full mx-auto relative z-10">
        
        {/* Banner Indicating Simulator Status */}
        {USING_MOCK_SUPABASE && (
          <div className="mb-6 bg-amber-50 border border-amber-200/75 rounded-2xl p-4 shadow-sm flex items-start gap-3 text-left">
            <Sparkles className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5 animate-pulse" />
            <div>
              <h5 className="font-serif font-bold text-amber-900 text-xs sm:text-sm">Modo de Simulação Local Ativo</h5>
              <p className="text-[11px] text-amber-700/90 mt-0.5 leading-relaxed">
                Nenhum banco de dados Supabase foi configurado. Você pode cadastrar qualquer e-mail/senha localmente para testes imediatos!
              </p>
              <div className="mt-1 text-[10px] font-mono text-amber-600">
                Email demo: <strong className="underline">user@example.com</strong> / Senha: <strong className="underline">password123</strong>
              </div>
            </div>
          </div>
        )}

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-1.5 cursor-pointer mb-2 hover:scale-105 transition" onClick={onBackToLanding}>
            <Logo size="xl" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-slate-900 tracking-tight">
            {screen === 'login' && 'Entrar na Plataforma'}
            {screen === 'register' && 'Criar sua Conta Premium'}
            {screen === 'recover' && 'Recuperar Senha'}
            {screen === 'reset' && 'Redefinir sua Senha'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            {screen === 'login' && 'Acesse seus cardápios semanais e receitas inteligentes'}
            {screen === 'register' && 'Descubra a liberdade culinária sem carga mental doméstica'}
            {screen === 'recover' && 'Enviaremos as orientações para redefinir as credenciais'}
            {screen === 'reset' && 'Digite as novas credenciais de acesso seguro abaixo'}
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl border border-purple-100/40 p-6 sm:p-8 shadow-xl shadow-purple-950/[0.02]">
          
          {/* Messages block */}
          {errorMsg && (
            <div className="mb-4 bg-red-50 border border-red-100 text-red-800 rounded-2xl p-4 text-xs sm:text-sm text-left flex items-start gap-2.5 animate-fade-in">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 bg-green-50 border border-green-100 text-green-800 rounded-2xl p-4 text-xs sm:text-sm text-left flex items-start gap-2.5 animate-fade-in">
              <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          {screen === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="text-left">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 pl-1">E-mail</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="exemplo@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-white text-slate-800"
                  />
                </div>
              </div>

              <div className="text-left">
                <div className="flex justify-between items-center mb-1.5 pl-1 pr-1">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Senha</label>
                  <button
                    type="button"
                    onClick={() => handleScreenChange('recover')}
                    className="text-xs text-purple-500 hover:text-purple-600 font-semibold cursor-pointer text-left"
                  >
                    Esqueci minha senha
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Sua senha secreta"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-white text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white font-semibold rounded-2xl shadow-lg shadow-purple-200/50 hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer mt-6"
              >
                {loading ? 'Entrando...' : 'Entrar'} <ArrowRight className="h-4 w-4" />
              </button>

              <p className="text-xs text-slate-500 text-center pt-2">
                Não tem uma conta?{' '}
                <button
                  type="button"
                  onClick={() => handleScreenChange('register')}
                  className="text-purple-500 font-bold hover:underline cursor-pointer"
                >
                  Criar conta
                </button>
              </p>
            </form>
          )}

          {screen === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="text-left">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 pl-1">Nome Completo</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Seu nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-white text-slate-800"
                  />
                </div>
              </div>

              <div className="text-left">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 pl-1">E-mail</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="exemplo@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-white text-slate-800"
                  />
                </div>
              </div>

              <div className="text-left">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 pl-1">Senha (Mínimo 8 caracteres)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    placeholder="Crie sua senha segura"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-white text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="text-left">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 pl-1">Confirmar Senha</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <KeyRound className="h-4 w-4" />
                  </span>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="Confirme sua senha"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-white text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white font-semibold rounded-2xl shadow-lg shadow-purple-200/50 hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer mt-6"
              >
                {loading ? 'Processando...' : 'Criar minha conta'} <ArrowRight className="h-4 w-4" />
              </button>

              <p className="text-xs text-slate-500 text-center pt-2">
                Já possui cadastro?{' '}
                <button
                  type="button"
                  onClick={() => handleScreenChange('login')}
                  className="text-purple-500 font-bold hover:underline cursor-pointer"
                >
                  Fazer login
                </button>
              </p>
            </form>
          )}

          {screen === 'recover' && (
            <form onSubmit={handleRecover} className="space-y-4">
              <div className="text-left">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 pl-1">E-mail Cadastrado</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="exemplo@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-white text-slate-800"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white font-semibold rounded-2xl shadow-lg shadow-purple-200/50 hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer mt-6"
              >
                {loading ? 'Enviando...' : 'Enviar e-mail de recuperação'}
              </button>

              <button
                type="button"
                onClick={() => handleScreenChange('login')}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-2xl transition text-xs flex items-center justify-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Voltar ao Login
              </button>
            </form>
          )}

          {screen === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="mb-4 bg-blue-50 text-blue-800 text-xs p-3.5 rounded-2xl flex gap-2 text-left">
                <Sparkles className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>Utilize a tela de redefinição para mudar e testar o acesso com a nova senha para o e-mail: <strong>{email}</strong></span>
              </div>

              <div className="text-left">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 pl-1">Nova Senha (Mínimo 8 caracteres)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    placeholder="Digite sua nova senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-white text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="text-left">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 pl-1">Confirmar Nova Senha</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <KeyRound className="h-4 w-4" />
                  </span>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="Confirme a nova senha"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-white text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white font-semibold rounded-2xl shadow-lg shadow-purple-200/50 hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer mt-6"
              >
                {loading ? 'Salvando...' : 'Redefinir e Salvar Senha'}
              </button>

              <button
                type="button"
                onClick={() => handleScreenChange('login')}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-2xl transition text-xs flex items-center justify-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Cancelar e Voltar
              </button>
            </form>
          )}

        </div>

        {/* Back Link to Public Site */}
        <div className="text-center mt-6">
          <button
            type="button"
            onClick={onBackToLanding}
            className="text-xs text-slate-500 hover:text-slate-800 font-medium inline-flex items-center gap-1 cursor-pointer"
          >
            ← Voltar para a Página Inicial
          </button>
        </div>

      </div>
    </div>
  );
}
