
import React, { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatMessage from '@/components/chat/ChatMessage';
import ChatInput from '@/components/chat/ChatInput';
import { useAuth } from '@/contexts/AuthContext';
import { useClan } from '@/contexts/ClanContext';
import { motion } from 'framer-motion';

const ChatArea = ({ channelId, channelName, type }) => {
  const { user } = useAuth();
  const { clanData, addMessage } = useClan();
  const scrollRef = useRef();

  const messages = clanData.messages[channelId] || [];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = (text) => {
    const newMessage = {
      id: Date.now().toString(),
      userId: user.id,
      username: user.username,
      text,
      timestamp: new Date().toISOString()
    };
    addMessage(channelId, newMessage);
  };

  return (
    <div className="flex flex-col h-full">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 overflow-hidden"
      >
        <ScrollArea className="h-full">
          <div className="p-4 space-y-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>
      </motion.div>
      {type === 'chat' && <ChatInput onSendMessage={handleSendMessage} />}
    </div>
  );
};

export default ChatArea;
