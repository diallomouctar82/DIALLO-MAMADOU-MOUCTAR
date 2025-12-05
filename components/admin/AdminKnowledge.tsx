
import React, { useState } from 'react';
import { MOCK_KNOWLEDGE_BASE } from '../../constants';
import { Search, FileText, Eye, Edit2, Trash2, Plus, Upload, RefreshCw } from 'lucide-react';

const AdminKnowledge: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDocs = MOCK_KNOWLEDGE_BASE.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    doc.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in-up">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full sm:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input 
                    type="text" 
                    placeholder="Rechercher un document..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-dark-800 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-primary-blue focus:outline-none"
                />
            </div>
            <div className="flex space-x-2 w-full sm:w-auto">
                <button className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors text-sm border border-white/10">
                    <Upload className="w-4 h-4 mr-2" /> Import
                </button>
                <button className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 bg-primary-blue hover:bg-blue-600 text-white rounded-lg transition-colors text-sm font-bold shadow-lg shadow-blue-500/20">
                    <Plus className="w-4 h-4 mr-2" /> Nouveau Doc
                </button>
            </div>
        </div>

        {/* Categories Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Immigration', 'Voyage', 'Admin', 'Éducation'].map((cat, i) => (
                <div key={i} className="glass-panel p-4 rounded-xl border border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
                    <h4 className="text-gray-400 text-xs uppercase font-bold mb-1">{cat}</h4>
                    <div className="flex items-end justify-between">
                        <span className="text-xl font-bold text-white">{Math.floor(Math.random() * 20) + 5} Docs</span>
                        <FileText className="w-4 h-4 text-primary-blue opacity-50" />
                    </div>
                </div>
            ))}
        </div>

        {/* Documents Table */}
        <div className="glass-panel rounded-xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-white/5 border-b border-white/10">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase">Document</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase">Catégorie</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase">Statut</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase">Vues</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase">Dernière MàJ</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredDocs.map((doc) => (
                            <tr key={doc.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <div className="p-2 bg-blue-500/10 rounded-lg mr-3">
                                            <FileText className="w-4 h-4 text-blue-400" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-white">{doc.title}</div>
                                            <div className="text-[10px] text-gray-500 uppercase">{doc.type}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-white/5 rounded text-xs text-gray-300">{doc.category}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        doc.status === 'published' ? 'bg-green-500/20 text-green-400' : 
                                        doc.status === 'draft' ? 'bg-yellow-500/20 text-yellow-400' : 
                                        'bg-gray-500/20 text-gray-400'
                                    }`}>
                                        {doc.status === 'published' ? 'Publié' : doc.status === 'draft' ? 'Brouillon' : 'Archivé'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-300">{doc.views}</td>
                                <td className="px-6 py-4 text-sm text-gray-500 font-mono">{doc.lastUpdated}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end space-x-2">
                                        <button className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded"><Eye className="w-4 h-4" /></button>
                                        <button className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded"><Edit2 className="w-4 h-4" /></button>
                                        <button className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        
        <div className="flex justify-center mt-8">
            <button className="flex items-center text-xs text-gray-500 hover:text-primary-blue transition-colors">
                <RefreshCw className="w-3 h-3 mr-1" />
                Réindexer la base vectorielle (Vector Store)
            </button>
        </div>
    </div>
  );
};

export default AdminKnowledge;
