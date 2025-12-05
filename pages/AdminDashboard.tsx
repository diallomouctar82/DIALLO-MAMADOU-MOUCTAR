
import React, { useState } from 'react';
import { AGENTS, DEPLOYMENT_CONFIG } from '../constants';
import { User, UserRole, UserStatus } from '../types';
import { 
  Save, Server, Cpu, MessageCircle, Users, Globe, Shield, Lock, Search, MoreVertical, Trash2, Ban, CheckCircle, Zap, Webhook, Activity, ArrowRight, PlayCircle, BookOpen, Key, AlertTriangle, HelpCircle, FileText, CheckSquare, BarChart2, LayoutDashboard, Database, Terminal, Mic
} from 'lucide-react';

// Sub-components
import AdminOverview from '../components/admin/AdminOverview';
import AdminKnowledge from '../components/admin/AdminKnowledge';
import AdminLogs from '../components/admin/AdminLogs';
import AdminWorkflows from '../components/admin/AdminWorkflows';

interface AdminDashboardProps {
  navigate: (path: string) => void;
}

// Mock Users for Management
const MOCK_USERS_LIST: User[] = [
    { id: 'u1', name: 'Jean Dupont', email: 'jean@example.com', role: UserRole.USER, status: UserStatus.ACTIVE, credits: 150, isVerified: true, twoFactorEnabled: false, referralCode: 'JEAN1' },
    { id: 'u2', name: 'Marie Curie', email: 'marie@example.com', role: UserRole.USER, status: UserStatus.ACTIVE, credits: 500, isVerified: true, twoFactorEnabled: true, referralCode: 'MARIE2' },
    { id: 'u3', name: 'Spammer Bot', email: 'bot@spam.com', role: UserRole.USER, status: UserStatus.BANNED, credits: 0, isVerified: false, twoFactorEnabled: false, referralCode: 'SPAM3' },
    { id: 'u4', name: 'Admin User', email: 'admin@lemondeavous.com', role: UserRole.SUPER_ADMIN, status: UserStatus.ACTIVE, credits: 999999, isVerified: true, twoFactorEnabled: true, referralCode: 'ADMIN' },
];

