
import { 
  FileText, Scale, Languages, GraduationCap, Plane, Home, Briefcase, HeartPulse, Bot 
} from 'lucide-react';
import { Agent, Plan, CreditPackage, KnowledgeDoc, LogEntry, WorkflowConfig } from './types';

export const APP_NAME = "LE MONDE À VOUS";

export const AGENTS: Agent[] = [
  {
    id: 'mouctar-10',
    name: 'MOUCTAR 10',
    category: 'Assistant Spécial',
    description: 'Assistant connecté via n8n pour des tâches personnalisées.',
    icon: Bot,
    gradient: 'from-indigo-500 to-purple-600',
    systemInstruction: "Tu es Mouctar 10, un assistant intelligent connecté à un cerveau externe n8n.",
    elevenLabsId: 'agent_8401kax7j0m2fprsq176y3shn34b', // ID Admin par défaut pour l'affichage
    n8nWorkflowId: 'mouctar-flow-10',
    webhookUrl: 'https://n8n.vision-smart.com/webhook-test/assistant'
  },
  {
    id: 'job',
    name: 'Assistant Aide à l\'Emploi',
    category: 'Carrière',
    description: 'Optimisation CV, lettres de motivation et entretiens.',
    icon: Briefcase,
    gradient: 'from-gray-200 to-gray-500',
    systemInstruction: "Tu es l'Agent Emploi. Tu aides à rédiger des CVs professionnels, des lettres de motivation et à préparer des entretiens d'embauche.",
    elevenLabsId: 'agent_7101kax5s742f19agrkvrvv4ycpa',
    n8nWorkflowId: 'job-workflow-v1',
    webhookUrl: ''
  },
  {
    id: 'polyglot',
    name: 'Diallo Apprentissage des Langues et Guide Circuit Administrative',
    category: 'Langues & Culture',
    description: 'Traduction instantanée, apprentissage et guide circuit administratif.',
    icon: Languages,
    gradient: 'from-green-400 to-emerald-600',
    systemInstruction: "Tu es Polyglotte, un expert linguistique et culturel. Tu aides à la traduction, expliques les nuances culturelles et aides à l'apprentissage des langues.",
    elevenLabsId: 'agent_6401kaxa44q9f3a8hmnymb5g3h5d',
    n8nWorkflowId: 'lang-workflow-v1'
  },
  {
    id: 'lawyer',
    name: 'Cabinet d\'Avocat International',
    category: 'Juridique',
    description: 'Conseils légaux, droits internationaux et gestion de litiges.',
    icon: Scale,
    gradient: 'from-red-500 to-orange-500',
    systemInstruction: "Tu es Avocat International. Tu fournis des informations juridiques générales sur le droit international, l'immigration et les droits des travailleurs.",
    elevenLabsId: 'agent_2001kax9wwp8e3b8bvg4f6gfwm0y',
    n8nWorkflowId: 'legal-workflow-v1'
  },
  {
    id: 'education',
    name: 'Diallo Établissement Scolaire et les Élèves',
    category: 'Scolarité',
    description: 'Inscriptions universités, suivi des élèves et bourses.',
    icon: GraduationCap,
    gradient: 'from-yellow-400 to-orange-500',
    systemInstruction: "Tu es l'Agent Éducation. Tu aides les étudiants internationaux à trouver des universités, des bourses et à naviguer dans les systèmes éducatifs étrangers.",
    elevenLabsId: 'agent_6301kax7113ff1y9v50gakj15nqv',
    n8nWorkflowId: 'edu-workflow-v1'
  },
  {
    id: 'admin',
    name: 'Diallo Démarche Administrative',
    category: 'Administratif',
    description: 'Expert en documents, formulaires et procédures légales.',
    icon: FileText,
    gradient: 'from-blue-500 to-cyan-500',
    systemInstruction: "Tu es Admin Pro, un assistant expert en démarches administratives internationales. Tu aides les utilisateurs à comprendre les formulaires, les visas et les procédures bureaucratiques.",
    elevenLabsId: 'agent_8401kax7j0m2fprsq176y3shn34b',
    n8nWorkflowId: 'admin-workflow-v1'
  },
  {
    id: 'travel',
    name: 'Diallo Aide aux Voyageurs',
    category: 'Voyage',
    description: 'Visas, itinéraires, réservations et conseils locaux.',
    icon: Plane,
    gradient: 'from-sky-400 to-indigo-500',
    systemInstruction: "Tu es l'Agent Voyageur. Tu aides à planifier des itinéraires, vérifier les requis de visa et donner des conseils touristiques locaux.",
    elevenLabsId: 'agent_4901kax6wsvwe9t9dwb68c9tkde6',
    n8nWorkflowId: 'travel-workflow-v1'
  },
  {
    id: 'housing',
    name: 'Logement & Habitat',
    category: 'Hébergement',
    description: 'Recherche immobilière, bails et aides au logement.',
    icon: Home,
    gradient: 'from-purple-500 to-pink-500',
    systemInstruction: "Tu es l'Agent Logement. Tu aides à la recherche d'appartements, expliques les baux et les droits des locataires dans différents pays.",
    elevenLabsId: 'agent_8401kax7j0m2fprsq176y3shn34b', // Utilise Admin comme base pour les démarches logement
    n8nWorkflowId: 'housing-workflow-v1'
  },
  {
    id: 'health',
    name: 'Santé & Bien-être',
    category: 'Bien-être',
    description: 'Systèmes de santé, urgences et prévention.',
    icon: HeartPulse,
    gradient: 'from-rose-400 to-red-600',
    systemInstruction: "Tu es l'Agent Santé. Tu expliques les systèmes de santé étrangers, comment trouver un médecin et les numéros d'urgence.",
    elevenLabsId: 'agent_2001kax9wwp8e3b8bvg4f6gfwm0y', // Utilise Avocat pour les droits santé
    n8nWorkflowId: 'health-workflow-v1'
  }
];

