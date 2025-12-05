
import React, { useState, useEffect } from 'react';
import { AGENTS, PLANS } from '../constants';
import AgentCard from '../components/AgentCard';
import { ArrowRight, CheckCircle, Globe, Zap, Shield, Sparkles } from 'lucide-react';

interface HomeProps {
  navigate: (path: string) => void;
}

const Home: React.FC<HomeProps> = ({ navigate }) => {
  const [ctaPressed, setCtaPressed] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCtaClick = () => {
    setCtaPressed(true);
    setTimeout(() => {
      setCtaPressed(false);
      navigate('/dashboard');
    }, 200);
  };

  const handleAgentCall = (agentId: string) => {
    // Navigate with hash to trigger call mode
    window.location.hash = `/agent/${agentId}/call`;
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 overflow-hidden">
        {/* Parallax Background Elements */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        >
             <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary-blue/10 rounded-full mix-blend-screen filter blur-[100px] animate-blob"></div>
             <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary-purple/10 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000"></div>
             <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-accent-teal/5 rounded-full mix-blend-screen filter blur-[80px] animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-5xl mx-auto text-center z-10 relative">
          <div className="inline-flex items-center px-4 py-2 rounded-full glass-panel border border-accent-teal/30 text-accent-teal mb-8 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-accent-teal mr-2 animate-pulse"></span>
            <span className="text-sm font-medium tracking-wide">NOUVEAU: APPELS VOCAUX DIRECTS DISPONIBLES</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white mb-6 leading-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            LE MONDE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-blue via-primary-purple to-accent-teal">
              À VOUS
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto font-light animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            L'assistant IA universel qui parle votre langue et comprend vos défis : voyage, emploi, santé, et plus encore.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <button 
              onClick={handleCtaClick}
              className={`w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary-blue to-primary-purple rounded-full text-white font-bold text-lg hover:shadow-lg hover:shadow-primary-blue/30 transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center ${ctaPressed ? 'scale-[1.02]' : 'scale-100'}`}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Essayer Gratuitement
            </button>
            <button 
              onClick={() => document.getElementById('agents')?.scrollIntoView({behavior: 'smooth'})}
              className="w-full sm:w-auto px-8 py-4 glass-panel border border-white/20 rounded-full text-white font-medium hover:bg-white/10 transition-all duration-300 flex items-center justify-center"
            >
              Découvrir les Agents
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </section>

      {/* Agents Section */}
      <section id="agents" className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Nos Agents Experts</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Chaque agent est entraîné spécifiquement pour exceller dans son domaine.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {AGENTS.map((agent, idx) => (
              <AgentCard 
                key={agent.id} 
                agent={agent} 
                onClick={() => navigate(`/agent/${agent.id}`)} 
                onCall={() => handleAgentCall(agent.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-dark-800/50 relative overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-8">
                Technologie Humaine <br />
                <span className="text-accent-teal">Pour des Défis Réels</span>
              </h2>
              <div className="space-y-8">
                {[
                  { icon: Globe, title: "50+ Langues Supportées", desc: "Communication fluide sans barrière linguistique." },
                  { icon: Zap, title: "Disponible 24/7", desc: "Une assistance instantanée, peu importe le fuseau horaire." },
                  { icon: Shield, title: "Sécurité Maximale", desc: "Vos données et conversations sont chiffrées et protégées." }
                ].map((item, i) => (
                  <div key={i} className="flex items-start">
                    <div className="flex-shrink-0 p-3 bg-white/5 rounded-lg border border-white/10">
                      <item.icon className="w-6 h-6 text-primary-blue" />
                    </div>
                    <div className="ml-6">
                      <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                      <p className="text-gray-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-full bg-gradient-to-tr from-primary-blue/20 to-primary-purple/20 absolute inset-0 blur-3xl animate-pulse"></div>
              <div className="glass-panel p-8 rounded-3xl border border-white/10 relative">
                <div className="space-y-4">
                    {/* Fake Chat UI */}
                    <div className="flex justify-end">
                        <div className="bg-primary-blue/20 text-blue-100 p-3 rounded-2xl rounded-tr-sm max-w-[80%] text-sm">
                            Comment obtenir un visa étudiant pour la France ?
                        </div>
                    </div>
                    <div className="flex justify-start">
                        <div className="glass-panel text-gray-200 p-3 rounded-2xl rounded-tl-sm max-w-[80%] text-sm border border-white/5">
                            Pour un visa étudiant (VLS-TS), voici les étapes clés :
                            <br/>1. Admission via Études en France.
                            <br/>2. Preuve de ressources (615€/mois).
                            <br/>3. Logement provisoire...
                        </div>
                    </div>
                     <div className="flex justify-end">
                        <div className="bg-primary-blue/20 text-blue-100 p-3 rounded-2xl rounded-tr-sm max-w-[80%] text-sm">
                            Peux-tu vérifier mon dossier ?
                        </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Tarifs Simples</h2>
            <p className="text-gray-400 text-lg">Investissez dans votre avenir.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PLANS.map((plan) => (
              <div key={plan.id} className={`glass-panel p-8 rounded-3xl relative flex flex-col ${plan.isPopular ? 'border-primary-blue shadow-2xl shadow-primary-blue/20' : 'border-white/10'}`}>
                {plan.isPopular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-primary-blue to-primary-purple px-4 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider">
                    Recommandé
                  </div>
                )}
                <h3 className="text-2xl font-display font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-8">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  {plan.price !== 'Sur devis' && <span className="text-gray-400 ml-2">/mois</span>}
                </div>
                
                <ul className="space-y-4 mb-8 flex-grow">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-gray-300">
                      <CheckCircle className="w-5 h-5 text-accent-teal mr-3 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-3 rounded-xl font-bold transition-all duration-300 ${
                  plan.isPopular 
                    ? 'bg-white text-dark-900 hover:bg-gray-100' 
                    : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                }`}>
                  Choisir {plan.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
