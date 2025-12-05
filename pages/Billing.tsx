
import React, { useState } from 'react';
import { CREDIT_PACKAGES } from '../constants';
import { Transaction } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { CreditCard, Zap, Copy, Gift, History, CheckCircle, TrendingUp, Users } from 'lucide-react';

interface BillingProps {
  navigate: (path: string) => void;
  onCheckout: (packageId: string) => void;
}

// Mock Transactions
const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'tx_1', type: 'usage', amount: -15, description: 'Conversation Agent Voyage', date: '2025-05-04', status: 'completed' },
  { id: 'tx_2', type: 'referral_reward', amount: 150, description: 'Bonus Parrainage (Jean P.) - 10%', date: '2025-05-03', status: 'completed' },
  { id: 'tx_3', type: 'purchase', amount: 500, description: 'Recharge Pack Starter', date: '2025-05-01', status: 'completed' },
  { id: 'tx_4', type: 'bonus', amount: 50, description: 'Bienvenue - Essai Gratuit', date: '2025-04-28', status: 'completed' },
];

const Billing: React.FC<BillingProps> = ({ navigate, onCheckout }) => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  // Fallback if user context is loading/missing (though ProtectedRoute handles this)
  if (!user) return null;

  const copyReferral = () => {
    navigator.clipboard.writeText(`https://lemondeavous.com/signup?ref=${user.referralCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const calculateTrialDaysLeft = () => {
    if (!user.trialEndsAt) return 0;
    const today = new Date();
    const diffTime = Math.abs(new Date(user.trialEndsAt).getTime() - today.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)]">
      {/* Main Content */}
      <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-8">
            <header className="mb-8">
                <h1 className="text-3xl font-display font-bold text-white">Mon Portefeuille & Abonnements</h1>
                <p className="text-gray-400">Gérez vos crédits, vos parrainages et vos factures.</p>
            </header>

            {/* Top Section: Wallet & Trial */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Credits Wallet */}
                <div className="glass-panel p-8 rounded-2xl border border-white/10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-blue/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-gray-400 font-medium text-sm">Crédits Disponibles</h3>
                                <div className="text-5xl font-display font-bold text-white mt-1">{user.credits}</div>
                            </div>
                            <div className="p-3 bg-white/10 rounded-xl">
                                <Zap className="w-6 h-6 text-accent-gold" />
                            </div>
                        </div>
                        <p className="text-sm text-gray-400 mb-6">~ {(user.credits / 10).toFixed(0)} messages restants avec les agents IA.</p>
                        <button 
                            onClick={() => document.getElementById('topup')?.scrollIntoView({behavior: 'smooth'})}
                            className="w-full py-3 bg-gradient-to-r from-accent-gold to-orange-500 hover:opacity-90 text-dark-900 font-bold rounded-xl transition-all shadow-lg shadow-orange-500/20"
                        >
                            Recharger mon compte
                        </button>
                    </div>
                </div>

                {/* Free Trial Status */}
                {user.trialEndsAt && (
                    <div className="glass-panel p-8 rounded-2xl border border-white/10 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center space-x-2 mb-2">
                                <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full uppercase tracking-wider border border-green-500/20">
                                    Mode Essai Gratuit
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Accès Illimité Premium</h3>
                            <p className="text-gray-400 text-sm">
                                Profitez de tous les agents et fonctionnalités sans restriction pendant votre mois d'essai.
                            </p>
                        </div>
                        <div className="mt-6">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-4xl font-bold text-white">{calculateTrialDaysLeft()}</span>
                                <span className="text-sm text-gray-400 mb-1">Jours restants</span>
                            </div>
                            <div className="w-full bg-dark-800 rounded-full h-2 overflow-hidden">
                                <div className="bg-gradient-to-r from-green-400 to-emerald-600 h-full rounded-full" style={{ width: `${(calculateTrialDaysLeft() / 30) * 100}%` }}></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Expire le {new Date(user.trialEndsAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Referral Section */}
            <div className="glass-panel p-1 rounded-2xl bg-gradient-to-r from-primary-blue via-primary-purple to-pink-500">
                <div className="bg-dark-900 rounded-[14px] p-6 lg:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                        <div className="lg:col-span-2">
                            <div className="flex items-center space-x-3 mb-4">
                                <Gift className="w-8 h-8 text-pink-400 animate-bounce" />
                                <h2 className="text-2xl font-bold text-white">Programme de Parrainage</h2>
                            </div>
                            <p className="text-gray-300 mb-6 leading-relaxed">
                                Invitez vos amis et collègues à rejoindre <span className="text-white font-bold">LE MONDE À VOUS</span>.
                                Pour chaque recharge de crédits qu'ils effectuent, vous gagnez automatiquement <span className="text-accent-gold font-bold">10% du montant en crédits</span>.
                            </p>
                            
                            <div className="bg-dark-800 border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="text-left w-full">
                                    <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Votre Code Unique</span>
                                    <div className="font-mono text-xl text-white font-bold tracking-widest">{user.referralCode}</div>
                                </div>
                                <div className="flex space-x-2 w-full sm:w-auto">
                                    <button 
                                        onClick={copyReferral}
                                        className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors border border-white/10"
                                    >
                                        {copied ? <CheckCircle className="w-4 h-4 mr-2 text-green-400" /> : <Copy className="w-4 h-4 mr-2" />}
                                        {copied ? 'Copié !' : 'Copier le lien'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 rounded-xl p-6 border border-white/5">
                            <h3 className="text-sm text-gray-400 uppercase tracking-wider font-semibold mb-4">Vos Gains</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center text-gray-300">
                                        <Users className="w-4 h-4 mr-2" />
                                        Filleuls Inscrits
                                    </div>
                                    <span className="font-bold text-white">3</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center text-gray-300">
                                        <TrendingUp className="w-4 h-4 mr-2" />
                                        Total Gagné
                                    </div>
                                    <span className="font-bold text-accent-gold">+450 Crédits</span>
                                </div>
                                <div className="w-full h-px bg-white/10 my-2"></div>
                                <p className="text-xs text-gray-500 text-center">
                                    Prochain paiement estimé: +50 crédits
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Credit Packages */}
            <div id="topup">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2 text-primary-blue" />
                    Recharger des Crédits
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {CREDIT_PACKAGES.map((pack) => (
                        <div key={pack.id} className={`glass-panel p-6 rounded-2xl border transition-all duration-300 relative flex flex-col ${pack.popular ? 'border-accent-teal shadow-lg shadow-accent-teal/10 scale-105 z-10' : 'border-white/10 hover:border-white/20'}`}>
                            {pack.popular && (
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-accent-teal text-dark-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                    Populaire
                                </div>
                            )}
                            <div className="text-center mb-6">
                                <div className="text-3xl font-bold text-white mb-1">{pack.credits} <span className="text-lg text-gray-400 font-normal">Crédits</span></div>
                                {pack.bonus && (
                                    <div className="text-xs text-green-400 font-medium">+ {pack.bonus} Bonus inclus</div>
                                )}
                            </div>
                            
                            <ul className="space-y-3 mb-8 flex-grow">
                                <li className="flex items-center text-sm text-gray-300">
                                    <CheckCircle className="w-4 h-4 text-gray-500 mr-2" />
                                    Accès à tous les agents
                                </li>
                                <li className="flex items-center text-sm text-gray-300">
                                    <CheckCircle className="w-4 h-4 text-gray-500 mr-2" />
                                    Validité illimitée
                                </li>
                            </ul>

                            <button 
                                onClick={() => onCheckout(pack.id)}
                                className={`w-full py-3 rounded-xl font-bold transition-all ${pack.popular ? 'bg-accent-teal text-dark-900 hover:bg-accent-teal/90' : 'bg-white/10 text-white hover:bg-white/20'}`}
                            >
                                Acheter pour {pack.price}€
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Transaction History */}
            <div>
                <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                    <History className="w-5 h-5 mr-2 text-gray-400" />
                    Historique des Transactions
                </h2>
                <div className="glass-panel rounded-xl overflow-hidden border border-white/10">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 border-b border-white/10">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Description</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Montant</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-center">Statut</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {MOCK_TRANSACTIONS.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-300">{tx.date}</td>
                                        <td className="px-6 py-4 text-sm text-white font-medium">{tx.description}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                tx.type === 'purchase' ? 'bg-blue-100 text-blue-800' :
                                                tx.type === 'referral_reward' ? 'bg-purple-100 text-purple-800' :
                                                tx.type === 'bonus' ? 'bg-green-100 text-green-800' :
                                                'bg-gray-700 text-gray-300'
                                            }`}>
                                                {tx.type === 'purchase' && 'Achat'}
                                                {tx.type === 'referral_reward' && 'Parrainage'}
                                                {tx.type === 'bonus' && 'Bonus'}
                                                {tx.type === 'usage' && 'Utilisation'}
                                            </span>
                                        </td>
                                        <td className={`px-6 py-4 text-sm text-right font-mono font-bold ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            {tx.amount > 0 ? '+' : ''}{tx.amount}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {tx.status === 'completed' && <CheckCircle className="w-4 h-4 text-green-500 mx-auto" />}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default Billing;
