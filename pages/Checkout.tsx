
import React, { useState } from 'react';
import { CreditPackage } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { CreditCard, Smartphone, Bitcoin, Lock, CheckCircle, ShieldCheck, Loader2, ArrowLeft } from 'lucide-react';

interface CheckoutProps {
  packageId: string;
  pkg: CreditPackage;
  onCancel: () => void;
  onSuccess: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ pkg, onCancel, onSuccess }) => {
  const { updateCredits } = useAuth();
  const [method, setMethod] = useState<'CARD' | 'MOBILE' | 'CRYPTO'>('CARD');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'SELECT' | 'PROCESS' | 'SUCCESS'>('SELECT');

  const handlePayment = () => {
    setIsProcessing(true);
    setStep('PROCESS');
    
    // Simulate complex payment processing steps
    setTimeout(() => {
        updateCredits(pkg.credits + (pkg.bonus || 0));
        setStep('SUCCESS');
        setIsProcessing(false);
    }, 3000);
  };

  if (step === 'SUCCESS') {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-900/90 backdrop-blur-xl p-4">
            <div className="bg-dark-800 border border-green-500/50 p-8 rounded-3xl max-w-md w-full text-center shadow-[0_0_50px_rgba(72,187,120,0.2)] transform animate-fade-in-up">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/50">
                    <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Paiement Réussi !</h2>
                <p className="text-gray-400 mb-8">
                    Votre compte a été crédité de <span className="text-white font-bold">{pkg.credits + (pkg.bonus || 0)} crédits</span>.
                </p>
                <button 
                    onClick={onSuccess}
                    className="w-full py-4 bg-white text-dark-900 rounded-xl font-bold hover:bg-gray-100 transition-colors"
                >
                    Retour au Portefeuille
                </button>
            </div>
        </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-900/90 backdrop-blur-md p-4 overflow-y-auto">
      <div className="glass-panel border border-white/10 rounded-3xl max-w-4xl w-full flex flex-col md:flex-row overflow-hidden shadow-2xl min-h-[600px]">
        
        {/* Left: Summary */}
        <div className="md:w-1/3 bg-dark-800/50 p-8 border-r border-white/5 flex flex-col">
            <button onClick={onCancel} className="flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Retour
            </button>
            
            <h3 className="text-gray-400 text-sm uppercase tracking-wider font-bold mb-6">Récapitulatif</h3>
            
            <div className="flex-1">
                <div className="text-4xl font-display font-bold text-white mb-1">{pkg.credits}</div>
                <div className="text-xl text-gray-400 font-light mb-4">Crédits IA</div>
                
                {pkg.bonus && (
                     <div className="inline-block px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full mb-6">
                        + {pkg.bonus} Bonus Gratuit
                     </div>
                )}
                
                <div className="h-px w-full bg-white/10 my-6"></div>
                
                <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Sous-total</span>
                    <span className="text-white">{pkg.price.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between items-center mb-6">
                    <span className="text-gray-400">Taxes</span>
                    <span className="text-white">0.00 €</span>
                </div>
                 <div className="flex justify-between items-center text-xl font-bold">
                    <span className="text-white">Total</span>
                    <span className="text-accent-gold">{pkg.price.toFixed(2)} €</span>
                </div>
            </div>
            
            <div className="mt-8 flex items-center text-xs text-gray-500">
                <ShieldCheck className="w-4 h-4 mr-2 text-green-500" />
                Paiement chiffré SSL 256-bit
            </div>
        </div>

        {/* Right: Payment Method */}
        <div className="md:w-2/3 p-8 md:p-12 relative">
             {step === 'PROCESS' && (
                <div className="absolute inset-0 z-10 bg-dark-900/80 backdrop-blur-sm flex flex-col items-center justify-center">
                    <Loader2 className="w-16 h-16 text-primary-blue animate-spin mb-4" />
                    <h3 className="text-xl font-bold text-white">Traitement Sécurisé</h3>
                    <p className="text-gray-400 text-sm mt-2">Communication avec la banque...</p>
                </div>
             )}

             <h2 className="text-2xl font-display font-bold text-white mb-8">Méthode de Paiement</h2>

             <div className="grid grid-cols-3 gap-4 mb-8">
                <button 
                    onClick={() => setMethod('CARD')}
                    className={`p-4 rounded-xl border flex flex-col items-center justify-center transition-all ${method === 'CARD' ? 'bg-primary-blue text-white border-primary-blue' : 'bg-dark-800 border-white/10 text-gray-400 hover:border-white/30'}`}
                >
                    <CreditCard className="w-6 h-6 mb-2" />
                    <span className="text-xs font-bold">Carte</span>
                </button>
                <button 
                    onClick={() => setMethod('MOBILE')}
                    className={`p-4 rounded-xl border flex flex-col items-center justify-center transition-all ${method === 'MOBILE' ? 'bg-orange-500 text-white border-orange-500' : 'bg-dark-800 border-white/10 text-gray-400 hover:border-white/30'}`}
                >
                    <Smartphone className="w-6 h-6 mb-2" />
                    <span className="text-xs font-bold">Mobile Money</span>
                </button>
                <button 
                    onClick={() => setMethod('CRYPTO')}
                    className={`p-4 rounded-xl border flex flex-col items-center justify-center transition-all ${method === 'CRYPTO' ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-dark-800 border-white/10 text-gray-400 hover:border-white/30'}`}
                >
                    <Bitcoin className="w-6 h-6 mb-2" />
                    <span className="text-xs font-bold">Crypto</span>
                </button>
             </div>

             {method === 'CARD' && (
                 <div className="space-y-4 animate-fade-in-up">
                    <div className="space-y-2">
                        <label className="text-xs text-gray-400 uppercase font-bold">Numéro de Carte</label>
                        <div className="relative">
                            <input type="text" placeholder="0000 0000 0000 0000" className="w-full bg-dark-800 border border-white/10 rounded-xl p-4 text-white focus:border-primary-blue focus:outline-none" />
                            <CreditCard className="absolute right-4 top-4 text-gray-500" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs text-gray-400 uppercase font-bold">Expiration</label>
                            <input type="text" placeholder="MM/YY" className="w-full bg-dark-800 border border-white/10 rounded-xl p-4 text-white focus:border-primary-blue focus:outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs text-gray-400 uppercase font-bold">CVC</label>
                            <div className="relative">
                                <input type="text" placeholder="123" className="w-full bg-dark-800 border border-white/10 rounded-xl p-4 text-white focus:border-primary-blue focus:outline-none" />
                                <Lock className="absolute right-4 top-4 text-gray-500 w-4 h-4" />
                            </div>
                        </div>
                    </div>
                 </div>
             )}

             {method === 'MOBILE' && (
                 <div className="space-y-4 animate-fade-in-up">
                    <p className="text-sm text-gray-400 mb-4">Sélectionnez votre opérateur (Orange Money, MTN, Wave, M-Pesa) et entrez votre numéro.</p>
                     <div className="space-y-2">
                        <label className="text-xs text-gray-400 uppercase font-bold">Numéro de Téléphone</label>
                        <input type="tel" placeholder="+221..." className="w-full bg-dark-800 border border-white/10 rounded-xl p-4 text-white focus:border-orange-500 focus:outline-none" />
                    </div>
                 </div>
             )}

            {method === 'CRYPTO' && (
                 <div className="space-y-4 animate-fade-in-up text-center py-8">
                    <div className="w-32 h-32 bg-white p-2 mx-auto rounded-lg mb-4">
                        {/* Placeholder QR Code */}
                        <div className="w-full h-full bg-black flex items-center justify-center text-white text-xs">QR CODE</div>
                    </div>
                    <p className="text-sm text-gray-300">Envoyez <span className="text-white font-bold">0.00045 BTC</span> à l'adresse ci-dessus.</p>
                    <div className="bg-dark-800 p-3 rounded-lg border border-white/10 flex justify-between items-center text-xs text-gray-400 font-mono">
                        <span className="truncate">bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh</span>
                        <button className="text-primary-blue hover:text-white ml-2">Copier</button>
                    </div>
                 </div>
             )}

             <button 
                onClick={handlePayment}
                className="w-full mt-8 py-4 bg-white text-dark-900 rounded-xl font-bold text-lg hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] flex items-center justify-center"
             >
                 <Lock className="w-4 h-4 mr-2" />
                 Payer {pkg.price.toFixed(2)} €
             </button>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
