
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Fingerprint, Lock, Mail, ArrowRight, Loader2, ShieldCheck, Eye, EyeOff, Facebook } from 'lucide-react';

interface AuthProps {
  navigate: (path: string) => void;
}

const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const Auth: React.FC<AuthProps> = ({ navigate }) => {
  const { login, socialLogin, isAuthenticated } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<'IDLE' | 'SCANNING' | 'VERIFYING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [socialProvider, setSocialProvider] = useState<'google' | 'facebook' | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('SCANNING');
    setErrorMsg('');

    // Simulate Biometric Scan
    setTimeout(async () => {
      setStatus('VERIFYING');
      const success = await login(email, password);
      
      if (success) {
        setStatus('SUCCESS');
        setTimeout(() => navigate('/dashboard'), 800);
      } else {
        setStatus('ERROR');
        setErrorMsg('Identifiants invalides ou accès refusé.');
        setTimeout(() => setStatus('IDLE'), 2000);
      }
    }, 1500);
  };

  const handleSocialClick = async (provider: 'google' | 'facebook') => {
    setSocialProvider(provider);
    setStatus('VERIFYING');
    await socialLogin(provider);
    setStatus('SUCCESS');
    setTimeout(() => navigate('/dashboard'), 800);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-blue/5 rounded-full blur-[120px] animate-pulse"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="glass-panel p-8 md:p-10 rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl relative overflow-hidden">
          
          {/* Scanning Effect Overlay */}
          {status === 'SCANNING' && (
            <div className="absolute inset-0 z-20 bg-dark-900/80 flex flex-col items-center justify-center">
              <div className="relative">
                <Fingerprint className="w-24 h-24 text-accent-teal animate-pulse" />
                <div className="absolute inset-0 border-t-2 border-accent-teal animate-ping h-full rounded-full opacity-20"></div>
              </div>
              <p className="text-accent-teal mt-6 font-mono text-sm tracking-widest uppercase animate-pulse">Analyse Biométrique...</p>
            </div>
          )}

           {/* Success Overlay */}
           {status === 'SUCCESS' && (
            <div className="absolute inset-0 z-20 bg-green-500/10 backdrop-blur-sm flex flex-col items-center justify-center border-2 border-green-500 rounded-3xl">
              <div className="p-4 bg-green-500 rounded-full mb-4 shadow-[0_0_30px_rgba(72,187,120,0.5)]">
                 <ShieldCheck className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">Accès Autorisé</h3>
              <p className="text-green-400 mt-2 font-mono text-xs">Redirection sécurisée...</p>
            </div>
          )}

          <div className="text-center mb-8">
            <h1 className="text-3xl font-display font-bold text-white mb-2">
              {isLogin ? 'Connexion Sécurisée' : 'Rejoindre l\'Elite'}
            </h1>
            <p className="text-gray-400 text-sm">
              {isLogin ? 'Accédez à votre assistant IA personnel' : 'Créez votre identité numérique universelle'}
            </p>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3 mb-8">
            <button
              onClick={() => handleSocialClick('google')}
              disabled={status !== 'IDLE'}
              className="w-full bg-white text-gray-800 hover:bg-gray-100 font-bold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg transform active:scale-95"
            >
              {socialProvider === 'google' && status === 'VERIFYING' ? (
                 <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : (
                 <GoogleIcon />
              )}
              Continuer avec Google
            </button>
            
            <button
              onClick={() => handleSocialClick('facebook')}
              disabled={status !== 'IDLE'}
              className="w-full bg-[#1877F2] hover:bg-[#156cd1] text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg transform active:scale-95"
            >
              {socialProvider === 'facebook' && status === 'VERIFYING' ? (
                 <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : (
                 <Facebook className="w-5 h-5 mr-3 fill-white" />
              )}
              Continuer avec Facebook
            </button>
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#12121a] text-gray-500 uppercase text-xs font-bold tracking-wider">Ou via Email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-primary-blue transition-colors" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 bg-dark-800/50 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue transition-all"
                  placeholder="nom@exemple.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Mot de passe</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-primary-blue transition-colors" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-12 pr-12 py-4 bg-dark-800/50 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue transition-all"
                  placeholder="••••••••••••"
                  required
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-white transition-colors"
                >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm text-center animate-shake">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={status !== 'IDLE' && status !== 'ERROR'}
              className="w-full py-4 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 border border-white/10 text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-lg transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center relative overflow-hidden group"
            >
              {(status === 'SCANNING' || status === 'VERIFYING') && (
                  <div className="absolute inset-0 bg-primary-blue/10 animate-pulse transition-opacity duration-300"></div>
              )}
              <span className="relative z-10 flex items-center">
                {status === 'SCANNING' || status === 'VERIFYING' ? (
                  <>
                     <Loader2 className="w-5 h-5 animate-spin mr-2" />
                     {isLogin ? 'Authentification...' : 'Création en cours...'}
                  </>
                ) : (
                  <>
                    {isLogin ? 'Se Connecter' : 'Créer Compte'}
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => {
                 setIsLogin(!isLogin);
                 setEmail('');
                 setPassword('');
                 setErrorMsg('');
              }}
              className="text-gray-400 hover:text-white text-sm transition-colors hover:underline underline-offset-4"
            >
              {isLogin ? "Pas encore de compte ? Créer un accès" : "Déjà membre ? Se connecter"}
            </button>
          </div>
          
          <div className="mt-8 flex justify-center space-x-4">
             <div className="h-1 w-12 bg-white/10 rounded-full"></div>
             <div className="h-1 w-12 bg-white/10 rounded-full"></div>
             <div className="h-1 w-12 bg-white/10 rounded-full"></div>
          </div>
        </div>
        
        <p className="text-center text-gray-600 text-xs mt-6 font-mono">
          SECURE CONNECTION • 256-BIT ENCRYPTION • BIOMETRIC READY
        </p>
      </div>
    </div>
  );
};

export default Auth;