export const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Gratuit',
    price: '0€',
    features: ['2 Agents', '50 messages/mois', 'Web uniquement', 'Support basique']
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '29€',
    features: ['Tous les Agents', 'Messages illimités', 'WhatsApp & Telegram', 'Support 24/7', 'Historique illimité'],
    isPopular: true
  },
  {
    id: 'enterprise',
    name: 'Entreprise',
    price: 'Sur devis',
    features: ['API dédiée', 'Agents personnalisés', 'SLA garanti', 'Gestionnaire de compte', 'White-label']
  }
];

export const CREDIT_PACKAGES: CreditPackage[] = [
  {
    id: 'pack_starter',
    credits: 500,
    price: 5,
    popular: false
  },
  {
    id: 'pack_pro',
    credits: 1500,
    price: 12,
    bonus: 300, // 20% bonus
    popular: true
  },
  {
    id: 'pack_business',
    credits: 5000,
    price: 35,
    bonus: 1500, // 30% bonus
    popular: false
  }
];

// --- MOCK DATA FOR ADMIN DASHBOARD ---

export const MOCK_KNOWLEDGE_BASE: KnowledgeDoc[] = [
  { id: 'doc_1', title: 'Procédure Visa Schengen', category: 'Immigration', status: 'published', views: 1240, lastUpdated: '01/12/2025', type: 'procedure' },
  { id: 'doc_2', title: 'Liste Documents Voyage', category: 'Voyage', status: 'published', views: 850, lastUpdated: '28/11/2025', type: 'article' },
  { id: 'doc_3', title: 'FAQ Campus France', category: 'Éducation', status: 'draft', views: 0, lastUpdated: '05/12/2025', type: 'faq' },
  { id: 'doc_4', title: 'Droit du Travail Étranger', category: 'Juridique', status: 'archived', views: 45, lastUpdated: '10/10/2025', type: 'article' },
  { id: 'doc_5', title: 'Renouvellement Titre Séjour', category: 'Immigration', status: 'published', views: 2300, lastUpdated: '02/12/2025', type: 'procedure' },
];

