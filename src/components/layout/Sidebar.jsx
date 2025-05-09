
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Settings, LogOut, Users, Hash, Info, FileText, MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useClan } from '@/contexts/ClanContext';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { clanData } = useClan();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const channelIcon = (type) => {
    switch(type) {
      case 'info': return <Info className="h-4 w-4 mr-2" />;
      case 'chat': return <MessageSquare className="h-4 w-4 mr-2" />;
      case 'application': return <FileText className="h-4 w-4 mr-2" />;
      default: return <Hash className="h-4 w-4 mr-2" />;
    }
  }

  return (
    <motion.div 
      initial={{ x: -240 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="w-60 bg-discord-dark flex flex-col"
    >
      {/* Server Name Header */}
      <div className="h-12 flex items-center justify-between px-3 shadow-md bg-discord-darker">
        <h1 className="font-bold text-white truncate">{clanData.name}</h1>
        {/* Placeholder for server options dropdown */}
        <Button variant="ghost" size="icon" className="text-discord-greyple hover:text-white">
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      {/* Channel List */}
      <ScrollArea className="flex-1 p-2 space-y-1">
        {clanData.infoChannels.length > 0 && (
          <div className="mb-2">
            <h2 className="px-2 text-xs font-semibold text-discord-greyple uppercase tracking-wide">Info Channels</h2>
            {clanData.infoChannels.map(channel => (
              <Link key={channel.id} to={`/channel/info/${channel.id}`}>
                <Button variant="ghost" className="w-full justify-start text-discord-textMuted hover:bg-discord-light hover:text-white">
                  {channelIcon('info')} {channel.name}
                </Button>
              </Link>
            ))}
          </div>
        )}

        {clanData.chatChannels.length > 0 && (
          <div className="mb-2">
            <h2 className="px-2 text-xs font-semibold text-discord-greyple uppercase tracking-wide">Text Channels</h2>
            {clanData.chatChannels.map(channel => (
              <Link key={channel.id} to={`/channel/chat/${channel.id}`}>
                <Button variant="ghost" className="w-full justify-start text-discord-textMuted hover:bg-discord-light hover:text-white">
                  {channelIcon('chat')} {channel.name}
                </Button>
              </Link>
            ))}
          </div>
        )}
        
        {clanData.applicationChannels.length > 0 && (
          <div className="mb-2">
            <h2 className="px-2 text-xs font-semibold text-discord-greyple uppercase tracking-wide">Applications</h2>
            {clanData.applicationChannels.map(channel => (
              <Link key={channel.id} to={`/channel/application/${channel.id}`}>
                <Button variant="ghost" className="w-full justify-start text-discord-textMuted hover:bg-discord-light hover:text-white">
                  {channelIcon('application')} {channel.name}
                </Button>
              </Link>
            ))}
          </div>
        )}

        <div className="mb-2">
          <h2 className="px-2 text-xs font-semibold text-discord-greyple uppercase tracking-wide">Roles</h2>
          {clanData.roles.map(role => (
            <div key={role.id} className={`flex items-center px-2 py-1 text-sm ${role.color || 'text-discord-textMuted'}`}>
              <Users className="h-4 w-4 mr-2" /> {role.name}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* User Panel */}
      {user && (
        <div className="h-14 bg-discord-darker p-2 flex items-center justify-between border-t border-discord-dark">
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src={`https://api.dicebear.com/7.x/micah/svg?seed=${user.username}`} alt={user.username} />
              <AvatarFallback>{user.username ? user.username.substring(0, 2).toUpperCase() : '??'}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-white">{user.username}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon" className="text-discord-greyple hover:text-white" onClick={() => navigate('/settings/profile')}>
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-discord-greyple hover:text-white" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Sidebar;
  