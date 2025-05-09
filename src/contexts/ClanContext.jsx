
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const ClanContext = createContext(null);

const initialClanData = {
  name: "My CoD Clan",
  ownerEmail: "aladhamm666@gmail.com",
  socialLinks: {
    discord: "https://discord.gg/example",
    youtube: "https://youtube.com/@example"
  },
  roles: [
    { id: 'owner', name: 'Owner', color: 'text-discord-red' },
    { id: 'admin', name: 'Admin', color: 'text-discord-yellow' },
    { id: 'member', name: 'Member', color: 'text-discord-green' },
    { id: 'guest', name: 'Guest', color: 'text-discord-greyple' },
  ],
  infoChannels: [
    { id: 'welcome', name: 'welcome', content: 'Welcome to the clan! Check out #rules.' },
    { id: 'rules', name: 'rules', content: '1. Be respectful. 2. No cheating. 3. Have fun!' },
    { id: 'announcements', name: 'announcements', content: 'New tournament next week!' },
    { id: 'username-requests', name: 'username-requests', content: 'Username change requests will appear here.' },
  ],
  chatChannels: [
    { id: 'general', name: 'general-chat' },
    { id: 'cod-strategy', name: 'cod-strategy' },
  ],
  applicationChannels: [
    { 
      id: 'admin-apply', 
      name: 'admin-applications', 
      questions: [
        "Why do you want to be an admin?",
        "What is your experience with CoD 1 (2003)?",
        "How active can you be?",
        "Describe a situation where you had to resolve a conflict."
      ] 
    },
  ],
  messages: {},
  applications: {},
  settings: {
    sidebarCollapsed: false
  }
};

const getStoredClanData = () => {
  try {
    const storedData = localStorage.getItem('clanAppData');
    return storedData ? JSON.parse(storedData) : null;
  } catch (error) {
    console.warn('Unable to access localStorage:', error);
    return null;
  }
};

const setStoredClanData = (data) => {
  try {
    if (data) {
      localStorage.setItem('clanAppData', JSON.stringify(data));
    } else {
      localStorage.removeItem('clanAppData');
    }
    return true;
  } catch (error) {
    console.warn('Unable to access localStorage:', error);
    return false;
  }
};

export const ClanProvider = ({ children }) => {
  const [clanData, setClanData] = useState(() => {
    const storedData = getStoredClanData();
    return storedData || initialClanData;
  });
  
  const { user } = useAuth();

  useEffect(() => {
    setStoredClanData(clanData);
  }, [clanData]);

  useEffect(() => {
    if (user) {
      // Add welcome message when user joins
      const welcomeMessage = {
        id: Date.now().toString(),
        userId: 'system',
        username: 'System',
        text: `Welcome ${user.username} to the clan!`,
        timestamp: new Date().toISOString()
      };
      
      addMessage('welcome', welcomeMessage);
    }
  }, [user]);

  const updateClanName = (newName) => {
    setClanData(prev => ({ ...prev, name: newName }));
  };

  const updateSocialLinks = (newLinks) => {
    setClanData(prev => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, ...newLinks }
    }));
  };

  const toggleSidebar = () => {
    setClanData(prev => ({
      ...prev,
      settings: { ...prev.settings, sidebarCollapsed: !prev.settings.sidebarCollapsed }
    }));
  };

  const updateChannel = (channelType, channelId, updates) => {
    setClanData(prev => {
      const channelArrayKey = `${channelType}Channels`;
      if (!prev[channelArrayKey]) return prev;

      const updatedChannels = prev[channelArrayKey].map(channel =>
        channel.id === channelId ? { ...channel, ...updates } : channel
      );

      return {
        ...prev,
        [channelArrayKey]: updatedChannels,
      };
    });
  };

  const addMessage = (channelId, message) => {
    setClanData(prev => ({
      ...prev,
      messages: {
        ...prev.messages,
        [channelId]: [...(prev.messages[channelId] || []), message],
      },
    }));
  };

  const submitApplication = (channelId, application) => {
    setClanData(prev => ({
      ...prev,
      applications: {
        ...prev.applications,
        [channelId]: [...(prev.applications[channelId] || []), application],
      },
    }));
  };

  return (
    <ClanContext.Provider value={{
      clanData,
      updateClanName,
      updateChannel,
      addMessage,
      submitApplication,
      setClanData,
      updateSocialLinks,
      toggleSidebar
    }}>
      {children}
    </ClanContext.Provider>
  );
};

export const useClan = () => useContext(ClanContext);