export const MOCK_LOGS: LogEntry[] = [
  { id: 'log_1', timestamp: '14:32:15', level: 'ERROR', source: 'API', message: 'DeepSeek timeout after 30s', details: 'Endpoint: /chat/completions' },
  { id: 'log_2', timestamp: '14:32:10', level: 'WARN', source: 'AGENT', message: 'Memory buffer full, rotating', details: 'Session: sess_123' },
  { id: 'log_3', timestamp: '14:31:58', level: 'INFO', source: 'SYSTEM', message: 'New WhatsApp message received', details: 'From: +3361234...' },
  { id: 'log_4', timestamp: '14:31:45', level: 'INFO', source: 'USER', message: 'User session started', details: 'User: u_456' },
  { id: 'log_5', timestamp: '14:31:30', level: 'INFO', source: 'SYSTEM', message: 'Webhook health check passed' },
  { id: 'log_6', timestamp: '14:31:15', level: 'INFO', source: 'AGENT', message: 'Response sent successfully', details: 'Latency: 1.2s' },
];

export const MOCK_WORKFLOWS: WorkflowConfig[] = [
  { 
    id: 'wf_wa_elevenlabs', 
    name: 'WhatsApp ⇄ ElevenLabs', 
    description: 'Pipeline Vocal : Réception WhatsApp → Cerveau n8n → Synthèse Vocale ElevenLabs. Traitement audio entrant et réponse vocale.', 
    status: 'active', 
    triggerType: 'webhook', 
    webhookUrl: 'https://n8n.lemondeavous.com/webhook/whatsapp-elevenlabs-voice', 
    httpMethod: 'POST',
    nodesCount: 18, 
    successRate: 99.9,
    lastRun: 'À l\'instant'
  },
  { 
    id: 'wf_1', 
    name: 'WhatsApp Receiver (Text)', 
    description: 'Réception et traitement des messages WhatsApp (Texte uniquement)', 
    status: 'active', 
    triggerType: 'webhook', 
    webhookUrl: 'https://n8n.lemondeavous.com/webhook/whatsapp', 
    httpMethod: 'POST',
    nodesCount: 12, 
    successRate: 99.8,
    lastRun: 'Il y a 2 min'
  },
  { 
    id: 'wf_2', 
    name: 'Email Notifications', 
    description: 'Envoi des emails de confirmation et alertes', 
    status: 'active', 
    triggerType: 'event', 
    webhookUrl: 'https://n8n.lemondeavous.com/webhook/email-send', 
    httpMethod: 'POST',
    nodesCount: 5, 
    successRate: 100,
    lastRun: 'Il y a 15 min'
  },
  { 
    id: 'wf_3', 
    name: 'Sync CRM Hubspot', 
    description: 'Synchronisation quotidienne des nouveaux contacts', 
    status: 'error', 
    triggerType: 'schedule', 
    webhookUrl: 'https://n8n.lemondeavous.com/webhook/crm-sync', 
    httpMethod: 'GET',
    nodesCount: 24, 
    successRate: 85.5,
    lastRun: 'Il y a 4 heures'
  }
];

