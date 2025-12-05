
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import { ShieldAlert, Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  navigate: (path: string) => void;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles, navigate }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-dark-900 text-white">
        <Loader2 className="w-12 h-12 animate-spin text-primary-blue mb-4" />
        <p className="text-gray-400 font-mono text-sm">Vérification des protocoles de sécurité...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    setTimeout(() => navigate('/auth'), 100);
    return null;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-dark-900 p-4">
        <div className="glass-panel p-8 rounded-2xl border border-red-500/30 text-center max-w-md">
          <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-white mb-2">Accès Refusé</h1>
          <p className="text-gray-400 mb-6">
            Votre accréditation de sécurité (Niveau {user.role}) est insuffisante pour accéder à cette zone classifiée.
          </p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
          >
            Retour au Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
