
import React from 'react';
import { useParams, Outlet } from 'react-router-dom';
import { useClan } from '@/contexts/ClanContext';
import ChatArea from '@/components/chat/ChatArea';
import { motion } from 'framer-motion';

const DashboardPage = () => {
  const { channelType, channelId } = useParams();
  const { clanData } = useClan();

  let currentChannel;
  if (channelType && channelId) {
    if (channelType === 'info') {
      currentChannel = clanData.infoChannels.find(c => c.id === channelId);
    } else if (channelType === 'chat') {
      currentChannel = clanData.chatChannels.find(c => c.id === channelId);
    } else if (channelType === 'application') {
      currentChannel = clanData.applicationChannels.find(c => c.id === channelId);
    }
  }
  
  return (
    <div className="flex-1 flex flex-col">
      <header className="h-12 bg-discord-darkNotBlack shadow-md flex items-center px-4 border-b border-discord-dark">
        {currentChannel ? (
          <h2 className="text-white font-semibold">
            <span className="text-discord-greyple mr-1">#</span>
            {currentChannel.name}
          </h2>
        ) : (
          <h2 className="text-white font-semibold">Dashboard</h2>
        )}
      </header>
      
      <div className="flex-1 overflow-hidden">
        {currentChannel ? (
          <ChatArea
            channelId={channelId}
            channelName={currentChannel.name}
            type={channelType}
          />
        ) : (
          <Outlet />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
