import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
  increment,
  Timestamp,
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '../config/firebase';
import type { Message, Conversation } from '../types';

export const createConversation = async (uid: string): Promise<Conversation> => {
  const conversationsRef = collection(db, 'users', uid, 'conversations');
  const newConversation = {
    title: 'Nouvelle conversation',
    messageCount: 0,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
  const docRef = await addDoc(conversationsRef, newConversation);
  const snapshot = await getDoc(docRef);
  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as Conversation;
};

export const getConversations = async (uid: string): Promise<Conversation[]> => {
  const conversationsRef = collection(db, 'users', uid, 'conversations');
  const q = query(conversationsRef, orderBy('updatedAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as Conversation[];
};

export const saveMessage = async (
  uid: string,
  conversationId: string,
  message: Omit<Message, 'id'>
): Promise<string> => {
  const messagesRef = collection(
    db,
    'users',
    uid,
    'conversations',
    conversationId,
    'messages'
  );
  const docRef = await addDoc(messagesRef, message);

  const conversationRef = doc(db, 'users', uid, 'conversations', conversationId);
  await updateDoc(conversationRef, {
    messageCount: increment(1),
    updatedAt: Timestamp.now(),
  });

  return docRef.id;
};

export const getMessages = async (
  uid: string,
  conversationId: string
): Promise<Message[]> => {
  const messagesRef = collection(
    db,
    'users',
    uid,
    'conversations',
    conversationId,
    'messages'
  );
  const q = query(messagesRef, orderBy('createdAt', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as Message[];
};

export const deleteConversation = async (
  uid: string,
  conversationId: string
): Promise<void> => {
  const conversationRef = doc(db, 'users', uid, 'conversations', conversationId);
  await deleteDoc(conversationRef);
};

export const getAIResponse = async (
  userMessage: string,
  conversationHistory: { role: string; content: string }[]
): Promise<string> => {
  try {
    const sendMessageFn = httpsCallable<
      { userMessage: string; conversationHistory: { role: string; content: string }[] },
      { reply: string }
    >(functions, 'sendMessage');

    const result = await sendMessageFn({ userMessage, conversationHistory });
    return result.data.reply;
  } catch {
    return "Je suis désolé, je ne peux pas répondre pour le moment. Le service IA n'est pas encore configuré. Mais je suis là pour toi — n'hésite pas à écrire ce que tu ressens.";
  }
};
