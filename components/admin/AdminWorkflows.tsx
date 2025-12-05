import React, { useState } from 'react';
import { MOCK_WORKFLOWS } from '../../constants';
import { WorkflowConfig } from '../../types';
import { processIncomingWebhook } from '../../services/webhookHandler';
import { 
  Webhook, Play, CheckCircle, AlertTriangle, Settings, ArrowRight, Activity, 
  Server, Lock, Save, RefreshCw, Terminal, ExternalLink, Mic, Volume2, Smartphone, Link as LinkIcon,
  Copy, Trash2, Maximize2, FileJson, Code
} from 'lucide-react';

const DOCS_LINKS: Record<string, string> = {
    n8n: "https://docs.n8n.io/workflows/",
    make: "https://apps.make.com/built-in-apps",
    twilio: "https://www.twilio.com/docs",
    elevenlabs: "https://elevenlabs.io/docs/overview",
    custom: "#"
};

const PAYLOAD_TEMPLATES: Record<string, any> = {
    default: { test: true, message: "Hello World", timestamp: Date.now() },
    n8n: { 
        body: { message: "Test from Admin Panel", userId: "admin_123" }, 
        headers: { "x-source": "dashboard" },
        method: "POST"
    },
    twilio: {
        From: "+33612345678",
        Body: "Ceci est un message SMS de test",
        AccountSid: "AC_TEST_123",
        MessageSid: "SM_TEST_456"
    },
    elevenlabs: {
        text: "Bonjour, ceci est un test de synthèse vocale.",
        model_id: "eleven_multilingual_v2",
        voice_settings: { stability: 0.5, similarity_boost: 0.75 }
    }
};

