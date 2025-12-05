
import React, { useState } from 'react';
import { Globe, Menu, X, User, ShieldCheck, LogOut, Lock, PanelLeftOpen, PanelLeftClose, Phone } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import { AGENTS } from '../constants';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  navigate: (path: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, navigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // État pour la barre latérale des agents
  const { user, isAuthenticated, logout } = useAuth();

  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Agents', path: '#agents' },
    { name: 'Prix', path: '#pricing' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const handleAgentCall = (e: React.MouseEvent, agentId: string) => {
    e.stopPropagation();
    navigate(`/agent/${agentId}/call`);
  };

  // Détermine si on doit afficher la sidebar (par exemple, caché sur la page d'accueil si souhaité, ou visible partout)
  // Pour cet exemple, on l'affiche si l'utilisateur est connecté, pour faciliter l'accès aux agents
  const showSidebar = isAuthenticated;

  return (
    <div className="min-h-screen flex flex-col relative bg-dark-900 text-white overflow-hidden font-body selection:bg-accent-teal/30 selection:text-white">
      {/* Dynamic Background */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-blue/10 rounded-full mix-blend-screen filter blur-[100px] animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary-purple/10 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000"></div>
        <div className="absolute top-[40%] left-[40%] w-[20%] h-[20%] bg-accent-teal/5 rounded-full mix-blend-screen filter blur-[80px] animate-blob animation-delay-4000"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
      </div>

      {/* Header */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${currentPage === '/' ? 'bg-transparent' : 'glass-panel border-b border-white/5'}`}>
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center">
              {/* Sidebar Toggle Button (Visible only if authenticated) */}
              {showSidebar && (
                <button 
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="mr-4 p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5 hidden md:block"
                  title={isSidebarOpen ? "Masquer la liste des agents" : "Afficher les agents"}
                >
                  {isSidebarOpen ? <PanelLeftClose className="w-6 h-6" /> : <PanelLeftOpen className="w-6 h-6" />}
                </button>
              )}

              <div className="flex items-center cursor-pointer group" onClick={() => navigate('/')}>
                <div className="relative mr-3">
                  <Globe className="h-8 w-8 text-primary-blue group-hover:rotate-180 transition-transform duration-700 ease-in-out" />
                  <div className="absolute inset-0 bg-primary-blue blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div>
                </div>
                <span className="font-display font-bold text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 hidden sm:block">
                  LE MONDE À VOUS
                </span>
                <span className="font-display font-bold text-xl tracking-wider text-white sm:hidden">LMAV</span>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <div className="flex items-baseline space-x-6">
                {navLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => {
                      if (link.path.startsWith('#') && currentPage === '/') {
                        const element = document.getElementById(link.path.substring(1));
                        element?.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        navigate(link.path);
                      }
                    }}
                    className={`text-sm font-medium transition-all duration-300 relative group ${
                      currentPage === link.path ? 'text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {link.name}
                    <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-teal transition-all duration-300 group-hover:w-full ${currentPage === link.path ? 'w-full' : ''}`}></span>
                  </button>
                ))}
              </div>

              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => navigate('/dashboard')}
                    className="glass-panel border border-white/10 hover:border-primary-blue/50 text-white px-4 py-2 rounded-full font-medium transition-all duration-300 flex items-center group"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary-blue to-primary-purple p-[1px] mr-2">
                        <div className="w-full h-full rounded-full bg-dark-900 flex items-center justify-center">
                             <User className="w-3 h-3" />
                        </div>
                    </div>
                    <span className="text-sm mr-2">{user?.name.split(' ')[0]}</span>
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                    title="Déconnexion sécurisée"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => navigate('/auth')}
                  className="bg-white text-dark-900 hover:bg-gray-100 px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transform hover:-translate-y-0.5"
                >
                  Connexion
                </button>
              )}
            </div>

            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/5 focus:outline-none"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden glass-panel border-b border-white/10 absolute w-full z-50">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => {
                    navigate(link.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-4 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/5"
                >
                  {link.name}
                </button>
              ))}
              {/* Mobile Agent List */}
              {isAuthenticated && (
                <div className="border-t border-white/10 pt-2 mt-2">
                  <p className="px-3 py-2 text-xs font-bold text-gray-500 uppercase">Vos Agents</p>
                  {AGENTS.slice(0, 5).map(agent => (
                     <div key={agent.id} className="flex items-center justify-between pr-3">
                         <button
                            onClick={() => {
                              navigate(`/agent/${agent.id}`);
                              setIsMobileMenuOpen(false);
                            }}
                            className="flex flex-1 items-center px-3 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5"
                         >
                           <agent.icon className="w-4 h-4 mr-3" />
                           {agent.name}
                         </button>
                         <button
                            onClick={(e) => {
                                handleAgentCall(e, agent.id);
                                setIsMobileMenuOpen(false);
                            }}
                            className="p-2 text-green-500 hover:text-white hover:bg-green-500 rounded-full transition-colors"
                         >
                             <Phone className="w-4 h-4" />
                         </button>
                     </div>
                  ))}
                  <button onClick={() => {navigate('/dashboard'); setIsMobileMenuOpen(false);}} className="block w-full text-left px-3 py-4 text-primary-blue font-bold">Voir Dashboard</button>
                </div>
              )}
              {isAuthenticated ? (
                <button onClick={handleLogout} className="block w-full text-left px-3 py-4 text-red-400">Déconnexion</button>
              ) : (
                 <button onClick={() => navigate('/auth')} className="block w-full text-left px-3 py-4 text-white font-bold bg-white/5">Se connecter</button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Layout Area with Sidebar */}
      <div className="flex flex-1 relative overflow-hidden">
        
        {/* Sidebar Component */}
        {showSidebar && (
            <Sidebar 
                isOpen={isSidebarOpen}
                currentPage={currentPage}
                navigate={navigate}
                onCall={handleAgentCall}
            />
        )}

        {/* Main Content */}
        <main className="flex-1 min-w-0 relative z-10 transition-all duration-300 overflow-y-auto h-[calc(100vh-80px)]">
          {children}
        </main>
      </div>

      {/* Footer */}
      {!isAuthenticated && (
        <footer className="glass-panel border-t border-white/5 pt-12 pb-8 relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                <div className="col-span-1 md:col-span-1">
                <div className="flex items-center mb-6">
                    <Globe className="h-6 w-6 text-primary-blue mr-2" />
                    <span className="font-display font-bold text-lg tracking-wider">LMAV</span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    Plateforme d'intelligence artificielle souveraine pour l'assistance mondiale. Sécurité de niveau militaire.
                </p>
                <div className="flex items-center space-x-2 text-xs text-accent-teal border border-accent-teal/20 bg-accent-teal/5 px-3 py-1 rounded-full w-fit">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Système Sécurisé SSL 256-bit</span>
                </div>
                </div>
                
                {['Plateforme', 'Légal', 'Contact'].map((title, i) => (
                    <div key={i}>
                    <h3 className="text-white font-display font-bold mb-6">{title}</h3>
                    <ul className="space-y-4 text-sm text-gray-400">
                        {[1,2,3].map(j => (
                            <li key={j}><a href="#" className="hover:text-primary-blue transition-colors flex items-center"><span className="w-1 h-1 bg-gray-600 rounded-full mr-2"></span> Link {j}</a></li>
                        ))}
                    </ul>
                    </div>
                ))}
            </div>
            
            <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center">
                <p className="text-gray-600 text-xs">© 2025 LE MONDE À VOUS. Tous droits réservés.</p>
                
                {isAuthenticated && user?.role === UserRole.SUPER_ADMIN && (
                    <button onClick={() => navigate('/admin')} className="mt-4 md:mt-0 px-4 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs rounded-full border border-red-500/20 transition-all flex items-center">
                        <Lock className="w-3 h-3 mr-2" /> PORTAIL ADMINISTRATEUR
                    </button>
                )}

                <div className="flex space-x-6 mt-4 md:mt-0">
                <div className="text-xs text-gray-600 font-mono">SERVER: PARIS-1 • PING: 12ms</div>
                </div>
            </div>
            </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;
