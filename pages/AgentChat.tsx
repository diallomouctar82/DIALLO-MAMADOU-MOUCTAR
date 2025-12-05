import React, { useState, useEffect, useRef } from 'react';
import { Agent, Message, Attachment } from '../types';
import { generateAgentResponse } from '../services/geminiService';
import { ArrowLeft, Send, Mic, Paperclip, Loader2, Sparkles, Settings, Phone, PhoneOff, Volume2, MicOff, ShieldCheck, X, ToggleLeft, ToggleRight, Type, Signal, Image as ImageIcon, Video, FileAudio } from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";

// Audio Helper Functions
function base64ToBytes(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Convert Float32 (Web Audio) to Int16 (PCM)
function floatTo16BitPCM(input: Float32Array) {
    const output = new Int16Array(input.length);
    for (let i = 0; i < input.length; i++) {
        const s = Math.max(-1, Math.min(1, input[i]));
        output[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return new Uint8Array(output.buffer);
}

// Decode raw PCM (24kHz) to AudioBuffer
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

interface AgentChatProps {
  agent: Agent;
  onBack: () => void;
  initialMode?: 'chat' | 'call';
}

const AgentChat: React.FC<AgentChatProps> = ({ agent: initialAgent, onBack, initialMode = 'chat' }) => {
  const [currentAgent, setCurrentAgent] = useState<Agent>(initialAgent);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      content: `Bonjour ! Je suis ${initialAgent.name}. ${initialAgent.description} Comment puis-je vous aider aujourd'hui ?`,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  
  // Voice Call States
  const [isCallActive, setIsCallActive] = useState(initialMode === 'call');
  const [callStatus, setCallStatus] = useState<'CONNECTING' | 'CONNECTED' | 'ENDED'>('CONNECTING');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);

  // Settings Modal State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [autoRead, setAutoRead] = useState(false);
  const [textSize, setTextSize] = useState<'normal' | 'large'>('normal');

  // Gemini Live Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const liveSessionRef = useRef<any>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);

  // Update current agent when prop changes
  useEffect(() => {
    setCurrentAgent(initialAgent);
    // Only reset messages if we are switching to a completely new context, 
    // but for this app we keep it simple.
    setMessages([
        {
          id: 'welcome',
          role: 'model',
          content: `Bonjour ! Je suis ${initialAgent.name}. ${initialAgent.description} Comment puis-je vous aider aujourd'hui ?`,
          timestamp: new Date()
        }
    ]);
  }, [initialAgent.id]);

  // Charger le script ElevenLabs (only needed for text mode widget now)
  useEffect(() => {
    const scriptId = 'elevenlabs-widget-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = "https://unpkg.com/@elevenlabs/convai-widget-embed";
      script.async = true;
      script.type = "text/javascript";
      document.body.appendChild(script);
    }
  }, []);

  // Trigger Call Mode
  useEffect(() => {
    if (initialMode === 'call') {
        startCall();
    }
  }, [initialMode, currentAgent]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupAudio();
    };
  }, []);

  const startCall = () => {
      setIsCallActive(true);
      setCallStatus('CONNECTING');
      setCallDuration(0);
      connectToGeminiLive();
  };

  const cleanupAudio = () => {
      if (liveSessionRef.current) {
          liveSessionRef.current.close();
          liveSessionRef.current = null;
      }
      if (processorRef.current) {
          processorRef.current.disconnect();
          processorRef.current = null;
      }
      if (sourceRef.current) {
          sourceRef.current.disconnect();
          sourceRef.current = null;
      }
      if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach(track => track.stop());
          mediaStreamRef.current = null;
      }
      if (audioContextRef.current) {
          audioContextRef.current.close();
          audioContextRef.current = null;
      }
  };

  const connectToGeminiLive = async () => {
    try {
        cleanupAudio(); // Ensure clean slate

        // Initialize Audio Context
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass({ sampleRate: 16000 });
        audioContextRef.current = ctx;
        nextStartTimeRef.current = ctx.currentTime;

        // Get Microphone Stream
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;

        // Initialize Gemini Client
        const apiKey = process.env.API_KEY || 'AIzaSyCq99LZhFIOwFguaxM-0XCbvwFgQLaxtVE';
        const client = new GoogleGenAI({ apiKey: apiKey });

        // Connect to Live API
        const session = await client.live.connect({
            model: 'gemini-2.5-flash-native-audio-preview-09-2025',
            config: {
                responseModalities: [Modality.AUDIO],
                systemInstruction: currentAgent.systemInstruction,
            },
            callbacks: {
                onopen: () => {
                    console.log("Gemini Live Connected");
                    setCallStatus('CONNECTED');
                    
                    // Setup Audio Processing Pipeline
                    const source = ctx.createMediaStreamSource(stream);
                    const processor = ctx.createScriptProcessor(4096, 1, 1);
                    
                    processor.onaudioprocess = (e) => {
                        if (isMuted) return; // Don't send audio if muted

                        const inputData = e.inputBuffer.getChannelData(0);
                        
                        // Simple Volume Meter
                        let sum = 0;
                        for (let i = 0; i < inputData.length; i++) {
                            sum += inputData[i] * inputData[i];
                        }
                        const rms = Math.sqrt(sum / inputData.length);
                        setVolumeLevel(rms); // Update state for visualizer

                        // Convert and Send
                        const pcmData = floatTo16BitPCM(inputData);
                        const base64Audio = arrayBufferToBase64(pcmData.buffer);
                        
                        if (liveSessionRef.current) {
                             liveSessionRef.current.sendRealtimeInput({
                                media: {
                                    mimeType: 'audio/pcm;rate=16000',
                                    data: base64Audio
                                }
                            });
                        }
                    };
                    
                    source.connect(processor);
                    processor.connect(ctx.destination);
                    
                    sourceRef.current = source;
                    processorRef.current = processor;
                },
                onmessage: async (msg: LiveServerMessage) => {
                    if (msg.serverContent?.modelTurn?.parts?.[0]?.inlineData) {
                        const audioDataBase64 = msg.serverContent.modelTurn.parts[0].inlineData.data;
                        if (audioDataBase64) {
                            const audioBytes = base64ToBytes(audioDataBase64);
                            const audioBuffer = await decodeAudioData(audioBytes, ctx);
                            
                            const source = ctx.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(ctx.destination);
                            
                            // Schedule playback
                            const now = ctx.currentTime;
                            nextStartTimeRef.current = Math.max(now, nextStartTimeRef.current);
                            source.start(nextStartTimeRef.current);
                            nextStartTimeRef.current += audioBuffer.duration;
                            
                            // Visualizer boost when agent talks
                            setVolumeLevel(0.5); 
                            source.onended = () => setVolumeLevel(0);
                        }
                    }
                },
                onclose: () => {
                    console.log("Gemini Live Disconnected");
                    setCallStatus('ENDED');
                },
                onerror: (err) => {
                    console.error("Gemini Live Error", err);
                    setCallStatus('ENDED');
                }
            }
        });
        liveSessionRef.current = session;

    } catch (error) {
        console.error("Failed to connect to Gemini Live", error);
        setCallStatus('ENDED');
    }
  };

  // Timer pour l'appel
  useEffect(() => {
    let interval: any;
    if (isCallActive && callStatus === 'CONNECTED') {
        interval = setInterval(() => {
            setCallDuration(prev => prev + 1);
        }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive, callStatus]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentAgent]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            if (event.target?.result) {
                const base64String = (event.target.result as string).split(',')[1];
                let type: Attachment['type'] = 'file';
                if (file.type.startsWith('image/')) type = 'image';
                if (file.type.startsWith('video/')) type = 'video';
                if (file.type.startsWith('audio/')) type = 'audio';

                setAttachments(prev => [...prev, {
                    type,
                    name: file.name,
                    mimeType: file.type,
                    data: base64String,
                    url: URL.createObjectURL(file)
                }]);
            }
        };
        reader.readAsDataURL(file);
    }
  };

  const handleRemoveAttachment = (index: number) => {
      setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // Handle standard chat
  const handleSendMessage = async () => {
    if ((!inputValue.trim() && attachments.length === 0) || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
      attachments: attachments
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setAttachments([]);
    setIsLoading(true);

    try {
      const response = await generateAgentResponse(
        messages.concat(userMsg),
        inputValue,
        currentAgent,
        userMsg.attachments
      );

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: response.text,
        timestamp: new Date(),
        attachments: response.attachments
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndCall = () => {
      cleanupAudio();
      setCallStatus('ENDED');
      
      const callSummary: Message = {
        id: `call-end-${Date.now()}`,
        role: 'model',
        content: `📞 **Appel terminé**\nDurée : ${formatDuration(callDuration)}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, callSummary]);

      setTimeout(() => {
          setIsCallActive(false);
          setCallStatus('CONNECTING');
          setCallDuration(0);
          
          if (window.location.hash.endsWith('/call')) {
              const newPath = window.location.hash.replace('/call', '');
              window.history.replaceState(null, '', newPath);
          }
      }, 1500);
  };

  const Icon = currentAgent.icon;

  /* -------------------------------------------------------------------------- */
  /*                                CALL OVERLAY                                */
  /* -------------------------------------------------------------------------- */
  if (isCallActive) {
      return (
          <div className="fixed inset-0 z-50 bg-dark-900 flex flex-col items-center justify-center overflow-hidden animate-fade-in-up">
              {/* Animated Background */}
              <div className="absolute inset-0 z-0">
                  <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br ${currentAgent.gradient} opacity-20 rounded-full blur-[120px] animate-pulse`}></div>
              </div>

              {/* Call Content */}
              <div className="relative z-10 flex flex-col items-center justify-between h-full w-full max-w-md py-12 px-6">
                  
                  {/* Top Info */}
                  <div className="text-center space-y-4">
                      <div className="flex items-center justify-center space-x-2 text-white/60 text-xs bg-black/20 px-3 py-1 rounded-full w-fit mx-auto border border-white/5 backdrop-blur-md">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Appel Sécurisé Chiffré (Gemini Live)</span>
                      </div>
                      <div>
                        <h2 className="text-3xl font-display font-bold text-white">{currentAgent.name}</h2>
                        <div className="flex items-center justify-center mt-2 space-x-2">
                             {callStatus === 'CONNECTING' && <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />}
                             <p className={`font-mono tracking-widest ${callStatus === 'CONNECTED' ? 'text-accent-teal' : 'text-gray-400'}`}>
                                {callStatus === 'CONNECTING' ? 'Connexion Satellite...' : 
                                 callStatus === 'ENDED' ? 'Appel Terminé' : 
                                 formatDuration(callDuration)}
                            </p>
                        </div>
                      </div>
                  </div>

                  {/* Avatar & Visualizer */}
                  <div className="relative my-8 flex flex-col items-center">
                      <div className="w-48 h-48 rounded-full p-1 bg-gradient-to-br from-white/20 to-transparent relative mb-8">
                          <div className="w-full h-full rounded-full overflow-hidden bg-dark-800 flex items-center justify-center relative z-10 shadow-2xl">
                              <Icon className="w-24 h-24 text-white opacity-90" />
                          </div>
                          
                          {/* Dynamic Visualizer based on Volume */}
                          {callStatus === 'CONNECTED' && (
                              <>
                                <div 
                                    className="absolute inset-0 rounded-full border border-white/20 transition-all duration-100 ease-out"
                                    style={{ transform: `scale(${1 + volumeLevel * 5})`, opacity: 0.5 - volumeLevel }}
                                ></div>
                                <div 
                                    className="absolute inset-0 rounded-full border border-accent-teal/30 transition-all duration-100 ease-out"
                                    style={{ transform: `scale(${1 + volumeLevel * 8})`, opacity: 0.3 - volumeLevel }}
                                ></div>
                              </>
                          )}
                          
                          {callStatus === 'CONNECTING' && (
                              <div className="absolute inset-0 rounded-full border-t-2 border-primary-blue animate-spin"></div>
                          )}
                      </div>
                      
                      {callStatus === 'CONNECTED' && (
                          <div className="flex items-center space-x-2 text-white/40 animate-pulse">
                              <Signal className="w-4 h-4" />
                              <p className="text-xs text-center">Liaison Audio Active</p>
                          </div>
                      )}
                  </div>

                  {/* Controls */}
                  <div className="w-full grid grid-cols-3 gap-6 mb-8">
                      <button 
                        onClick={() => setIsMuted(!isMuted)}
                        className={`flex flex-col items-center justify-center gap-2 p-4 rounded-full transition-all duration-200 transform hover:scale-105 ${isMuted ? 'bg-white text-dark-900' : 'bg-white/10 text-white hover:bg-white/20'}`}
                      >
                          {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                          <span className="text-xs font-medium">Muet</span>
                      </button>

                      <button 
                        onClick={handleEndCall}
                        className="flex flex-col items-center justify-center gap-2 p-4 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30 transform hover:scale-110 transition-all duration-200"
                      >
                          <PhoneOff className="w-8 h-8" />
                          <span className="text-xs font-bold">Raccrocher</span>
                      </button>

                      <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-200 transform hover:scale-105">
                          <Volume2 className="w-6 h-6" />
                          <span className="text-xs font-medium">Haut-parleur</span>
                      </button>
                  </div>

              </div>
          </div>
      );
  }

  /* -------------------------------------------------------------------------- */
  /*                               STANDARD CHAT                                */
  /* -------------------------------------------------------------------------- */
  return (
    <div className="flex h-full w-full overflow-hidden relative">
      
      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="absolute top-16 right-4 z-30 w-72 glass-panel border border-white/10 rounded-xl p-4 shadow-2xl animate-fade-in-up">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-white flex items-center">
                    <Settings className="w-4 h-4 mr-2" /> Paramètres
                </h3>
                <button onClick={() => setIsSettingsOpen(false)} className="text-gray-400 hover:text-white">
                    <X className="w-4 h-4" />
                </button>
            </div>
            
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Lecture Auto</span>
                    <button onClick={() => setAutoRead(!autoRead)} className="text-primary-blue hover:text-white transition-colors">
                        {autoRead ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-gray-600" />}
                    </button>
                </div>
                
                <div className="space-y-2">
                    <span className="text-sm text-gray-300 flex items-center">
                        <Type className="w-4 h-4 mr-2" /> Taille du texte
                    </span>
                    <div className="flex bg-white/5 rounded-lg p-1">
                        <button 
                            onClick={() => setTextSize('normal')}
                            className={`flex-1 text-xs py-1 rounded ${textSize === 'normal' ? 'bg-primary-blue text-white' : 'text-gray-400'}`}
                        >
                            Normal
                        </button>
                        <button 
                            onClick={() => setTextSize('large')}
                            className={`flex-1 text-xs py-1 rounded ${textSize === 'large' ? 'bg-primary-blue text-white' : 'text-gray-400'}`}
                        >
                            Grand
                        </button>
                    </div>
                </div>

                <div className="pt-2 border-t border-white/10">
                    <button className="w-full text-xs text-red-400 hover:text-red-300 py-2 hover:bg-red-500/10 rounded transition-colors">
                        Effacer l'historique
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative bg-gradient-to-br from-dark-900 to-dark-800">
        
        {/* Header */}
        <div className="glass-panel border-b border-white/10 p-4 flex items-center justify-between z-10">
          <div className="flex items-center">
            <button onClick={onBack} className="md:hidden p-2 mr-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className={`p-2 rounded-lg bg-gradient-to-br ${currentAgent.gradient} mr-3 shadow-lg`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-display font-bold text-white text-lg">{currentAgent.name}</h2>
              <div className="flex items-center space-x-3">
                <div className="flex items-center">
                  <span className={`w-2 h-2 rounded-full mr-2 bg-blue-500`}></span>
                  <span className="text-xs text-gray-400">
                    IA Multimodale
                  </span>
                </div>
                {currentAgent.webhookUrl && (
                    <div className="flex items-center ml-2">
                        <span className="w-2 h-2 rounded-full mr-2 bg-orange-500 animate-pulse"></span>
                        <span className="text-xs text-gray-400">n8n Actif</span>
                    </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
             <button onClick={startCall} className="p-2 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-colors rounded-lg flex items-center gap-2 border border-green-500/20 shadow-lg shadow-green-500/5" title="Appel Vocal">
                <Phone className="w-5 h-5" />
                <span className="text-xs font-bold hidden sm:inline">Live</span>
            </button>
            <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className={`p-2 transition-colors rounded-lg hover:bg-white/5 ${isSettingsOpen ? 'text-primary-blue bg-white/10' : 'text-gray-400 hover:text-white'}`}>
                <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-grow relative overflow-hidden flex flex-col h-full pb-24">
            <div className="flex-grow overflow-y-auto p-4 space-y-6 pb-24 custom-scrollbar">
                {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl p-4 ${
                        msg.role === 'user' 
                            ? 'bg-gradient-to-r from-primary-blue to-primary-purple text-white rounded-tr-sm shadow-lg shadow-primary-blue/20' 
                            : 'glass-panel border border-white/10 text-gray-100 rounded-tl-sm'
                    } ${textSize === 'large' ? 'text-lg' : 'text-sm md:text-base'}`}>
                        
                        {/* Display Attachments */}
                        {msg.attachments && msg.attachments.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                                {msg.attachments.map((att, i) => (
                                    <div key={i} className="rounded-lg overflow-hidden border border-white/10 relative group">
                                        {att.type === 'image' && <img src={att.url} alt="uploaded" className="max-w-full h-32 object-cover" />}
                                        {att.type === 'generated_image' && (
                                            <div className="relative">
                                                <img src={att.url} alt="generated" className="max-w-full rounded-lg" />
                                                <a href={att.url} download="generated.png" className="absolute bottom-2 right-2 p-2 bg-black/50 rounded-full text-white hover:bg-black/80"><Send className="w-3 h-3"/></a>
                                            </div>
                                        )}
                                        {att.type === 'generated_video' && (
                                            <video controls src={att.url} className="max-w-full rounded-lg" />
                                        )}
                                        {att.type === 'generated_audio' && (
                                             <audio controls src={`data:audio/mp3;base64,${att.data}`} className="max-w-full" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="whitespace-pre-wrap leading-relaxed">
                            {msg.content}
                        </div>
                        <div className={`text-[10px] mt-2 opacity-50 text-right`}>
                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>
                </div>
                ))}
                {isLoading && (
                <div className="flex justify-start">
                    <div className="glass-panel border border-white/10 rounded-2xl rounded-tl-sm p-4 flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-accent-teal animate-spin" />
                    <span className="text-sm text-gray-400">Création en cours...</span>
                    </div>
                </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Floating Input Bar */}
            <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-dark-900 via-dark-900/95 to-transparent z-20">
                
                {/* Attachments Preview */}
                {attachments.length > 0 && (
                    <div className="flex gap-2 mb-2 px-2 overflow-x-auto max-w-4xl mx-auto">
                        {attachments.map((att, i) => (
                            <div key={i} className="relative bg-dark-800 rounded-lg p-1 border border-white/10 group">
                                {att.type === 'image' ? <img src={att.url} className="h-12 w-12 object-cover rounded" /> : 
                                 att.type === 'video' ? <Video className="h-12 w-12 p-2 text-gray-400" /> :
                                 <FileAudio className="h-12 w-12 p-2 text-gray-400" /> }
                                <button onClick={() => handleRemoveAttachment(i)} className="absolute -top-1 -right-1 bg-red-500 rounded-full p-0.5 text-white"><X className="w-3 h-3" /></button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="relative flex items-center bg-dark-800/80 backdrop-blur-md rounded-2xl border border-white/10 focus-within:border-primary-blue/50 transition-all shadow-2xl max-w-4xl mx-auto">
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        onChange={handleFileSelect} 
                        accept="image/*,video/*,audio/*"
                    />
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="p-3 ml-1 text-gray-400 hover:text-white transition-colors rounded-xl hover:bg-white/5"
                        title="Ajouter média"
                    >
                        <ImageIcon className="w-5 h-5" />
                    </button>
                    
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder={`Écrivez à ${currentAgent.name}...`}
                        className="flex-grow bg-transparent text-white placeholder-gray-500 text-sm focus:outline-none py-4 px-2"
                    />

                    {/* Standard Mic Button for Text Mode */}
                    <div className="relative w-10 h-10 flex items-center justify-center mx-1">
                        {/* Use standard mic icon or integrate TTS trigger */}
                        <button className="pointer-events-none p-2 rounded-full bg-white/5 text-gray-400">
                             <Mic className="w-5 h-5" />
                        </button>
                    </div>

                    <button 
                        onClick={handleSendMessage}
                        disabled={(!inputValue.trim() && attachments.length === 0) || isLoading}
                        className={`p-3 m-1 rounded-xl transition-all duration-200 ${
                        (inputValue.trim() || attachments.length > 0) && !isLoading
                            ? 'bg-gradient-to-r from-primary-blue to-primary-purple text-white shadow-lg hover:shadow-primary-blue/30' 
                            : 'bg-white/5 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AgentChat;