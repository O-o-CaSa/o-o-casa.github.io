
import React from 'react';
import Sidebar from '@/components/layout/Sidebar';
import MembersSidebar from '@/components/layout/MembersSidebar';
import MainContentArea from '@/components/layout/MainContentArea';
import { Toaster } from '@/components/ui/toaster';
import { motion } from 'framer-motion';
import { useClan } from '@/contexts/ClanContext';

const AppLayout = ({ children }) => {
  const { clanData } = useClan();

  return (
    <div className="flex h-screen bg-discord-darker text-discord-textMuted">
      <Sidebar />
      <MainContentArea>
        {children}
      </MainContentArea>
      <MembersSidebar />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="fixed bottom-2 right-2 text-xs text-discord-greyple bg-discord-dark p-2 rounded shadow-lg"
      >
        Made By CaSa
      </motion.div>
      <Toaster />
    </div>
  );
};

export default AppLayout;
