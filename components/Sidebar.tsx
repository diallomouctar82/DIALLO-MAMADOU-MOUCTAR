import React from 'react';
import { Bot, ChevronRight, Phone } from 'lucide-react';
import { AGENTS } from '../constants';

interface SidebarProps {
  isOpen: boolean;
  currentPage: string;
  navigate: (path: string) => void;
  onCall: (e: React.MouseEvent, agentId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, currentPage, navigate, onCall }) => {
  return (
    <aside 
        className={`hidden md:flex flex-col border-r border-white/10 bg-dark-900/50 backdrop-blur-xl transition-all duration-300 ease-in-out relative z-20 ${
            isOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full opacity-0 overflow-hidden'
        }`}
    >
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <span className="font-bold text-sm text-gray-400 uppercase tracking-wider flex items-center">
                <Bot className="w-4 h-4 mr-2" />
                Mes Agents
            </span>
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" title="Système Opérationnel"></div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
            {AGENTS.map((agent) => {
                const Icon = agent.icon;
                const isActive = currentPage === `/agent/${agent.id}`;
                
                return (
                    <div key={agent.id} className="relative group">
                        <button
                            onClick={() => navigate(`/agent/${agent.id}`)}
                            className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 border text-left relative overflow-hidden ${
                                isActive 
                                ? 'bg-white/10 border-primary-blue/50 text-white shadow-lg' 
                                : 'bg-transparent border-transparent text-gray-400 hover:bg-white/5 hover:text-white hover:border-white/10'
                            }`}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-r ${agent.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                            <div className={`p-2 rounded-lg bg-gradient-to-br ${agent.gradient} bg-opacity-10 mr-3 shrink-0`}>
                                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                            </div>
                            <div className="truncate pr-8">
                                <div className="font-medium text-sm truncate">{agent.name}</div>
                                <div className="text-[10px] opacity-60 truncate">{agent.category}</div>
                            </div>
                            {isActive && (
                                <ChevronRight className="w-4 h-4 ml-auto text-primary-blue absolute right-2" />
                            )}
                        </button>
                        {/* Direct Call Button on Hover */}
                        <button
                            onClick={(e) => onCall(e, agent.id)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-dark-800 rounded-full text-green-500 opacity-0 group-hover:opacity-100 hover:bg-green-500 hover:text-white transition-all shadow-lg border border-white/10 hover:border-green-500"
                            title="Appel Vocal Direct"
                        >
                            <Phone className="w-3 h-3" />
                        </button>
                    </div>
                );
            })}
        </div>

        <div className="p-4 border-t border-white/10 bg-black/20">
            <button 
                onClick={() => navigate('/dashboard')}
                className="w-full py-2 px-4 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-center text-gray-300 hover:text-white transition-colors border border-white/5"
            >
                Retour au Tableau de Bord
            </button>
        </div>
    </aside>
  );
};

export default Sidebar;