const AdminWorkflows: React.FC = () => {
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowConfig>(MOCK_WORKFLOWS[0]);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<any | null>(null);
  const [configMode, setConfigMode] = useState(false);
  const [testPayload, setTestPayload] = useState(JSON.stringify(PAYLOAD_TEMPLATES.default, null, 2));

  // Check if current workflow involves Voice/ElevenLabs
  const isVoiceWorkflow = selectedWorkflow.description.toLowerCase().includes('elevenlabs') || selectedWorkflow.name.toLowerCase().includes('elevenlabs');

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    
    try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        let payload;
        try {
            payload = JSON.parse(testPayload);
        } catch (e) {
            throw new Error("Invalid JSON payload");
        }

        const service = selectedWorkflow.serviceType || 'custom';
        const result = await processIncomingWebhook(service, payload);
        
        setTestResult({
            status: result.success ? 200 : 400,
            message: result.message,
            executionId: "exec_" + Math.random().toString(36).substr(2, 9),
            data: result.data,
            logs: result.logs
        });
    } catch (error: any) {
         setTestResult({
            status: 500,
            message: error.message || "Connection failed",
            executionId: "err_" + Date.now(),
            data: { error: error.toString() }
        });
    } finally {
        setIsTesting(false);
    }
  };

  const loadTemplate = (type: string) => {
      const template = PAYLOAD_TEMPLATES[type] || PAYLOAD_TEMPLATES.default;
      setTestPayload(JSON.stringify(template, null, 2));
  };

  const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text);
      // Could add toast here
  };

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'active': return 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]';
          case 'inactive': return 'bg-gray-500';
          case 'error': return 'bg-red-500 animate-pulse';
          default: return 'bg-gray-500';
      }
  };

  const renderServiceConfig = () => {
      const type = selectedWorkflow.serviceType || 'custom';
      const config = selectedWorkflow.serviceConfig || {};

      switch(type) {
          case 'n8n':
              return (
                  <div className="space-y-4 animate-fade-in-up">
                      <div className="text-xs font-bold text-blue-400 uppercase mb-2 flex items-center">
                          <Activity className="w-3 h-3 mr-2" /> Configuration n8n
                      </div>
                      <div>
                          <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Instance Base URL</label>
                          <input type="text" defaultValue={config.baseUrl} placeholder="https://n8n.votredomaine.com" className="w-full bg-dark-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-primary-blue outline-none" />
                      </div>
                      <div>
                          <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">API Key (Header Auth)</label>
                          <div className="relative">
                            <input type="password" defaultValue={config.apiKey} placeholder="n8n_api_..." className="w-full bg-dark-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-primary-blue outline-none" />
                            <Lock className="absolute right-3 top-2.5 w-3 h-3 text-gray-500" />
                          </div>
                      </div>
                  </div>
              );
          case 'make':
              return (
                  <div className="space-y-4 animate-fade-in-up">
                      <div className="text-xs font-bold text-purple-400 uppercase mb-2 flex items-center">
                          <LinkIcon className="w-3 h-3 mr-2" /> Configuration Make.com
                      </div>
                      <div>
                          <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Region</label>
                          <select defaultValue={config.region || 'eu1'} className="w-full bg-dark-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-primary-blue outline-none">
                              <option value="eu1">EU1 (Europe)</option>
                              <option value="us1">US1 (USA)</option>
                          </select>
                      </div>
                      <div>
                          <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Webhook URL</label>
                          <input type="text" defaultValue={selectedWorkflow.webhookUrl} className="w-full bg-dark-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-primary-blue outline-none" />
                      </div>
                  </div>
              );
          case 'twilio':
              return (
                  <div className="space-y-4 animate-fade-in-up">
                      <div className="text-xs font-bold text-red-400 uppercase mb-2 flex items-center">
                          <Smartphone className="w-3 h-3 mr-2" /> Configuration Twilio
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Account SID</label>
                              <input type="text" defaultValue={config.accountSid} className="w-full bg-dark-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-primary-blue outline-none" />
                          </div>
                          <div>
                              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Auth Token</label>
                              <input type="password" defaultValue="******" className="w-full bg-dark-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-primary-blue outline-none" />
                          </div>
                      </div>
                      <div>
                          <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Phone Number</label>
                          <input type="text" defaultValue={config.phoneNumber} className="w-full bg-dark-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-primary-blue outline-none" />
                      </div>
                  </div>
              );
          case 'elevenlabs':
              return (
                  <div className="space-y-4 animate-fade-in-up">
                      <div className="text-xs font-bold text-green-400 uppercase mb-2 flex items-center">
                          <Mic className="w-3 h-3 mr-2" /> Configuration ElevenLabs
                      </div>
                      <div>
                          <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">API Key</label>
                          <input type="password" defaultValue="******" className="w-full bg-dark-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-primary-blue outline-none" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Voice ID</label>
                              <input type="text" defaultValue={config.voiceId} className="w-full bg-dark-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-primary-blue outline-none" />
                          </div>
                          <div>
                              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Model ID</label>
                              <input type="text" defaultValue={config.modelId || 'eleven_multilingual_v2'} className="w-full bg-dark-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-primary-blue outline-none" />
                          </div>
                      </div>
                  </div>
              );
          default:
              return (
                  <div className="space-y-4 animate-fade-in-up">
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Auth Header</label>
                              <input type="text" defaultValue={selectedWorkflow.authHeader || "Authorization"} className="w-full bg-dark-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-primary-blue outline-none" />
                          </div>
                          <div>
                              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Auth Value</label>
                              <input type="password" defaultValue={selectedWorkflow.authValue || ""} className="w-full bg-dark-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-primary-blue outline-none" />
                          </div>
                      </div>
                  </div>
              );
      }
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6 h-[calc(100vh-200px)] animate-fade-in-up">
        
        {/* Sidebar List */}
        <div className="w-full xl:w-80 glass-panel border border-white/10 rounded-xl overflow-hidden flex flex-col shrink-0">
            <div className="p-4 border-b border-white/10 bg-white/5">
                <h3 className="font-bold text-white flex items-center">
                    <Webhook className="w-4 h-4 mr-2 text-purple-400" />
                    Workflows Actifs
                </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                {MOCK_WORKFLOWS.map(wf => (
                    <button
                        key={wf.id}
                        onClick={() => { setSelectedWorkflow(wf); setTestResult(null); }}
                        className={`w-full text-left p-3 rounded-lg border transition-all duration-200 group ${
                            selectedWorkflow.id === wf.id 
                            ? 'bg-primary-blue/10 border-primary-blue/50' 
                            : 'bg-transparent border-transparent hover:bg-white/5 hover:border-white/10'
                        }`}
                    >
                        <div className="flex justify-between items-start mb-1">
                            <span className={`font-bold text-sm ${selectedWorkflow.id === wf.id ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>{wf.name}</span>
                            <div className={`w-2 h-2 rounded-full mt-1.5 ${getStatusColor(wf.status)}`}></div>
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-1">{wf.description}</p>
                        {wf.serviceType && (
                            <span className="text-[10px] uppercase font-bold text-accent-teal mt-1 block tracking-wider">{wf.serviceType}</span>
                        )}
                    </button>
                ))}
            </div>
            <div className="p-4 border-t border-white/10">
                <button className="w-full py-2 bg-white/5 hover:bg-white/10 text-xs font-bold text-white rounded border border-white/10 transition-colors flex items-center justify-center">
                    + Nouveau Workflow
                </button>
            </div>
        </div>

        {/* Main Config Area */}
        <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
            
            {/* Header & Stats */}
            <div className="glass-panel p-6 rounded-xl border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-2xl font-display font-bold text-white">{selectedWorkflow.name}</h2>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${selectedWorkflow.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {selectedWorkflow.status}
                        </span>
                    </div>
                    <p className="text-gray-400 text-sm flex items-center">
                        <Activity className="w-3 h-3 mr-2" /> Dernière exécution: {selectedWorkflow.lastRun} • Taux de succès: <span className="text-green-400 ml-1">{selectedWorkflow.successRate}%</span>
                    </p>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setConfigMode(!configMode)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center transition-colors ${configMode ? 'bg-primary-blue text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
                    >
                        <Settings className="w-4 h-4 mr-2" />
                        Configuration
                    </button>
                    <a 
                        href={DOCS_LINKS[selectedWorkflow.serviceType || 'custom']}
                        target="_blank" 
                        rel="noreferrer"
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg text-sm font-bold flex items-center border border-white/10"
                    >
                        Docs <ExternalLink className="w-3 h-3 ml-2" />
                    </a>
                </div>
            </div>

            {/* Visual Pipeline */}
            <div className="glass-panel p-8 rounded-xl border border-white/10 bg-dark-900/50 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5"></div>
                <h3 className="text-xs uppercase font-bold text-gray-500 mb-6 relative z-10">Pipeline de Données</h3>
                
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
                    {/* Trigger Node */}
                    <div className="flex-1 w-full p-4 bg-dark-800 border border-white/10 rounded-xl relative group hover:border-purple-500/50 transition-all">
                        <div className="absolute top-1/2 -right-3 w-6 h-6 bg-dark-900 border-r border-t border-white/10 transform rotate-45 z-0 group-hover:border-purple-500/50 transition-all hidden md:block"></div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                                <Webhook className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-white">Webhook Trigger</div>
                                <div className="text-[10px] text-gray-500 uppercase">{selectedWorkflow.triggerType}</div>
                            </div>
                        </div>
                        <div className="text-xs text-gray-400 font-mono bg-black/20 p-2 rounded truncate">
                            {selectedWorkflow.httpMethod || 'POST'} {selectedWorkflow.serviceType === 'n8n' ? '/webhook/...' : 'Endpoint URL'}
                        </div>
                    </div>

                    <ArrowRight className="w-6 h-6 text-gray-600 hidden md:block" />

                    {/* Process Node */}
                    <div className="flex-1 w-full p-4 bg-dark-800 border border-white/10 rounded-xl relative group hover:border-blue-500/50 transition-all">
                        <div className="absolute top-1/2 -right-3 w-6 h-6 bg-dark-900 border-r border-t border-white/10 transform rotate-45 z-0 group-hover:border-blue-500/50 transition-all hidden md:block"></div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                                <Activity className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-white">Traitement</div>
                                <div className="text-[10px] text-gray-500 uppercase">{selectedWorkflow.nodesCount} Noeuds</div>
                            </div>
                        </div>
                        <div className="flex gap-1 mt-2">
                            {[1,2,3,4].map(i => (
                                <div key={i} className="h-1 flex-1 bg-blue-500/20 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 animate-pulse" style={{width: '60%', animationDelay: `${i*0.2}s`}}></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <ArrowRight className="w-6 h-6 text-gray-600 hidden md:block" />

                    {/* Output Node */}
                    <div className={`flex-1 w-full p-4 bg-dark-800 border border-white/10 rounded-xl transition-all ${isVoiceWorkflow ? 'hover:border-accent-teal/50' : 'hover:border-green-500/50'}`}>
                        <div className="flex items-center gap-3 mb-2">
                            <div className={`p-2 rounded-lg ${isVoiceWorkflow ? 'bg-accent-teal/20 text-accent-teal' : 'bg-green-500/20 text-green-400'}`}>
                                {isVoiceWorkflow ? <Volume2 className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                            </div>
                            <div>
                                <div className="text-sm font-bold text-white">
                                    {isVoiceWorkflow ? 'Réponse Vocale (ElevenLabs)' : 'Réponse API'}
                                </div>
                                <div className="text-[10px] text-gray-500 uppercase">
                                    {isVoiceWorkflow ? 'Audio Stream' : 'JSON Output'}
                                </div>
                            </div>
                        </div>
                        <div className="text-xs text-gray-400 font-mono bg-black/20 p-2 rounded">
                            {isVoiceWorkflow ? 'audio/mpeg' : '{ "success": true }'}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Configuration Panel */}
                <div className="glass-panel p-6 rounded-xl border border-white/10">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center">
                        <Settings className="w-5 h-5 mr-2 text-gray-400" />
                        Configuration de Connexion
                    </h3>
                    
                    <div className="space-y-6">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Service Type</label>
                            <div className="flex flex-wrap gap-2">
                                {['n8n', 'make', 'twilio', 'elevenlabs', 'custom'].map(type => (
                                    <button 
                                        key={type}
                                        onClick={() => setSelectedWorkflow({...selectedWorkflow, serviceType: type as any})}
                                        className={`px-3 py-2 rounded-lg text-xs font-bold uppercase transition-colors ${
                                            selectedWorkflow.serviceType === type 
                                            ? 'bg-primary-blue text-white' 
                                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                        }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Provider Specific Config */}
                        {renderServiceConfig()}

                        {/* Common Webhook URL field if not specific or custom */}
                        {!['make', 'twilio'].includes(selectedWorkflow.serviceType || '') && (
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Webhook URL</label>
                                <div className="flex">
                                    <div className="bg-white/5 border border-white/10 border-r-0 rounded-l-lg px-3 py-2 text-xs text-gray-400 font-mono flex items-center">
                                        {selectedWorkflow.httpMethod || 'POST'}
                                    </div>
                                    <input 
                                        type="text" 
                                        defaultValue={selectedWorkflow.webhookUrl}
                                        className="flex-1 bg-dark-900 border border-white/10 rounded-r-lg px-3 py-2 text-sm text-white font-mono focus:border-primary-blue outline-none"
                                    />
                                    <button 
                                        onClick={() => copyToClipboard(selectedWorkflow.webhookUrl)}
                                        className="ml-2 p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                                        title="Copier URL"
                                    >
                                        <Copy className="w-4 h-4" />
                                    </button>
                                </div>
                                {/* Warning for Test URL vs Production */}
                                {selectedWorkflow.webhookUrl.includes('/webhook-test/') && (
                                    <div className="mt-2 text-xs text-orange-400 flex items-center bg-orange-500/10 p-2 rounded">
                                        <AlertTriangle className="w-3 h-3 mr-1" />
                                        URL de Test détectée (expire après 1 utilisation)
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="pt-4 flex justify-end">
                            <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-bold flex items-center transition-colors">
                                <Save className="w-4 h-4 mr-2" />
                                Sauvegarder
                            </button>
                        </div>
                    </div>
                </div>

                {/* Test Console */}
                <div className="glass-panel p-6 rounded-xl border border-white/10 flex flex-col h-[500px]">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-white flex items-center">
                            <Terminal className="w-5 h-5 mr-2 text-gray-400" />
                            Console de Test
                        </h3>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setTestResult(null)}
                                className="p-2 hover:bg-white/10 rounded-lg text-gray-400 transition-colors"
                                title="Effacer"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <button 
                                onClick={handleTestConnection}
                                disabled={isTesting}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center transition-all ${
                                    isTesting ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/20'
                                }`}
                            >
                                {isTesting ? <RefreshCw className="w-3 h-3 mr-2 animate-spin" /> : <Play className="w-3 h-3 mr-2" />}
                                {isTesting ? 'Envoi...' : 'Ping'}
                            </button>
                        </div>
                    </div>

                    {/* Quick Commands (Missing Templates) */}
                    <div className="mb-4 flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                        {Object.keys(PAYLOAD_TEMPLATES).map(key => (
                            <button
                                key={key}
                                onClick={() => loadTemplate(key)}
                                className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-xs text-gray-300 whitespace-nowrap flex items-center"
                            >
                                <FileJson className="w-3 h-3 mr-1" />
                                {key.charAt(0).toUpperCase() + key.slice(1)} Template
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 bg-black/40 rounded-lg border border-white/10 font-mono text-xs relative flex flex-col overflow-hidden">
                        <div className="flex border-b border-white/5">
                            <div className="px-4 py-2 bg-white/5 text-gray-300 border-r border-white/5 text-[10px] uppercase font-bold">Request Body (JSON)</div>
                            {testResult && <div className="px-4 py-2 text-green-400 text-[10px] uppercase font-bold">Response (200 OK)</div>}
                        </div>
                        
                        <div className="relative flex-1">
                            <textarea 
                                className="absolute inset-0 w-full h-full bg-transparent p-4 text-gray-300 focus:outline-none resize-none z-10 font-mono text-xs leading-relaxed"
                                value={testPayload}
                                onChange={(e) => setTestPayload(e.target.value)}
                                spellCheck={false}
                            />
                            
                            {isTesting && (
                                <div className="absolute inset-0 bg-dark-900/80 z-20 flex items-center justify-center text-yellow-400 animate-pulse pointer-events-none">
                                    {`> Sending ${selectedWorkflow.httpMethod || 'POST'} request...`}
                                </div>
                            )}
                            
                            {testResult && (
                                <div className="absolute inset-0 bg-dark-900 z-30 p-4 overflow-y-auto animate-fade-in-up">
                                    <div className="space-y-1">
                                        <div className="flex justify-between items-center">
                                            <div className="text-green-400 font-bold">{`> HTTP ${testResult.status} OK`}</div>
                                            <button onClick={() => setTestResult(null)} className="text-xs text-gray-500 hover:text-white">Fermer</button>
                                        </div>
                                        <div className="text-gray-500">{`> Execution ID: ${testResult.executionId}`}</div>
                                        <div className="h-px bg-white/10 my-2"></div>
                                        <pre className="text-blue-300 overflow-x-auto">
                                            {JSON.stringify(testResult.data, null, 2)}
                                        </pre>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
  );
};

export default AdminWorkflows;