export const DEPLOYMENT_CONFIG = {
  "metadata": {
    "version": "1.0.0",
    "project": "LE MONDE À VOUS",
    "author": "Mamadou Diallo",
    "lastUpdated": "2025-01-01",
    "description": "Configuration complète des connexions et credentials pour le système de chat multicanal"
  },
  "credentials": {
    "deepseek": {
      "id": "DEEPSEEK_API_ID",
      "name": "DeepSeek",
      "type": "openAiApi",
      "required": true,
      "configuration": {
        "apiKey": "sk-VOTRE_CLE_DEEPSEEK",
        "baseUrl": "https://api.deepseek.com/v1",
        "organization": ""
      },
      "documentation": "https://platform.deepseek.com/api-docs",
      "notes": "Utilisé comme LLM principal pour l'agent IA"
    },
    "openai": {
      "id": "OPENAI_API_ID",
      "name": "OpenAI Account",
      "type": "openAiApi",
      "required": false,
      "configuration": {
        "apiKey": "sk-VOTRE_CLE_OPENAI",
        "baseUrl": "https://api.openai.com/v1",
        "organization": ""
      },
      "documentation": "https://platform.openai.com/docs",
      "notes": "Utilisé pour la transcription audio (Whisper)"
    },
    "telegram": {
      "id": "TELEGRAM_API_ID",
      "name": "Telegram Bot LMAV",
      "type": "telegramApi",
      "required": true,
      "configuration": {
        "accessToken": "VOTRE_BOT_TOKEN"
      },
      "documentation": "https://core.telegram.org/bots/api",
      "setup_steps": [
        "1. Ouvrir Telegram et rechercher @BotFather",
        "2. Envoyer /newbot et suivre les instructions",
        "3. Copier le token fourni (format: 123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11)",
        "4. Configurer le webhook avec l'URL n8n"
      ],
      "webhook_config": {
        "method": "POST",
        "url": "https://api.telegram.org/bot{TOKEN}/setWebhook",
        "params": {
          "url": "https://VOTRE_INSTANCE_N8N/webhook/lmav-telegram-webhook",
          "allowed_updates": ["message", "callback_query", "edited_message"]
        }
      }
    },
    "whatsapp": {
      "id": "WHATSAPP_AUTH_ID",
      "name": "WhatsApp Business API",
      "type": "httpHeaderAuth",
      "required": true,
      "configuration": {
        "name": "Authorization",
        "value": "Bearer VOTRE_ACCESS_TOKEN"
      },
      "documentation": "https://developers.facebook.com/docs/whatsapp/cloud-api",
      "setup_steps": [
        "1. Créer un compte Meta Business",
        "2. Accéder à developers.facebook.com",
        "3. Créer une app avec le produit WhatsApp",
        "4. Configurer le numéro de téléphone test",
        "5. Récupérer le Phone Number ID et Access Token",
        "6. Configurer le webhook dans les paramètres de l'app"
      ],
      "webhook_config": {
        "verify_token": "VOTRE_VERIFY_TOKEN",
        "callback_url": "https://VOTRE_INSTANCE_N8N/webhook/whatsapp-lmav",
        "subscribed_fields": ["messages", "messaging_postbacks"]
      }
    },
    "messenger": {
      "id": "MESSENGER_AUTH_ID",
      "name": "Messenger Page Token",
      "type": "httpQueryAuth",
      "required": true,
      "configuration": {
        "name": "access_token",
        "value": "VOTRE_PAGE_ACCESS_TOKEN"
      },
      "documentation": "https://developers.facebook.com/docs/messenger-platform",
      "setup_steps": [
        "1. Créer une Page Facebook",
        "2. Accéder à developers.facebook.com",
        "3. Créer une app avec le produit Messenger",
        "4. Lier la Page Facebook à l'app",
        "5. Générer un Page Access Token",
        "6. Configurer le webhook pour la Page"
      ],
      "webhook_config": {
        "verify_token": "VOTRE_VERIFY_TOKEN",
        "callback_url": "https://VOTRE_INSTANCE_N8N/webhook/messenger-lmav",
        "subscribed_fields": ["messages", "messaging_postbacks", "messaging_optins"]
      }
    },
    "serpapi": {
      "id": "SERP_API_ID",
      "name": "SerpAPI",
      "type": "serpApi",
      "required": false,
      "configuration": {
        "apiKey": "VOTRE_CLE_SERPAPI"
      },
      "documentation": "https://serpapi.com/dashboard",
      "notes": "Utilisé pour les recherches web en temps réel"
    }
  },
  "webhooks": {
    "webchat": {
      "id": "lmav-chat-main-webhook",
      "path": "/webhook/lmav-chat-main-webhook",
      "method": "POST",
      "public": true,
      "description": "Point d'entrée principal pour le chat web intégré"
    },
    "telegram": {
      "id": "lmav-telegram-webhook",
      "path": "/webhook/lmav-telegram-webhook",
      "method": "POST",
      "public": true,
      "description": "Webhook pour les messages Telegram"
    },
    "whatsapp": {
      "id": "lmav-whatsapp-webhook",
      "path": "/webhook/whatsapp-lmav",
      "method": "POST",
      "public": true,
      "description": "Webhook pour les messages WhatsApp Business"
    },
    "messenger": {
      "id": "lmav-messenger-webhook",
      "path": "/webhook/messenger-lmav",
      "method": "POST",
      "public": true,
      "description": "Webhook pour les messages Facebook Messenger"
    }
  },
  "environment_variables": {
    "N8N_BASE_URL": {
      "description": "URL de base de votre instance n8n",
      "example": "https://n8n.votre-domaine.com",
      "required": true
    },
    "N8N_ENCRYPTION_KEY": {
      "description": "Clé de chiffrement pour les credentials",
      "example": "une-cle-securisee-de-32-caracteres",
      "required": true
    },
    "WEBHOOK_URL": {
      "description": "URL complète pour les webhooks",
      "example": "https://n8n.votre-domaine.com/webhook",
      "required": true
    }
  },
  "models": {
    "primary_llm": {
      "provider": "deepseek",
      "model": "deepseek-chat",
      "temperature": 0.7,
      "max_tokens": 4096,
      "description": "Modèle principal pour les conversations"
    },
    "transcription": {
      "provider": "openai",
      "model": "whisper-1",
      "language": "fr",
      "description": "Modèle pour la transcription audio"
    },
    "vision": {
      "provider": "deepseek",
      "model": "deepseek-chat",
      "description": "Modèle pour l'analyse d'images"
    }
  },
  "deployment_checklist": [
    {
      "step": 1,
      "title": "Préparer l'infrastructure",
      "tasks": [
        "Installer n8n (self-hosted ou cloud)",
        "Configurer un domaine avec SSL",
        "Vérifier la connectivité réseau"
      ]
    },
    {
      "step": 2,
      "title": "Créer les comptes API",
      "tasks": [
        "Créer un compte DeepSeek et obtenir une clé API",
        "Créer un compte Meta Business pour WhatsApp/Messenger",
        "Créer un bot Telegram via BotFather",
        "(Optionnel) Créer un compte OpenAI pour Whisper",
        "(Optionnel) Créer un compte SerpAPI pour la recherche"
      ]
    },
    {
      "step": 3,
      "title": "Configurer les credentials dans n8n",
      "tasks": [
        "Aller dans Settings > Credentials",
        "Créer chaque credential selon le type requis",
        "Tester chaque connexion"
      ]
    },
    {
      "step": 4,
      "title": "Importer le workflow",
      "tasks": [
        "Copier le fichier JSON du workflow",
        "Dans n8n: Workflows > Import from file",
        "Mettre à jour les IDs de credentials dans chaque node"
      ]
    },
    {
      "step": 5,
      "title": "Configurer les webhooks externes",
      "tasks": [
        "Telegram: setWebhook via l'API",
        "WhatsApp: configurer dans Meta Business Suite",
        "Messenger: configurer dans Facebook Developers"
      ]
    },
    {
      "step": 6,
      "title": "Tester le système",
      "tasks": [
        "Tester le WebChat intégré",
        "Envoyer un message test via Telegram",
        "Envoyer un message test via WhatsApp",
        "Envoyer un message test via Messenger"
      ]
    },
    {
      "step": 7,
      "title": "Activer et monitorer",
      "tasks": [
        "Activer le workflow (toggle ON)",
        "Configurer les alertes d'erreur",
        "Mettre en place le monitoring"
      ]
    }
  ],
  "troubleshooting": {
    "common_issues": [
      {
        "issue": "Webhook ne reçoit pas de messages",
        "solutions": [
          "Vérifier que le workflow est actif",
          "Vérifier l'URL du webhook dans la plateforme externe",
          "Vérifier les logs n8n pour les erreurs",
          "Tester avec un outil comme webhook.site"
        ]
      },
      {
        "issue": "Erreur d'authentification API",
        "solutions": [
          "Vérifier que la clé API est valide",
          "Vérifier le format de l'authentification (Bearer, etc.)",
          "Regénérer la clé API si nécessaire"
        ]
      },
      {
        "issue": "Agent IA ne répond pas",
        "solutions": [
          "Vérifier la connexion au LLM (DeepSeek)",
          "Vérifier les logs du node Agent",
          "Tester le LLM en isolation",
          "Vérifier le quota/crédit API"
        ]
      },
      {
        "issue": "Mémoire de conversation ne fonctionne pas",
        "solutions": [
          "Vérifier que le sessionId est correctement passé",
          "Vérifier la configuration du node Memory Buffer",
          "Augmenter la taille du buffer si nécessaire"
        ]
      }
    ]
  },
  "workflow_json": {
    "name": "🌍 LE MONDE À VOUS - Agent Chat Universel",
    "nodes": [], 
    "connections": {},
    "settings": {},
    "staticData": null,
    "tags": [],
    "triggerCount": 4,
    "meta": {}
  }
};
