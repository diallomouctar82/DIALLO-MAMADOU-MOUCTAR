
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie } from 'recharts';
import { Users, MessageCircle, Zap, Activity, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

const COLORS = ['#667eea', '#764ba2', '#00c9b7', '#f4c430', '#FF8042'];

const data = [
  { name: 'Lun', msg: 400, users: 240 },
  { name: 'Mar', msg: 300, users: 139 },
  { name: 'Mer', msg: 200, users: 980 },
  { name: 'Jeu', msg: 278, users: 390 },
  { name: 'Ven', msg: 189, users: 480 },
  { name: 'Sam', msg: 239, users: 380 },
  { name: 'Dim', msg: 349, users: 430 },
];

const channelData = [
  { name: 'WhatsApp', value: 45 },
  { name: 'WebChat', value: 25 },
  { name: 'Telegram', value: 20 },
  { name: 'Messenger', value: 10 },
];

const AdminOverview: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Conversations', value: '12,450', trend: '+12.5%', up: true, icon: MessageCircle, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Utilisateurs Actifs', value: '3,240', trend: '+8.3%', up: true, icon: Users, color: 'text-green-400', bg: 'bg-green-500/10' },
          { label: 'Satisfaction', value: '4.8/5', trend: '+2.1%', up: true, icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
          { label: 'Coût API', value: '$42.50', trend: '-15%', up: false, icon: DollarSign, color: 'text-purple-400', bg: 'bg-purple-500/10' }, // Good if cost goes down? Depends on context, here we'll assume trending down is neutral or good
        ].map((kpi, i) => (
          <div key={i} className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${kpi.bg}`}>
                <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${kpi.up ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {kpi.trend}
              </span>
            </div>
            <h3 className="text-3xl font-display font-bold text-white mb-1">{kpi.value}</h3>
            <p className="text-sm text-gray-400">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Timeline Area Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-primary-blue" />
            Évolution du Trafic
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorMsg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#667eea" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#4a5568" />
                <YAxis stroke="#4a5568" />
                <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', borderColor: '#2d3748', color: '#fff' }} />
                <Area type="monotone" dataKey="msg" stroke="#667eea" fillOpacity={1} fill="url(#colorMsg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Channel Distribution Pie Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-accent-teal" />
            Répartition par Canal
          </h3>
          <div className="flex flex-col sm:flex-row items-center">
            <div className="w-full h-64 sm:w-1/2">
                <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                    data={channelData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    >
                    {channelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', borderColor: '#2d3748', color: '#fff' }} />
                </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="w-full sm:w-1/2 space-y-4">
                {channelData.map((entry, index) => (
                    <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                            <span className="text-gray-300 text-sm">{entry.name}</span>
                        </div>
                        <span className="font-bold text-white">{entry.value}%</span>
                    </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
