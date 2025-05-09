
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useClan } from '@/contexts/ClanContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Settings, User, Link as LinkIcon } from 'lucide-react';

const SettingsPage = () => {
  const { user, isAdmin, requestUsernameChange } = useAuth();
  const { clanData, updateClanName, updateSocialLinks } = useClan();
  const { toast } = useToast();
  const [newUsername, setNewUsername] = useState('');
  const [newDiscordLink, setNewDiscordLink] = useState(clanData.socialLinks.discord);
  const [newYoutubeLink, setNewYoutubeLink] = useState(clanData.socialLinks.youtube);
  const [newClanName, setNewClanName] = useState(clanData.name);

  const handleUsernameChange = (e) => {
    e.preventDefault();
    try {
      requestUsernameChange(newUsername);
      setNewUsername('');
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSocialLinksUpdate = (e) => {
    e.preventDefault();
    updateSocialLinks({
      discord: newDiscordLink,
      youtube: newYoutubeLink
    });
    toast({
      title: "Success",
      description: "Social links updated successfully",
    });
  };

  const handleClanNameUpdate = (e) => {
    e.preventDefault();
    updateClanName(newClanName);
    toast({
      title: "Success",
      description: "Clan name updated successfully",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center mb-6">
          <Settings className="h-6 w-6 mr-2 text-discord-blurple" />
          <h1 className="text-2xl font-bold text-white">Settings</h1>
        </div>

        <div className="grid gap-6 max-w-2xl">
          {/* Username Change */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Username Settings
              </CardTitle>
              <CardDescription>Change your username</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUsernameChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newUsername">New Username</Label>
                  <Input
                    id="newUsername"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="Enter new username"
                  />
                </div>
                <Button type="submit">Request Username Change</Button>
              </form>
            </CardContent>
          </Card>

          {/* Admin Only Settings */}
          {isAdmin && (
            <>
              {/* Clan Name Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Clan Name Settings</CardTitle>
                  <CardDescription>Update the clan name</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleClanNameUpdate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="clanName">Clan Name</Label>
                      <Input
                        id="clanName"
                        value={newClanName}
                        onChange={(e) => setNewClanName(e.target.value)}
                        placeholder="Enter new clan name"
                      />
                    </div>
                    <Button type="submit">Update Clan Name</Button>
                  </form>
                </CardContent>
              </Card>

              {/* Social Links Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <LinkIcon className="h-5 w-5 mr-2" />
                    Social Links
                  </CardTitle>
                  <CardDescription>Manage social media links</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSocialLinksUpdate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="discordLink">Discord Invite Link</Label>
                      <Input
                        id="discordLink"
                        value={newDiscordLink}
                        onChange={(e) => setNewDiscordLink(e.target.value)}
                        placeholder="Enter Discord invite link"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="youtubeLink">YouTube Channel Link</Label>
                      <Input
                        id="youtubeLink"
                        value={newYoutubeLink}
                        onChange={(e) => setNewYoutubeLink(e.target.value)}
                        placeholder="Enter YouTube channel link"
                      />
                    </div>
                    <Button type="submit">Update Social Links</Button>
                  </form>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsPage;
