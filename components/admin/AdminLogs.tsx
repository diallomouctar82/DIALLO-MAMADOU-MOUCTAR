
import React, { useState } from 'react';
import { MOCK_LOGS } from '../../constants';
import { Search, AlertTriangle, CheckCircle, Info, Filter, Download } from 'lucide-react';

const AdminLogs: React.FC = () => {
  const [filterLevel, setFilterLevel] = useState<string>('ALL');

  const filteredLogs = MOCK_LOGS.filter(log => filterLevel === 'ALL' || log.level === filterLevel);

  const getLevelColor = (level: string) => {
    switch (level) {
        case 'ERROR': return 'text-red-500';
        case 'WARN': return 'text-orange-500';
        case 'INFO': return 'text-blue-500';
        default: return 'text-gray-500';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
        case 'ERROR': return <AlertTriangle className="w-4 h-4" />;
        case 'WARN': return <AlertTriangle className="w-4 h-4" />;
        case 'INFO': return <Info className="w-4 h-4" />;
        default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex space-x-2 overflow-x-auto pb-2 sm:pb-0">
                {['ALL', 'INFO', 'WARN', 'ERROR'].map(level => (
                    <button
                        key={level}
                        onClick={() => setFilterLevel(level)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                            filterLevel === level 
                            ? 'bg-white text-dark-900' 
                            : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                        }`}
                    >
                        {level}
                    </button>
                ))}
            </div>
            <div className="flex space-x-2">
                <button className="flex items-center px-4 py-2 bg-dark-800 text-gray-300 rounded-lg text-xs font-medium border border-white/10 hover:bg-white/5">
                    <Filter className="w-3 h-3 mr-2" /> Filtrer Source
                </button>
                <button className="flex items-center px-4 py-2 bg-dark-800 text-gray-300 rounded-lg text-xs font-medium border border-white/10 hover:bg-white/5">
                    <Download className="w-3 h-3 mr-2" /> Exporter CSV
                </button>
            </div>
        </div>

        {/* Logs Console */}
        <div className="bg-black/40 rounded-xl border border-white/10 font-mono text-sm overflow-hidden shadow-inner">
            <div className="px-4 py-2 bg-white/5 border-b border-white/5 flex justify-between items-center">
                <span className="text-xs text-gray-500 uppercase tracking-wider">System Console Output</span>
                <div className="flex space-x-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
                    <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
                </div>
            </div>
            <div className="p-2 max-h-[500px] overflow-y-auto space-y-1 custom-scrollbar">
                {filteredLogs.map((log) => (
                    <div key={log.id} className="flex items-start hover:bg-white/5 p-2 rounded transition-colors group">
                        <div className="w-24 text-gray-600 flex-shrink-0">{log.timestamp}</div>
                        <div className={`w-20 font-bold flex-shrink-0 flex items-center gap-1 ${getLevelColor(log.level)}`}>
                            {getLevelIcon(log.level)}
                            {log.level}
                        </div>
                        <div className="w-24 text-purple-400 flex-shrink-0">[{log.source}]</div>
                        <div className="text-gray-300 flex-1 break-all">
                            {log.message}
                            {log.details && (
                                <span className="text-gray-600 ml-2 group-hover:text-gray-500 transition-colors">
                                    -- {log.details}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default AdminLogs;
