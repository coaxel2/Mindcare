import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ArrowLeft, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../hooks/useChat';
import { useDistressDetection } from '../hooks/useDistressDetection';
import { useNavigate } from 'react-router-dom';
import { EMERGENCY_RESOURCES } from '../constants/resources';
import type { Message } from '../types';

function ChatBubble({ message, isUser }: { message: Message; isUser: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}
    >
      <div
        className={`max-w-[80%] px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? 'bg-chat-user text-white rounded-2xl rounded-br-md'
            : 'bg-chat-ai text-text-primary rounded-2xl rounded-bl-md'
        }`}
      >
        {message.content}
      </div>
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start mb-3">
      <div className="bg-chat-ai rounded-2xl rounded-bl-md px-4 py-3 flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-violet-300 rounded-full"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    </div>
  );
}

function DistressAlertModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl"
      >
        <div className="text-center mb-4">
          <div className="w-14 h-14 bg-danger-light rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">💜</span>
          </div>
          <h2 className="text-xl font-bold font-[family-name:var(--font-family-heading)]">
            {EMERGENCY_RESOURCES.title}
          </h2>
          <p className="text-text-secondary text-sm mt-2">
            {EMERGENCY_RESOURCES.message}
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {EMERGENCY_RESOURCES.contacts.map((contact) => (
            <a
              key={contact.phone}
              href={`tel:${contact.phone.replace(/\s/g, '')}`}
              className="flex items-center justify-between p-3 bg-violet-50 rounded-xl hover:bg-violet-100 transition-colors"
            >
              <div>
                <p className="font-medium text-sm text-text-primary">{contact.name}</p>
                <p className="text-text-muted text-xs">{contact.available}</p>
              </div>
              <span className="text-violet-500 font-bold text-lg">{contact.phone}</span>
            </a>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-violet-500 text-white font-medium rounded-full hover:bg-violet-600 transition-colors text-sm"
        >
          Continuer la discussion
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function ChatPage() {
  const { user } = useAuth();
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const {
    messages,
    conversations,
    activeConversationId,
    isSending,
    sendMessage,
    startNewConversation,
    loadConversation,
  } = useChat(user?.uid ?? '');
  const { checkForDistress, showAlert, dismissAlert } = useDistressDetection();
  const [input, setInput] = useState('');
  const [showConversations, setShowConversations] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (conversationId) {
      loadConversation(conversationId);
    }
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isSending) return;
    const text = input.trim();
    setInput('');
    checkForDistress(text);
    await sendMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-bg">
      {/* Chat Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 bg-bg-card border-b border-border">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowConversations(!showConversations)}
            className="text-text-secondary hover:text-violet-500 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="font-semibold text-sm font-[family-name:var(--font-family-heading)]">
              MindCare
            </h2>
            <p className="text-[11px] text-green-500 font-medium">En ligne</p>
          </div>
        </div>
        <button
          onClick={() => {
            startNewConversation();
            navigate('/app/chat');
          }}
          className="text-text-muted hover:text-violet-500 transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Conversation list sidebar */}
      <AnimatePresence>
        {showConversations && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="absolute top-0 left-0 bottom-0 w-72 bg-bg-card border-r border-border z-40 overflow-y-auto"
          >
            <div className="p-4">
              <h3 className="font-semibold mb-3 font-[family-name:var(--font-family-heading)]">
                Conversations
              </h3>
              <div className="space-y-2">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => {
                      navigate(`/app/chat/${conv.id}`);
                      setShowConversations(false);
                    }}
                    className={`w-full text-left p-3 rounded-xl text-sm transition-colors ${
                      conv.id === activeConversationId
                        ? 'bg-violet-50 text-violet-600'
                        : 'hover:bg-gray-50 text-text-secondary'
                    }`}
                  >
                    <p className="font-medium truncate">{conv.title}</p>
                    <p className="text-[11px] text-text-muted mt-0.5">
                      {conv.messageCount} messages
                    </p>
                  </button>
                ))}
                {conversations.length === 0 && (
                  <p className="text-text-muted text-sm">Aucune conversation</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-2xl bg-violet-100 flex items-center justify-center mb-4">
              <span className="text-3xl">💬</span>
            </div>
            <h3 className="font-semibold text-lg mb-2 font-[family-name:var(--font-family-heading)]">
              Commence une conversation
            </h3>
            <p className="text-text-secondary text-sm max-w-xs">
              Dis-moi comment tu te sens ou pose-moi une question. Je suis là pour t'écouter.
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <ChatBubble
            key={msg.id}
            message={msg}
            isUser={msg.role === 'user'}
          />
        ))}

        {isSending && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 px-4 py-3 bg-bg-card border-t border-border">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Écris ton message..."
            rows={1}
            className="flex-1 px-4 py-3 rounded-2xl border border-border bg-bg focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none transition-all resize-none text-sm max-h-28"
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleSend}
            disabled={!input.trim() || isSending}
            className="w-11 h-11 flex items-center justify-center bg-violet-500 text-white rounded-full hover:bg-violet-600 transition-colors disabled:opacity-40 flex-shrink-0"
          >
            <Send size={18} />
          </motion.button>
        </div>
      </div>

      {/* Distress Alert */}
      <AnimatePresence>
        {showAlert && <DistressAlertModal onClose={dismissAlert} />}
      </AnimatePresence>
    </div>
  );
}
