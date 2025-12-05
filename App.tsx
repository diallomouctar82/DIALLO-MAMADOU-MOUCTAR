
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import AgentChat from './pages/AgentChat';
import AdminDashboard from './pages/AdminDashboard';
import Billing from './pages/Billing';
import Auth from './pages/Auth';
import Checkout from './pages/Checkout';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { AGENTS, CREDIT_PACKAGES } from './constants';
import { UserRole } from './types';

const AppContent: React.FC = () => {
  const [currentPath, setCurrentPath] = useState(window.location.hash || '/');
  const [checkoutPackageId, setCheckoutPackageId] = useState<string | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      let hash = window.location.hash.slice(1);
      if (!hash) hash = '/';
      setCurrentPath(hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (path: string) => {
    window.location.hash = path;
  };

  const startCheckout = (packageId: string) => {
    setCheckoutPackageId(packageId);
  };

  const renderContent = () => {
    if (checkoutPackageId) {
        const pkg = CREDIT_PACKAGES.find(p => p.id === checkoutPackageId);
        if (pkg) {
            return (
                <Checkout 
                    packageId={checkoutPackageId} 
                    pkg={pkg}
                    onCancel={() => setCheckoutPackageId(null)} 
                    onSuccess={() => {
                        setCheckoutPackageId(null);
                        navigate('/billing');
                    }}
                />
            );
        }
    }

    if (currentPath === '/' || currentPath === '') {
      return <Home navigate={navigate} />;
    }

    if (currentPath === '/auth') {
        return <Auth navigate={navigate} />;
    }
    
    if (currentPath === '/dashboard') {
      return (
        <ProtectedRoute navigate={navigate}>
          <Dashboard navigate={navigate} />
        </ProtectedRoute>
      );
    }
    
    if (currentPath === '/admin') {
      return (
        <ProtectedRoute navigate={navigate} allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}>
           <AdminDashboard navigate={navigate} />
        </ProtectedRoute>
      );
    }

    if (currentPath === '/billing') {
        return (
            <ProtectedRoute navigate={navigate}>
                <Billing navigate={navigate} onCheckout={startCheckout} />
            </ProtectedRoute>
        );
    }

    if (currentPath.startsWith('/agent/')) {
      // Check for /call suffix
      const isCall = currentPath.endsWith('/call');
      // Extract ID: /agent/123/call -> 123
      const agentId = currentPath.replace('/agent/', '').replace('/call', '');
      
      const agent = AGENTS.find(a => a.id === agentId);
      if (agent) {
        return (
            <ProtectedRoute navigate={navigate}>
                <AgentChat 
                    agent={agent} 
                    onBack={() => navigate('/dashboard')} 
                    initialMode={isCall ? 'call' : 'chat'}
                />
            </ProtectedRoute>
        );
      }
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h1 className="text-4xl font-bold text-white mb-4">404</h1>
        <p className="text-gray-400">Page non trouvée</p>
        <button onClick={() => navigate('/')} className="mt-8 text-primary-blue hover:underline">
          Retour à l'accueil
        </button>
      </div>
    );
  };

  return (
    <Layout currentPage={currentPath} navigate={navigate}>
      {renderContent()}
    </Layout>
  );
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
};

export default App;
