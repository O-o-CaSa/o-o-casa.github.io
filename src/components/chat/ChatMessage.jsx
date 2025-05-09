
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const ChatMessage = ({ message }) => {
  const { username, text, timestamp } = message;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start space-x-3 p-2 hover:bg-discord-light group rounded-md"
    >
      <Avatar className="h-10 w-10">
        <AvatarImage src={`https://api.dicebear.com/7.x/micah/svg?seed=${username}`} />
        <AvatarFallback>{username.substring(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline space-x-2">
          <span className="font-medium text-white">{username}</span>
          <span className="text-xs text-discord-greyple">
            {format(new Date(timestamp), 'HH:mm')}
          </span>
        </div>
        <p className="text-discord-textMuted break-words">{text}</p>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
