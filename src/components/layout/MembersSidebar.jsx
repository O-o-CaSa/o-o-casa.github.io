
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useClan } from '@/contexts/ClanContext';
import { motion } from 'framer-motion';

const MembersSidebar = () => {
  const { users } = useAuth();
  const { clanData } = useClan();

  // Group users by role
  const usersByRole = clanData.roles.map(role => ({
    ...role,
    users: users.filter(user => user.role === role.id.toLowerCase())
  }));

  return (
    <motion.div 
      initial={{ x: 240 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="w-60 bg-discord-dark flex flex-col border-l border-discord-darker"
    >
      <div className="h-12 flex items-center px-4 shadow-md bg-discord-darker">
        <h2 className="font-semibold text-white">Members</h2>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {usersByRole.map(role => (
            <div key={role.id} className="space-y-2">
              <h3 className={`text-sm font-semibold ${role.color}`}>
                {role.name} — {role.users.length}
              </h3>
              {role.users.map(user => (
                <div key={user.id} className="flex items-center space-x-2 px-2 py-1 rounded hover:bg-discord-light group">
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`https://api.dicebear.com/7.x/micah/svg?seed=${user.username}`} />
                      <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-discord-dark
                      ${user.status === 'online' ? 'bg-green-500' : 'bg-gray-500'}`} />
                  </div>
                  <span className="text-sm text-discord-textMuted group-hover:text-white">
                    {user.username}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </ScrollArea>
    </motion.div>
  );
};

export default MembersSidebar;
