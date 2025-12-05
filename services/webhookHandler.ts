import { LogEntry } from '../types';

export interface WebhookProcessResult {
  success: boolean;
  message: string;
  data?: any;
  logs: LogEntry[];
}

export const processIncomingWebhook = async (service: string, payload: any): Promise<WebhookProcessResult> => {
  const logs: LogEntry[] = [];

  const addLog = (level: 'INFO' | 'WARN' | 'ERROR', message: string, details?: string) => {
    logs.push({
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString(),
      level,
      source: 'API',
      message,
      details
    });
  };

  addLog('INFO', `Received webhook event for service: ${service}`);

  try {
    switch (service.toLowerCase()) {
      case 'n8n':
        if (!payload.body && !payload.message && !payload.data && !payload.output) {
             addLog('WARN', 'Empty or malformed n8n payload');
             return { success: false, message: 'Invalid payload structure', logs };
        }
        addLog('INFO', 'Processing n8n workflow response', `Keys: ${Object.keys(payload).join(', ')}`);
        return {
            success: true,
            message: 'n8n Event Processed',
            data: { 
                processed: true, 
                output: payload.output || payload.message,
                workflowId: payload.workflowId || 'unknown' 
            },
            logs
        };

      case 'elevenlabs':
        // Handle ElevenLabs specific events (e.g. generation success)
        addLog('INFO', 'Processing ElevenLabs voice event');
        return {
            success: true,
            message: 'Voice generation confirmed',
            data: { 
                character_count: payload.text?.length || 0,
                voice_id: payload.voice_id || 'unknown',
                status: 'generated'
            },
            logs
        };

      case 'twilio':
        if (!payload.MessageSid && !payload.Body) throw new Error('Missing MessageSid or Body');
        addLog('INFO', 'Processing Twilio SMS status');
        return {
            success: true,
            message: `SMS Status: ${payload.MessageStatus || 'Received'}`,
            data: { sid: payload.MessageSid, from: payload.From },
            logs
        };

      default:
        // Generic handler
        addLog('INFO', 'Processing generic webhook');
        return {
            success: true,
            message: 'Generic event received',
            data: { received: true, payload_size: JSON.stringify(payload).length },
            logs
        };
    }
  } catch (error: any) {
    addLog('ERROR', 'Processing failed', error.message);
    return {
        success: false,
        message: error.message,
        logs
    };
  }
};