const AdminDashboard: React.FC<AdminDashboardProps> = ({ navigate }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'agents' | 'channels' | 'knowledge' | 'webhooks' | 'logs' | 'deployment'>('overview');
  const [isSaving, setIsSaving] = useState<string | null>(null);
  
  // State for Users Management
  const [users, setUsers] = useState<User[]>(MOCK_USERS_LIST);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock save function
  const handleSave = (section: string) => {
    setIsSaving(section);
    setTimeout(() => {
      setIsSaving(null);
      alert(`Configuration ${section} sauvegardée avec succès !`);
    }, 1000);
  };

  // User Actions
  const handleUserAction = (userId: string, action: 'BAN' | 'DELETE' | 'VIP' | 'UNBAN') => {
    setUsers(users.map(u => {
        if (u.id !== userId) return u;
        
        switch(action) {
            case 'BAN': return { ...u, status: UserStatus.BANNED };
            case 'UNBAN': return { ...u, status: UserStatus.ACTIVE };
            case 'VIP': return { ...u, hasLifetimeAccess: true, credits: 999999 };
            case 'DELETE': return { ...u, status: UserStatus.SUSPENDED }; // Soft delete
            default: return u;
        }
    }).filter(u => action !== 'DELETE' || u.status !== UserStatus.SUSPENDED)); // Remove if deleted
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const InputField = ({ label, placeholder, type = "text", defaultValue = "" }: { label: string, placeholder: string, type?: string, defaultValue?: string }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-400 mb-2">{label}</label>
      <div className="relative">
        <input 
          type={type} 
          placeholder={placeholder}
          defaultValue={defaultValue}
          className="w-full bg-dark-800 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue transition-all duration-200"
        />
        {type === "password" && <Lock className="absolute right-3 top-3 w-4 h-4 text-gray-500" />}
      </div>
    </div>
  );

  return (
    <div className="flex min-h-[calc(100vh-80px)]">
      {/* Admin Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col glass-panel border-r border-white/10 p-6">
        <div className="flex items-center space-x-3 mb-8 px-2">
          <div className="p-2 bg-indigo-500/20 rounded-lg border border-indigo-500/30">
             <Shield className="w-6 h-6 text-primary-purple" />
          </div>
          <div>
            <h2 className="font-display font-bold text-white text-lg">Admin OS</h2>
            <p className="text-xs text-gray-500">v2.5.0 • Stable</p>
          </div>
        </div>
        
        <nav className="space-y-1">
            <p className="px-4 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 mt-2">Principal</p>
            {[
                { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
                { id: 'users', label: 'Utilisateurs', icon: Users },
                { id: 'agents', label: 'Agents IA', icon: Cpu },
                { id: 'channels', label: 'Canaux', icon: MessageCircle },
            ].map(item => (
                <button 
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${activeTab === item.id ? 'bg-primary-blue/20 text-blue-300 border border-primary-blue/30 shadow-lg shadow-blue-500/10' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                >
                    <item.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                </button>
            ))}

            <p className="px-4 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 mt-6">Système</p>
            {[
                { id: 'knowledge', label: 'Knowledge Base', icon: Database },
                { id: 'webhooks', label: 'Workflows', icon: Webhook },
                { id: 'logs', label: 'Logs & Monitoring', icon: Terminal },
                { id: 'deployment', label: 'Déploiement', icon: BookOpen },
            ].map(item => (
                <button 
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${activeTab === item.id ? 'bg-primary-blue/20 text-blue-300 border border-primary-blue/30 shadow-lg shadow-blue-500/10' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                >
                    <item.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                </button>
            ))}
        </nav>

        <div className="mt-auto pt-8 border-t border-white/10">
            <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-red-400 mb-2">
                    <AlertTriangle className="w-4 h-4" />
                    <h4 className="text-sm font-bold">Zone Danger</h4>
                </div>
                <button className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold rounded border border-red-500/20 transition-colors">
                    Verrouillage d'Urgence
                </button>
            </div>
        </div>
      </aside>

      {/* Main Configuration Area */}
      <div className="flex-1 p-6 lg:p-10 overflow-y-auto bg-dark-900">
        <div className="max-w-7xl mx-auto">
            
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl font-display font-bold text-white mb-2 flex items-center">
                    {activeTab === 'overview' && 'Vue d\'Ensemble'}
                    {activeTab === 'users' && 'Gestion des Utilisateurs'}
                    {activeTab === 'agents' && 'Configuration des Agents'}
                    {activeTab === 'channels' && 'Canaux & Intégrations'}
                    {activeTab === 'knowledge' && 'Base de Connaissances'}
                    {activeTab === 'webhooks' && 'Webhooks & Automatisations'}
                    {activeTab === 'logs' && 'Logs Système'}
                    {activeTab === 'deployment' && 'Guide de Déploiement'}
                </h1>
                <p className="text-gray-400 text-sm">
                    {activeTab === 'overview' ? 'Monitoring en temps réel de la plateforme.' : 
                     activeTab === 'knowledge' ? 'Gérez les documents et le contexte vectoriel des agents.' :
                     activeTab === 'logs' ? 'Inspectez les activités système et les erreurs.' :
                     activeTab === 'webhooks' ? 'Orchestration des flux WhatsApp, n8n et ElevenLabs.' :
                     'Gérez les paramètres et configurations de la plateforme.'}
                </p>
            </div>
            {activeTab !== 'overview' && activeTab !== 'logs' && activeTab !== 'deployment' && activeTab !== 'knowledge' && activeTab !== 'webhooks' && (
                <button 
                    onClick={() => handleSave(activeTab)}
                    disabled={isSaving === activeTab}
                    className="flex items-center space-x-2 bg-white text-dark-900 hover:bg-gray-200 px-5 py-2.5 rounded-lg font-bold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                    {isSaving === activeTab ? <Globe className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>Sauvegarder</span>
                </button>
            )}
          </div>

          {/* === MODULE CONTENT === */}

          {activeTab === 'overview' && <AdminOverview />}
          
          {activeTab === 'knowledge' && <AdminKnowledge />}
          
          {activeTab === 'logs' && <AdminLogs />}

          {/* WEBHOOKS / WORKFLOWS TAB (NEW SYSTEM) */}
          {activeTab === 'webhooks' && (
            <div className="space-y-6">
                {/* Active Integration Banner */}
                <div className="glass-panel p-6 rounded-xl border border-green-500/30 bg-green-500/5 flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                    <div className="flex items-center gap-6 relative z-10">
                        <div className="flex items-center bg-dark-900/50 p-3 rounded-xl border border-white/5">
                            <div className="p-2 bg-green-500/20 rounded-lg mr-2"><MessageCircle className="w-5 h-5 text-green-500"/></div>
                            <ArrowRight className="w-4 h-4 text-gray-500 mx-1"/>
                            <div className="p-2 bg-blue-500/20 rounded-lg mx-2"><Server className="w-5 h-5 text-blue-500"/></div>
                            <ArrowRight className="w-4 h-4 text-gray-500 mx-1"/>
                            <div className="p-2 bg-purple-500/20 rounded-lg ml-2"><Mic className="w-5 h-5 text-purple-500"/></div>
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-lg flex items-center">
                                Pipeline WhatsApp Vocal Actif
                                <span className="ml-3 flex h-2 w-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                            </h3>
                            <p className="text-sm text-green-400/80 mt-1">Webhook connecté • ElevenLabs Ready • Latence: 120ms</p>
                        </div>
                    </div>
                    <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-lg border border-white/10 transition-colors z-10">
                        Configurer
                    </button>
                </div>
                
                <AdminWorkflows />
            </div>
          )}

          {/* USERS MANAGEMENT TAB */}
          {activeTab === 'users' && (
            <div className="space-y-6 animate-fade-in-up">
                {/* Search Bar */}
                <div className="glass-panel p-4 rounded-xl border border-white/10 flex items-center">
                    <Search className="w-5 h-5 text-gray-400 mr-3" />
                    <input 
                        type="text" 
                        placeholder="Rechercher par nom ou email..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-transparent border-none focus:ring-0 text-white w-full placeholder-gray-500 focus:outline-none"
                    />
                </div>

                <div className="glass-panel rounded-xl border border-white/10 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 border-b border-white/10">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase">Utilisateur</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase">Rôle</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase">Statut</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase">Crédits</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredUsers.map((u) => (
                                <tr key={u.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center mr-3">
                                                <span className="text-xs font-bold">{u.name.charAt(0)}</span>
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-white">{u.name}</div>
                                                <div className="text-xs text-gray-500">{u.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs ${u.role === UserRole.SUPER_ADMIN ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-700 text-gray-300'}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs flex items-center w-fit ${
                                            u.status === UserStatus.ACTIVE ? 'bg-green-500/20 text-green-400' : 
                                            u.status === UserStatus.BANNED ? 'bg-red-500/20 text-red-400' : 
                                            'bg-yellow-500/20 text-yellow-400'
                                        }`}>
                                            {u.status === UserStatus.ACTIVE && <CheckCircle className="w-3 h-3 mr-1" />}
                                            {u.status === UserStatus.BANNED && <Ban className="w-3 h-3 mr-1" />}
                                            {u.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-mono">
                                        {u.hasLifetimeAccess ? <span className="text-accent-gold">∞ VIP</span> : u.credits}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end space-x-2">
                                            {u.status === UserStatus.BANNED ? (
                                                <button onClick={() => handleUserAction(u.id, 'UNBAN')} className="p-2 text-green-400 hover:bg-green-500/10 rounded-lg" title="Débannir">
                                                    <CheckCircle className="w-4 h-4" />
                                                </button>
                                            ) : (
                                                <button onClick={() => handleUserAction(u.id, 'BAN')} className="p-2 text-orange-400 hover:bg-orange-500/10 rounded-lg" title="Bannir Temporairement">
                                                    <Ban className="w-4 h-4" />
                                                </button>
                                            )}
                                            
                                            {!u.hasLifetimeAccess && (
                                                <button onClick={() => handleUserAction(u.id, 'VIP')} className="p-2 text-accent-gold hover:bg-yellow-500/10 rounded-lg" title="Donner Accès Libre (VIP)">
                                                    <Zap className="w-4 h-4" />
                                                </button>
                                            )}

                                            <button onClick={() => handleUserAction(u.id, 'DELETE')} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg" title="Supprimer le compte">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
          )}

          {/* AGENTS CONFIG TAB */}
          {activeTab === 'agents' && (
            <div className="space-y-6 animate-fade-in-up">
                <div className="grid grid-cols-1 gap-6">
                    {AGENTS.map((agent) => {
                         const Icon = agent.icon;
                         return (
                            <div key={agent.id} className="glass-panel p-6 rounded-xl border border-white/5 hover:border-white/20 transition-all">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center">
                                        <div className={`p-3 rounded-lg bg-gradient-to-br ${agent.gradient} bg-opacity-10 mr-4`}>
                                            <Icon className="w-8 h-8 text-white" />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold text-white">{agent.name}</h4>
                                            <div className="flex items-center space-x-3 mt-1 text-sm text-gray-400">
                                                <span>{agent.category}</span>
                                                <span>•</span>
                                                <span className="font-mono text-xs opacity-60">ID: {agent.id}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold border ${agent.elevenLabsId ? 'border-green-500/30 text-green-400 bg-green-500/10' : 'border-gray-500/30 text-gray-500'}`}>
                                        {agent.elevenLabsId ? 'VOCAL ACTIF' : 'TEXTE SEUL'}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* ElevenLabs Config */}
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase text-gray-500 font-bold flex items-center">
                                            <Cpu className="w-3 h-3 mr-1" />
                                            ElevenLabs Agent ID
                                        </label>
                                        <input 
                                            type="text" 
                                            defaultValue={agent.elevenLabsId || ''} 
                                            placeholder="Ex: agent_7101kax5..." 
                                            className="w-full bg-dark-800 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-primary-blue outline-none font-mono transition-colors" 
                                        />
                                    </div>

                                    {/* n8n Config */}
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase text-gray-500 font-bold flex items-center">
                                            <Server className="w-3 h-3 mr-1" />
                                            n8n Workflow ID
                                        </label>
                                        <input 
                                            type="text" 
                                            defaultValue={agent.n8nWorkflowId || ''} 
                                            placeholder="Ex: workflow-abc-123" 
                                            className="w-full bg-dark-800 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-orange-500 outline-none font-mono transition-colors" 
                                        />
                                    </div>
                                </div>
                            </div>
                         );
                    })}
                </div>
            </div>
          )}

          {/* CHANNELS TAB */}
          {activeTab === 'channels' && (
            <div className="space-y-6 animate-fade-in-up">
                {/* Global Settings */}
                <div className="glass-panel p-6 rounded-xl border border-white/10">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-green-500/20 rounded-lg"><MessageCircle className="w-6 h-6 text-green-500" /></div>
                        <h3 className="text-xl font-bold text-white">WhatsApp Business API</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField label="Phone Number ID" placeholder="10594..." />
                        <InputField label="WABA ID" placeholder="10239..." />
                        <div className="md:col-span-2">
                             <InputField label="Permanent Token" placeholder="EAA..." type="password" />
                        </div>
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-xl border border-white/10">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-blue-500/20 rounded-lg"><Server className="w-6 h-6 text-blue-500" /></div>
                        <h3 className="text-xl font-bold text-white">n8n Global Config</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField label="Base URL" placeholder="https://n8n.votredomaine.com" />
                        <InputField label="API Key" placeholder="n8n_api_..." type="password" />
                    </div>
                </div>
            </div>
          )}

          {/* DEPLOYMENT GUIDE TAB */}
          {activeTab === 'deployment' && (
            <div className="space-y-8 animate-fade-in-up">
              {/* Credentials Section */}
              <section>
                <div className="flex items-center space-x-2 mb-6">
                  <Key className="w-5 h-5 text-accent-gold" />
                  <h2 className="text-xl font-bold text-white">Comptes & Identifiants Requis</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(DEPLOYMENT_CONFIG.credentials).map(([key, cred]: [string, any]) => (
                    <div key={key} className="glass-panel p-5 rounded-xl border border-white/10 hover:border-primary-blue/30 transition-all">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-white">{cred.name}</h3>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${cred.required ? 'border-red-500/30 text-red-400' : 'border-gray-500/30 text-gray-400'}`}>
                          {cred.required ? 'REQUIS' : 'OPTIONNEL'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 mb-4">{cred.notes || "Pas de notes supplémentaires."}</div>
                      
                      {cred.setup_steps && (
                        <div className="mb-4 bg-black/20 p-3 rounded-lg">
                          <p className="text-xs font-bold text-gray-300 mb-2 uppercase">Installation Rapide:</p>
                          <ul className="text-xs text-gray-500 space-y-1 list-disc pl-3">
                            {cred.setup_steps.map((step: string, idx: number) => (
                              <li key={idx}>{step}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="flex justify-between items-center mt-auto pt-3 border-t border-white/5">
                        <span className="text-xs font-mono text-gray-600">{cred.type}</span>
                        <a href={cred.documentation} target="_blank" rel="noreferrer" className="text-xs text-primary-blue hover:underline flex items-center">
                          Docs <ArrowRight className="w-3 h-3 ml-1" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Webhooks Section */}
              <section>
                 <div className="flex items-center space-x-2 mb-6">
                  <Webhook className="w-5 h-5 text-accent-teal" />
                  <h2 className="text-xl font-bold text-white">Points de Terminaison (Webhooks)</h2>
                </div>
                <div className="glass-panel rounded-xl border border-white/10 overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-white/5 border-b border-white/10">
                      <tr>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase">Service</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase">URL Path</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase">Description</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase text-right">Méthode</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                       {Object.entries(DEPLOYMENT_CONFIG.webhooks).map(([key, hook]: [string, any]) => (
                         <tr key={key} className="hover:bg-white/5 transition-colors">
                           <td className="px-6 py-4 font-bold text-white capitalize">{key}</td>
                           <td className="px-6 py-4 font-mono text-xs text-accent-teal">{hook.path}</td>
                           <td className="px-6 py-4 text-sm text-gray-400">{hook.description}</td>
                           <td className="px-6 py-4 text-right">
                             <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold rounded">{hook.method}</span>
                           </td>
                         </tr>
                       ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Workflow Import */}
              <section>
                 <div className="flex items-center space-x-2 mb-6">
                  <Zap className="w-5 h-5 text-purple-400" />
                  <h2 className="text-xl font-bold text-white">Importation Workflow n8n</h2>
                </div>
                <div className="glass-panel p-6 rounded-xl border border-white/10">
                    <div className="bg-dark-900 rounded-lg p-4 font-mono text-xs text-gray-400 overflow-x-auto max-h-64 mb-4 custom-scrollbar">
                        <pre>{JSON.stringify(DEPLOYMENT_CONFIG.workflow_json, null, 2)}</pre>
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button 
                            onClick={() => {
                                navigator.clipboard.writeText(JSON.stringify(DEPLOYMENT_CONFIG.workflow_json));
                                alert('JSON copié dans le presse-papier !');
                            }}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm border border-white/10"
                        >
                            Copier le JSON
                        </button>
                        <button className="px-4 py-2 bg-primary-blue hover:bg-blue-600 text-white rounded-lg text-sm font-bold">
                            Télécharger .json
                        </button>
                    </div>
                </div>
              </section>

              {/* Checklist Section */}
              <section>
                <div className="flex items-center space-x-2 mb-6">
                  <CheckSquare className="w-5 h-5 text-green-500" />
                  <h2 className="text-xl font-bold text-white">Checklist de Déploiement</h2>
                </div>
                <div className="space-y-4">
                  {DEPLOYMENT_CONFIG.deployment_checklist.map((step: any, idx: number) => (
                    <div key={idx} className="glass-panel p-4 rounded-xl border border-white/10 flex items-start">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-blue/20 flex items-center justify-center text-primary-blue font-bold mr-4">
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-white mb-2">{step.title}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {step.tasks.map((task: string, tIdx: number) => (
                            <div key={tIdx} className="flex items-center text-sm text-gray-400">
                              <div className="w-4 h-4 border border-gray-600 rounded mr-2 flex-shrink-0"></div>
                              {task}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Troubleshooting */}
               <section>
                <div className="flex items-center space-x-2 mb-6">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <h2 className="text-xl font-bold text-white">Dépannage Rapide</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {DEPLOYMENT_CONFIG.troubleshooting.common_issues.map((issue: any, idx: number) => (
                    <div key={idx} className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
                      <h4 className="text-red-300 font-bold mb-2 flex items-center">
                        <HelpCircle className="w-4 h-4 mr-2" />
                        {issue.issue}
                      </h4>
                      <ul className="text-xs text-gray-400 list-disc pl-4 space-y-1">
                        {issue.solutions.map((sol: string, sIdx: number) => (
                          <li key={sIdx}>{sol}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
