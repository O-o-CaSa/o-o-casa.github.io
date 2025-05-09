
import React from 'react';
import { motion } from 'framer-motion';

const MainContentArea = ({ children }) => {
  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex-1 flex flex-col bg-discord-darkNotBlack overflow-hidden"
    >
      {children}
    </motion.main>
  );
};

export default MainContentArea;
  