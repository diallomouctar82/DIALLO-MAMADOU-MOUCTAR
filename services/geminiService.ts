import { GoogleGenAI, GenerateContentResponse, Part, Type, Modality } from "@google/genai";
import { Message, Agent, Attachment } from "../types";

// Ensure API Key exists
const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.error("API_KEY is missing from environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key-for-build' });

// Helper to determine capabilities based on intent (simple keyword matching for now)
const detectIntent = (text: string) => {
    const t = text.toLowerCase();
    if (t.includes('génère une image') || t.includes('dessine') || t.includes('crée une photo')) return 'GENERATE_IMAGE';
    if (t.includes('génère une vidéo') || t.includes('crée une vidéo') || t.includes('anime cette image')) return 'GENERATE_VIDEO';
    if (t.includes('recherche') || t.includes('actualité') || t.includes('info récente')) return 'SEARCH';
    if (t.includes('carte') || t.includes('où se trouve') || t.includes('itinéraire')) return 'MAPS';
    if (t.includes('édite cette image') || t.includes('modifie la photo')) return 'EDIT_IMAGE';
    if (t.includes('prononce') || t.includes('dis-le')) return 'TTS';
    if (t.includes('réfléchis') || t.includes('analyse complexe')) return 'THINKING';
    return 'CHAT';
};

export const generateAgentResponse = async (
  history: Message[],
  newMessage: string,
  agent: Agent,
  attachments: Attachment[] = []
): Promise<{ text: string; attachments?: Attachment[] }> => {
  try {
    // 1. Webhook Priority
    if (agent.webhookUrl) {
       // ... (Webhook logic remains same as before)
       // For brevity, assuming webhook handles text only or basic JSON
       // If user sends file, we might need to adapt this part later for multipart
       // For now, fallback to text only for webhook
        const response = await fetch(agent.webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: newMessage,
                history: history.map(h => ({ role: h.role, content: h.content })),
                agentId: agent.id,
                timestamp: new Date().toISOString()
            })
        });

        if (response.ok) {
             const data = await response.json();
             let textResponse = "";
             if (typeof data === 'string') textResponse = data;
             else if (data.output) textResponse = data.output;
             else if (data.text) textResponse = data.text;
             else if (data.message) textResponse = data.message;
             else textResponse = JSON.stringify(data);
             return { text: textResponse };
        }
    }

    const intent = detectIntent(newMessage);
    const hasImage = attachments.some(a => a.type === 'image');
    const hasVideo = attachments.some(a => a.type === 'video');
    const hasAudio = attachments.some(a => a.type === 'audio');

    // --- 2. MULTIMODAL HANDLERS ---

    // A. VIDEO GENERATION (Veo)
    if (intent === 'GENERATE_VIDEO') {
        console.log("🎬 Generating Video...");
        let operation;
        
        if (hasImage) {
             // Image-to-Video
             operation = await ai.models.generateVideos({
                model: 'veo-3.1-fast-generate-preview',
                prompt: newMessage,
                image: {
                    imageBytes: attachments.find(a => a.type === 'image')!.data!,
                    mimeType: 'image/png', // Assuming PNG/JPEG handled in UI conversion
                },
                config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
             });
        } else {
            // Text-to-Video
            operation = await ai.models.generateVideos({
                model: 'veo-3.1-fast-generate-preview',
                prompt: newMessage,
                config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
            });
        }

        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 5000));
            operation = await ai.operations.getVideosOperation({operation: operation});
        }

        const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (videoUri) {
             return {
                 text: "Voici la vidéo générée :",
                 attachments: [{ type: 'generated_video', url: `${videoUri}&key=${apiKey}` }]
             };
        }
        return { text: "Désolé, la génération de vidéo a échoué." };
    }

    // B. IMAGE GENERATION (Nano Banana Pro)
    if (intent === 'GENERATE_IMAGE') {
        console.log("🎨 Generating Image...");
        // Note: Using generateContent for images with Nano Banana models as per guidelines
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-image-preview',
            contents: { parts: [{ text: newMessage }] },
            config: {
                imageConfig: { aspectRatio: "1:1", imageSize: "1K" }
            }
        });

        const generatedParts = response.candidates?.[0]?.content?.parts;
        if (generatedParts) {
            for (const part of generatedParts) {
                if (part.inlineData) {
                    return {
                        text: "Voici l'image que j'ai créée pour vous :",
                        attachments: [{ 
                            type: 'generated_image', 
                            url: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}` 
                        }]
                    };
                }
            }
        }
        return { text: "Je n'ai pas pu générer d'image cette fois-ci." };
    }

    // C. IMAGE EDITING (Nano Banana)
    if (intent === 'EDIT_IMAGE' && hasImage) {
        console.log("🎨 Editing Image...");
        const imagePart = {
            inlineData: {
                mimeType: attachments.find(a => a.type === 'image')!.mimeType || 'image/png',
                data: attachments.find(a => a.type === 'image')!.data!
            }
        };
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [imagePart, { text: newMessage }]
            }
        });
        
         const generatedParts = response.candidates?.[0]?.content?.parts;
         if (generatedParts) {
             for (const part of generatedParts) {
                 if (part.inlineData) {
                     return {
                         text: "Voici l'image modifiée :",
                         attachments: [{ 
                             type: 'generated_image', 
                             url: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}` 
                         }]
                     };
                 }
             }
         }
    }

    // D. TRANSCRIPTION (Audio Input)
    if (hasAudio) {
         console.log("🎤 Transcribing Audio...");
         const audioPart = {
            inlineData: {
                mimeType: 'audio/mp3', // Simplified assumption
                data: attachments.find(a => a.type === 'audio')!.data!
            }
         };
         const response = await ai.models.generateContent({
             model: 'gemini-2.5-flash',
             contents: { parts: [audioPart, { text: "Transcribe this audio." }] }
         });
         return { text: `Transcription: "${response.text}"` };
    }

    // E. VIDEO UNDERSTANDING
    if (hasVideo) {
        console.log("🎥 Analyzing Video...");
        return { text: "L'analyse vidéo approfondie nécessite l'upload via l'API File. (Fonctionnalité simulée pour cet exemple)" };
    }

    // F. TTS (Text to Speech)
    if (intent === 'TTS') {
         console.log("🗣️ Generating Speech...");
         const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-preview-tts',
            contents: { parts: [{ text: newMessage }] },
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } }
            }
         });
         
         const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
         if (audioData) {
             return {
                 text: "Voici l'audio :",
                 attachments: [{ type: 'generated_audio', data: audioData }]
             };
         }
    }


    // --- 3. STANDARD TEXT CHAT (With Grounding & Thinking) ---
    
    let model = 'gemini-2.5-flash';
    let config: any = {
        systemInstruction: agent.systemInstruction,
        temperature: 0.7,
    };

    // Search Grounding
    if (intent === 'SEARCH') {
        console.log("🌍 Using Search Grounding...");
        config.tools = [{ googleSearch: {} }];
    }

    // Maps Grounding
    if (intent === 'MAPS') {
        console.log("📍 Using Maps Grounding...");
        config.tools = [{ googleMaps: {} }];
    }

    // Thinking Mode (Complex Logic)
    if (intent === 'THINKING' || newMessage.length > 200) { // Simple heuristic
        console.log("🧠 Using Thinking Mode...");
        model = 'gemini-3-pro-preview';
        config.thinkingConfig = { thinkingBudget: 1024 }; // Moderate budget
    }

    // Build Contents
    const contents = history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
    }));
    
    // Add current message parts (text + images for analysis)
    const currentParts: any[] = [{ text: newMessage }];
    if (hasImage) {
        // Image Analysis (gemini-3-pro-preview is best for general visual understanding)
        if (model === 'gemini-2.5-flash') model = 'gemini-3-pro-preview'; 
        
        attachments.filter(a => a.type === 'image').forEach(img => {
            currentParts.push({
                inlineData: {
                    mimeType: img.mimeType || 'image/png',
                    data: img.data!
                }
            });
        });
    }
    
    contents.push({ role: 'user', parts: currentParts });

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: contents as any,
      config: config
    });

    // Extract Grounding Metadata if available
    let text = response.text || "Pas de réponse.";
    if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
        const chunks = response.candidates[0].groundingMetadata.groundingChunks;
        const links = chunks
            .filter((c: any) => c.web?.uri)
            .map((c: any) => `[${c.web.title}](${c.web.uri})`)
            .join(', ');
        if (links) text += `\n\nSources: ${links}`;
    }

    return { text };

  } catch (error) {
    console.error("Agent API Error:", error);
    return { text: "Une erreur technique est survenue. Veuillez réessayer." };
  }
};