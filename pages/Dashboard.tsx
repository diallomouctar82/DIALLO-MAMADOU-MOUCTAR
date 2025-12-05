
import React from 'react';
import { AGENTS } from '../constants';
import AgentCard from '../components/AgentCard';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { User, CreditCard, MessageSquare, TrendingUp, Settings, Zap, Gift, ArrowRight } from 'lucide-react';

interface DashboardProps {
  navigate: (path: string) => void;
}

const data = [
  { name: 'Admin', value: 400 },
  { name: 'Voyage', value: 300 },
  { name: 'Emploi', value: 300 },
  { name: 'Santé', value: 200 },
];
const COLORS = ['#667eea', '#764ba2', '#00c9b7', '#f4c430'];

const activityData = [
  { name: 'Lun', msg: 12 },
  { name: 'Mar', msg: 19 },
  { name: 'Mer', msg: 8 },
  { name: 'Jeu', msg: 24 },
  { name: 'Ven', msg: 15 },
  { name: 'Sam', msg: 5 },
  { name: 'Dim', msg: 3 },
];

const Dashboard: React.FC<DashboardProps> = ({ navigate }) => {
  const handleAgentCall = (agentId: string) => {
    // Navigate with a query param or special hash to trigger voice mode
    // Since we use hash router in App.tsx, we can't easily pass state
    // We will stick to the /agent/:id convention, but the AgentChat component will handle a prop or we can update the URL hash to /agent/:id/call
    window.location.hash = `/agent/${agentId}/call`;
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)]">
      {/* Sidebar (Desktop) */}
      <aside className="hidden lg:flex w-64 flex-col glass-panel border-r border-white/10 p-6 space-y-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-blue to-primary-purple p-0.5">
            <div className="w-full h-full rounded-full bg-dark-900 flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <h3 className="font-bold text-white">Mamadou D.</h3>
            <span className="text-xs text-green-400 border border-green-400/30 px-2 py-0.5 rounded-full">Essai Gratuit</span>
          </div>
        </div>
        
        <nav className="space-y-2">
            {[
                { name: 'Vue Globale', icon: TrendingUp, path: '/dashboard', active: true },
                { name: 'Conversations', icon: MessageSquare, path: '/conversations', active: false },
                { name: 'Crédits & Factures', icon: CreditCard, path: '/billing', active: false },
                { name: 'Paramètres', icon: Settings, path: '/settings', active: false },
            ].map((item) => (
                <button 
                    key={item.name}
                    onClick={() => item.path !== '/dashboard' ? navigate(item.path) : null}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                        item.active ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                </button>
            ))}
        </nav>

        <div className="mt-auto p-4 rounded-xl bg-gradient-to-br from-primary-blue/20 to-primary-purple/20 border border-white/10">
            <div className="flex items-center space-x-2 mb-2">
                <Gift className="w-4 h-4 text-pink-400" />
                <span className="text-xs font-bold text-white">Parrainage Actif</span>
            </div>
            <p className="text-xs text-gray-400 mb-3">Gagnez 10% sur les recharges de vos amis.</p>
            <button 
                onClick={() => navigate('/billing')}
                className="w-full py-2 bg-white/10 hover:bg-white/20 text-white text-xs rounded-lg transition-colors border border-white/10"
            >
                Voir mon code
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8">
            <header className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white">Tableau de Bord</h1>
                    <p className="text-gray-400">Bienvenue, voici votre résumé d'activité.</p>
                </div>
                <button 
                    onClick={() => navigate('/billing')}
                    className="hidden sm:flex items-center px-4 py-2 bg-gradient-to-r from-accent-gold to-orange-500 rounded-full text-dark-900 font-bold hover:shadow-lg hover:shadow-orange-500/20 transition-all"
                >
                    <Zap className="w-4 h-4 mr-2" />
                    320 Crédits
                </button>
            </header>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="glass-panel p-6 rounded-2xl border border-white/10">
                    <div className="text-gray-400 text-sm mb-2">Conversations</div>
                    <div className="text-3xl font-bold text-white">156</div>
                    <div className="text-green-400 text-xs mt-2 flex items-center">↑ 12% ce mois</div>
                </div>
                
                {/* Credit Widget */}
                <div 
                    onClick={() => navigate('/billing')}
                    className="glass-panel p-6 rounded-2xl border border-white/10 cursor-pointer hover:bg-white/5 transition-colors group"
                >
                    <div className="flex justify-between items-start mb-2">
                        <div className="text-gray-400 text-sm">Crédits Restants</div>
                        <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
                    </div>
                    <div className="text-3xl font-bold text-accent-gold">320</div>
                    <div className="text-gray-500 text-xs mt-2">~ 30 messages</div>
                </div>

                {/* Trial Widget */}
                <div className="glass-panel p-6 rounded-2xl border border-green-500/30 bg-green-500/5">
                    <div className="text-green-400 text-sm mb-2 font-medium">Essai Gratuit</div>
                    <div className="text-3xl font-bold text-white">24 Jours</div>
                    <div className="text-gray-500 text-xs mt-2">Expire le 01/06/2025</div>
                </div>

                {/* Referral Widget */}
                <div className="glass-panel p-6 rounded-2xl border border-pink-500/30 bg-pink-500/5">
                     <div className="text-pink-400 text-sm mb-2 font-medium">Gains Parrainage</div>
                    <div className="text-3xl font-bold text-white">450 <span className="text-sm font-normal text-gray-400">crédits</span></div>
                    <div className="text-gray-500 text-xs mt-2">3 filleuls actifs</div>
                </div>
            </div>

            {/* Quick Access Grid */}
            <div>
                <h3 className="text-lg font-bold text-white mb-6">Accès Rapide aux Agents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {AGENTS.slice(0, 4).map(agent => (
                        <AgentCard 
                            key={agent.id} 
                            agent={agent} 
                            onClick={() => navigate(`/agent/${agent.id}`)} 
                            onCall={() => handleAgentCall(agent.id)}
                            compact 
                        />
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart Section */}
                <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/10">
                    <h3 className="text-lg font-bold text-white mb-6">Activité Hebdomadaire</h3>
                    <div className="h-64">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={activityData}>
                                <XAxis dataKey="name" stroke="#4a5568" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#4a5568" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1a1a2e', borderColor: '#2d3748', color: '#fff' }}
                                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                                />
                                <Bar dataKey="msg" fill="#667eea" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Agent Usage Distribution */}
                <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col items-center justify-center">
                    <h3 className="text-lg font-bold text-white mb-2 self-start">Utilisation par Agent</h3>
                    <div className="w-full h-48 relative">
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={data}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="text-2xl font-bold text-white">1200</span>
                        </div>
                    </div>
                    <div className="w-full mt-4 space-y-2">
                        {data.map((entry, index) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                                <div className="flex items-center">
                                    <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index] }}></span>
                                    <span className="text-gray-300">{entry.name}</span>
                                </div>
                                <span className="text-gray-500 font-mono">{entry.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
