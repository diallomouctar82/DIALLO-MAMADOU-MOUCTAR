import { LucideIcon } from 'lucide-react';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  BANNED = 'BANNED',
  SUSPENDED = 'SUSPENDED' // Temporaire
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  credits: number;
  isVerified: boolean;
  twoFactorEnabled: boolean;
  trialEndsAt?: Date;
  referralCode: string;
  hasLifetimeAccess?: boolean; // Accès gratuit octroyé par l'admin
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  securityLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'FORTRESS';
}

export interface Agent {
  id: string;
  name: string;
  slug?: string;
  category: string;
  description: string;
  icon: LucideIcon;
  systemInstruction: string;
  gradient: string;
  // Configuration Technique Externe
  elevenLabsId?: string; 
  n8nWorkflowId?: string;
  webhookUrl?: string;
  externalApiId?: string;
}

export interface Attachment {
    type: 'image' | 'file' | 'audio' | 'video' | 'generated_image' | 'generated_video' | 'generated_audio';
    url?: string;
    name?: string;
    mimeType?: string;
    data?: string; // base64
    metadata?: any;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
  attachments?: Attachment[];
}

export interface Plan {
  id: string;
  name: string;
  price: string;
  features: string[];
  isPopular?: boolean;
}

export interface CreditPackage {
  id: string;
  credits: number;
  price: number;
  bonus?: number;
  popular?: boolean;
}

export interface Transaction {
  id: string;
  type: 'purchase' | 'usage' | 'referral_reward' | 'bonus';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface UserProfile extends User {
  referralEarnings: number;
  referralCount: number;
}

// --- NEW TYPES FOR ADMIN SYSTEM ---

export interface KnowledgeDoc {
  id: string;
  title: string;
  category: string;
  status: 'published' | 'draft' | 'archived';
  views: number;
  lastUpdated: string;
  type: 'article' | 'faq' | 'procedure';
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL';
  source: 'SYSTEM' | 'AGENT' | 'API' | 'USER' | 'WORKFLOW';
  message: string;
  details?: string;
}

export interface AdminKPI {
  label: string;
  value: string | number;
  trend: string;
  trendUp: boolean; // true if good
  iconName: 'Users' | 'MessageCircle' | 'Zap' | 'Activity' | 'DollarSign' | 'Server';
}

export interface WorkflowConfig {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'error';
  triggerType: 'webhook' | 'schedule' | 'event';
  webhookUrl: string;
  httpMethod?: string;
  authHeader?: string;
  authValue?: string;
  lastRun?: string;
  successRate: number;
  nodesCount: number;
  serviceType?: 'n8n' | 'make' | 'twilio' | 'elevenlabs' | 'custom';
  serviceConfig?: Record<string, any>;
}

// Global JSX augmentation for custom elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'elevenlabs-convai': any;
    }
  }
}