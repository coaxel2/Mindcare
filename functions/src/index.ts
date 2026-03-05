import { onCall, HttpsError } from 'firebase-functions/v2/https';
import OpenAI from 'openai';

const SYSTEM_PROMPT = `Tu es un compagnon bienveillant de bien-être mental pour des jeunes de 18 à 24 ans.
Tu t'appelles MindCare. Tu réponds toujours en français.

Ton ton est :
- Empathique et chaleureux
- Encourageant et non-jugeant
- Simple et accessible
- Adapté aux jeunes adultes (tu tutoies l'utilisateur)

Règles strictes :
- Tu ne donnes JAMAIS de diagnostic médical.
- Tu ne prescris JAMAIS de médicament.
- Tu ne remplaces PAS un professionnel de santé mentale.
- Quand quelqu'un semble en détresse sévère, tu recommandes de contacter :
  • Le 3114 (numéro national de prévention du suicide, 24h/24)
  • Le Fil Santé Jeunes (0 800 235 236, 9h-23h)

Ce que tu fais :
- Tu écoutes activement et reformules les émotions.
- Tu poses des questions ouvertes pour encourager la réflexion.
- Tu valides les émotions sans minimiser.
- Tu proposes des exercices simples (respiration, écriture, micro-actions positives).
- Tu rappelles que demander de l'aide est un acte de courage.

Garde tes réponses concises (2-4 phrases max), sauf si l'utilisateur demande plus de détails.`;

export const sendMessage = onCall(
  {
    region: 'europe-west1',
    maxInstances: 10,
  },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Vous devez être connecté.');
    }

    const { userMessage, conversationHistory } = request.data;

    if (!userMessage || typeof userMessage !== 'string') {
      throw new HttpsError('invalid-argument', 'Message invalide.');
    }

    if (userMessage.length > 2000) {
      throw new HttpsError('invalid-argument', 'Message trop long (2000 caractères max).');
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return {
        reply: "Je suis en cours de configuration. En attendant, n'hésite pas à écrire ce que tu ressens — le simple fait de poser des mots sur tes émotions peut t'aider.",
      };
    }

    try {
      const openai = new OpenAI({ apiKey });

      const messages = [
        { role: 'system' as const, content: SYSTEM_PROMPT },
        ...(conversationHistory || []).slice(-20).map((msg: { role: string; content: string }) => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        })),
        { role: 'user' as const, content: userMessage },
      ];

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages,
        max_tokens: 500,
        temperature: 0.7,
      });

      const reply =
        completion.choices[0]?.message?.content ??
        "Désolé, je n'ai pas pu générer une réponse. Réessaie dans quelques instants.";

      return { reply };
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new HttpsError(
        'internal',
        "Une erreur est survenue. Réessaie dans quelques instants."
      );
    }
  }
);
