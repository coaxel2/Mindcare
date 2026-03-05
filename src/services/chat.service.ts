import { IS_DEMO_MODE, db, functions } from '../config/firebase';
import { demoGet, demoSet } from '../utils/demoStorage';
import type { Message, Conversation } from '../types';

// ── Demo mode ─────────────────────────────────────────────────────────────────
const demoConvsKey = (uid: string) => `mindcare_convs_${uid}`;
const demoMsgsKey = (uid: string, cid: string) => `mindcare_msgs_${uid}_${cid}`;

const DEMO_AI_RESPONSES = [
  "Je t'entends, et je suis là pour toi. Comment tu te sens maintenant ?",
  "C'est tout à fait normal de ressentir ça. Peux-tu me dire ce qui t'a amené à penser à ça ?",
  "Merci de partager ça avec moi. Qu'est-ce qui te pèse le plus en ce moment ?",
  "Tu n'es pas seul(e). Est-ce qu'il y a quelque chose de précis qui t'inquiète ?",
  "Je comprends. Parfois, prendre une grande inspiration peut aider. Tu as essayé les exercices de respiration ?",
  "C'est courageux de parler de ce que tu ressens. Qu'est-ce qui pourrait t'aider à te sentir mieux aujourd'hui ?",
];

let demoAiIndex = 0;
function getDemoAiResponse(): string {
  const r = DEMO_AI_RESPONSES[demoAiIndex % DEMO_AI_RESPONSES.length];
  demoAiIndex++;
  return r;
}

// ── Conversations ─────────────────────────────────────────────────────────────
export const createConversation = async (uid: string): Promise<Conversation> => {
  if (IS_DEMO_MODE) {
    const convs = demoGet<Conversation[]>(demoConvsKey(uid), []);
    const conv: Conversation = {
      id: `conv_${Date.now()}`,
      title: 'Nouvelle conversation',
      messageCount: 0,
      createdAt: new Date().toISOString() as never,
      updatedAt: new Date().toISOString() as never,
    };
    demoSet(demoConvsKey(uid), [conv, ...convs]);
    return conv;
  }
  const { collection, addDoc, getDoc, Timestamp } = await import('firebase/firestore');
  const ref = await addDoc(collection(db, 'users', uid, 'conversations'), {
    title: 'Nouvelle conversation',
    messageCount: 0,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  const snap = await getDoc(ref);
  return { id: snap.id, ...snap.data() } as Conversation;
};

export const getConversations = async (uid: string): Promise<Conversation[]> => {
  if (IS_DEMO_MODE) return demoGet<Conversation[]>(demoConvsKey(uid), []);
  const { collection, query, orderBy, getDocs } = await import('firebase/firestore');
  const q = query(collection(db, 'users', uid, 'conversations'), orderBy('updatedAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Conversation[];
};

export const saveMessage = async (
  uid: string,
  conversationId: string,
  message: Omit<Message, 'id'>
): Promise<string> => {
  if (IS_DEMO_MODE) {
    const msgs = demoGet<Message[]>(demoMsgsKey(uid, conversationId), []);
    const id = `msg_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    demoSet(demoMsgsKey(uid, conversationId), [...msgs, { ...message, id }]);
    // update conv count
    const convs = demoGet<Conversation[]>(demoConvsKey(uid), []);
    const updated = convs.map((c) =>
      c.id === conversationId
        ? { ...c, messageCount: c.messageCount + 1, updatedAt: new Date().toISOString() as never }
        : c
    );
    demoSet(demoConvsKey(uid), updated);
    return id;
  }

  const { collection, addDoc, doc, updateDoc, increment, Timestamp } =
    await import('firebase/firestore');
  const ref = await addDoc(
    collection(db, 'users', uid, 'conversations', conversationId, 'messages'),
    message
  );
  await updateDoc(doc(db, 'users', uid, 'conversations', conversationId), {
    messageCount: increment(1),
    updatedAt: Timestamp.now(),
  });
  return ref.id;
};

export const getMessages = async (uid: string, conversationId: string): Promise<Message[]> => {
  if (IS_DEMO_MODE) return demoGet<Message[]>(demoMsgsKey(uid, conversationId), []);
  const { collection, query, orderBy, getDocs } = await import('firebase/firestore');
  const q = query(
    collection(db, 'users', uid, 'conversations', conversationId, 'messages'),
    orderBy('createdAt', 'asc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Message[];
};

export const deleteConversation = async (uid: string, conversationId: string): Promise<void> => {
  if (IS_DEMO_MODE) {
    const convs = demoGet<Conversation[]>(demoConvsKey(uid), []).filter(
      (c) => c.id !== conversationId
    );
    demoSet(demoConvsKey(uid), convs);
    localStorage.removeItem(demoMsgsKey(uid, conversationId));
    return;
  }
  const { doc, deleteDoc } = await import('firebase/firestore');
  await deleteDoc(doc(db, 'users', uid, 'conversations', conversationId));
};

export const getAIResponse = async (
  userMessage: string,
  conversationHistory: { role: string; content: string }[]
): Promise<string> => {
  if (IS_DEMO_MODE) {
    // Simulate a short delay for realism
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 700));
    return getDemoAiResponse();
  }
  try {
    const { httpsCallable } = await import('firebase/functions');
    const fn = httpsCallable<
      { userMessage: string; conversationHistory: { role: string; content: string }[] },
      { reply: string }
    >(functions, 'sendMessage');
    const result = await fn({ userMessage, conversationHistory });
    return result.data.reply;
  } catch {
    return "Je suis désolé, je ne peux pas répondre pour le moment. N'hésite pas à écrire ce que tu ressens.";
  }
};
