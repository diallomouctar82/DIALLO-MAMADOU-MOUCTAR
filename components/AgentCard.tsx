
import React, { useState } from 'react';
import { Agent } from '../types';
import { MessageCircle, Phone } from 'lucide-react';

interface AgentCardProps {
  agent: Agent;
  onClick: () => void;
  onCall?: () => void;
  compact?: boolean;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent, onClick, onCall, compact = false }) => {
  const Icon = agent.icon;
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsPressed(true);
    setTimeout(() => {
      setIsPressed(false);
      onClick();
    }, 200);
  };

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onCall) onCall();
  };

  if (compact) {
    return (
      <div 
        onClick={handleClick}
        className={`group glass-panel rounded-xl p-4 cursor-pointer hover:bg-white/5 transition-all duration-300 border border-white/5 hover:border-primary-blue/50 transform ${isPressed ? 'scale-[1.02]' : 'scale-100'}`}
      >
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg bg-gradient-to-br ${agent.gradient} bg-opacity-10 group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-display font-semibold text-white truncate">{agent.name}</h4>
            <p className="text-xs text-gray-400">{agent.category}</p>
          </div>
          {onCall && (
            <button
                onClick={handleCall}
                className="p-2 bg-green-500/20 hover:bg-green-500 text-green-500 hover:text-white rounded-full transition-colors"
                title="Appel Direct"
            >
                <Phone className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="group relative glass-panel rounded-2xl p-6 hover:-translate-y-2 transition-transform duration-500 border border-white/10 hover:border-accent-teal/30 overflow-hidden">
      {/* Background Gradient on Hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${agent.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${agent.gradient} shadow-lg shadow-black/20 group-hover:scale-110 transition-transform duration-500`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
          <div className="flex space-x-2">
            <span className="px-2 py-1 rounded-full bg-white/5 text-xs font-medium text-gray-300 border border-white/10">
              {agent.category}
            </span>
          </div>
        </div>

        <h3 className="text-2xl font-display font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-colors">
          {agent.name}
        </h3>
        
        <p className="text-gray-400 mb-8 min-h-[3rem] line-clamp-2">
          {agent.description}
        </p>

        <div className="flex items-center space-x-3">
          <button 
            onClick={handleClick}
            className={`flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-2.5 px-4 rounded-lg flex items-center justify-center transition-all duration-200 group-hover:border-primary-blue/50 transform ${isPressed ? 'scale-[1.02]' : 'scale-100'}`}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            <span>Discuter</span>
          </button>
           <button 
            onClick={handleCall}
            className="w-12 h-10 bg-green-500/10 hover:bg-green-500 border border-green-500/30 text-green-500 hover:text-white rounded-lg flex items-center justify-center transition-all duration-300 shadow-lg shadow-green-500/10 hover:shadow-green-500/30"
            title="Appel vocal direct"
          >
            <Phone className="w-5 h-5 animate-pulse" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentCard;
