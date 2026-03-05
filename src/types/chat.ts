import type { Timestamp } from 'firebase/firestore';

export type MessageRole = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: Timestamp;
  flagged: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  messageCount: number;
}
