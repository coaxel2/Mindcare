import { useState, useEffect, useCallback } from 'react';
import { Timestamp } from 'firebase/firestore';
import {
  createConversation,
  getConversations,
  saveMessage,
  getMessages,
  deleteConversation as deleteChatConversation,
  getAIResponse,
} from '../services/chat.service';
import type { Message, Conversation } from '../types';

export const useChat = (uid: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const loadConversations = useCallback(async () => {
    if (!uid) return;
    setIsLoading(true);
    try {
      const convos = await getConversations(uid);
      setConversations(convos);
    } finally {
      setIsLoading(false);
    }
  }, [uid]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const loadConversation = useCallback(
    async (conversationId: string) => {
      if (!uid) return;
      setIsLoading(true);
      try {
        const msgs = await getMessages(uid, conversationId);
        setMessages(msgs);
        setActiveConversationId(conversationId);
      } finally {
        setIsLoading(false);
      }
    },
    [uid]
  );

  const startNewConversation = useCallback(() => {
    setActiveConversationId(null);
    setMessages([]);
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!uid) return;
      setIsSending(true);
      try {
        let convId = activeConversationId;
        if (!convId) {
          const conv = await createConversation(uid);
          convId = conv.id;
          setActiveConversationId(convId);
          setConversations((prev) => [conv, ...prev]);
        }

        const userMessage: Omit<Message, 'id'> = {
          role: 'user',
          content,
          createdAt: Timestamp.now(),
          flagged: false,
        };

        const userMsgId = await saveMessage(uid, convId, userMessage);
        const userMsgWithId: Message = { ...userMessage, id: userMsgId };
        setMessages((prev) => [...prev, userMsgWithId]);

        const history = [...messages, userMsgWithId].map((m) => ({
          role: m.role,
          content: m.content,
        }));
        const aiResponseText = await getAIResponse(content, history);

        const aiMessage: Omit<Message, 'id'> = {
          role: 'assistant',
          content: aiResponseText,
          createdAt: Timestamp.now(),
          flagged: false,
        };

        const aiMsgId = await saveMessage(uid, convId, aiMessage);
        setMessages((prev) => [...prev, { ...aiMessage, id: aiMsgId }]);

        await loadConversations();
      } finally {
        setIsSending(false);
      }
    },
    [uid, activeConversationId, messages, loadConversations]
  );

  const deleteConversation = useCallback(
    async (conversationId: string) => {
      await deleteChatConversation(uid, conversationId);
      setConversations((prev) => prev.filter((c) => c.id !== conversationId));
      if (activeConversationId === conversationId) {
        setActiveConversationId(null);
        setMessages([]);
      }
    },
    [uid, activeConversationId]
  );

  return {
    messages,
    conversations,
    activeConversationId,
    isLoading,
    isSending,
    sendMessage,
    startNewConversation,
    loadConversation,
    deleteConversation,
  };
};
