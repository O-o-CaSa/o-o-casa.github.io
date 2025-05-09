
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

const AuthContext = createContext(null);

const ADMIN_EMAIL = "aladhamm666@gmail.com";

const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem('clanUser');
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.warn('Unable to access localStorage:', error);
    return null;
  }
};

const getStoredUsers = () => {
  try {
    const storedUsers = localStorage.getItem('clanUsers');
    return storedUsers ? JSON.parse(storedUsers) : [];
  } catch (error) {
    console.warn('Unable to access localStorage:', error);
    return [];
  }
};

const setStoredUser = (userData) => {
  try {
    if (userData) {
      localStorage.setItem('clanUser', JSON.stringify(userData));
    } else {
      localStorage.removeItem('clanUser');
    }
    return true;
  } catch (error) {
    console.warn('Unable to access localStorage:', error);
    return false;
  }
};

const setStoredUsers = (users) => {
  try {
    localStorage.setItem('clanUsers', JSON.stringify(users));
    return true;
  } catch (error) {
    console.warn('Unable to access localStorage:', error);
    return false;
  }
};

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const initialUser = getStoredUser();
    const initialUsers = getStoredUsers();
    if (initialUser) {
      setUser(initialUser);
    }
    setUsers(initialUsers);
    setLoading(false);
  }, []);

  const register = (userData) => {
    if (!validateEmail(userData.email)) {
      throw new Error('Invalid email format');
    }

    const existingUser = users.find(u => u.email === userData.email || u.username === userData.username);
    if (existingUser) {
      throw new Error('Email or username already exists');
    }

    const isAdmin = userData.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
    const newUser = {
      ...userData,
      id: Date.now().toString(),
      role: isAdmin ? 'admin' : 'member',
      status: 'online',
      joinedAt: new Date().toISOString()
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    setStoredUsers(updatedUsers);
    setStoredUser(newUser);
    setUser(newUser);
  };

  const login = (credentials) => {
    const foundUser = users.find(u => 
      u.email === credentials.email && u.password === credentials.password
    );

    if (!foundUser) {
      throw new Error('Invalid credentials');
    }

    const loggedInUser = { ...foundUser, status: 'online' };
    setStoredUser(loggedInUser);
    setUser(loggedInUser);

    // Update user status in users list
    const updatedUsers = users.map(u => 
      u.id === loggedInUser.id ? loggedInUser : u
    );
    setUsers(updatedUsers);
    setStoredUsers(updatedUsers);
  };

  const logout = () => {
    if (user) {
      // Update user status to offline
      const updatedUsers = users.map(u => 
        u.id === user.id ? { ...u, status: 'offline' } : u
      );
      setUsers(updatedUsers);
      setStoredUsers(updatedUsers);
    }
    setStoredUser(null);
    setUser(null);
  };

  const requestUsernameChange = (newUsername) => {
    if (!user) return;
    
    const request = {
      userId: user.id,
      currentUsername: user.username,
      newUsername,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };

    // Store username change request
    try {
      const requests = JSON.parse(localStorage.getItem('usernameChangeRequests') || '[]');
      requests.push(request);
      localStorage.setItem('usernameChangeRequests', JSON.stringify(requests));
      
      toast({
        title: "Username Change Requested",
        description: "Your request has been sent to the admin for approval.",
      });
    } catch (error) {
      console.error('Failed to store username change request:', error);
      throw new Error('Failed to submit username change request');
    }
  };

  const approveUsernameChange = (requestId, approved) => {
    try {
      const requests = JSON.parse(localStorage.getItem('usernameChangeRequests') || '[]');
      const requestIndex = requests.findIndex(r => r.userId === requestId);
      
      if (requestIndex === -1) return;
      
      const request = requests[requestIndex];
      
      if (approved) {
        // Update username in users list
        const updatedUsers = users.map(u => 
          u.id === request.userId ? { ...u, username: request.newUsername } : u
        );
        setUsers(updatedUsers);
        setStoredUsers(updatedUsers);
        
        // Update current user if it's them
        if (user?.id === request.userId) {
          const updatedUser = { ...user, username: request.newUsername };
          setUser(updatedUser);
          setStoredUser(updatedUser);
        }
      }
      
      // Remove the request
      requests.splice(requestIndex, 1);
      localStorage.setItem('usernameChangeRequests', JSON.stringify(requests));
      
      toast({
        title: approved ? "Username Changed" : "Request Denied",
        description: approved ? "Your username has been updated." : "Your username change request was denied.",
      });
    } catch (error) {
      console.error('Failed to process username change request:', error);
      throw new Error('Failed to process username change request');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-discord-darker">
        <div className="text-white">Loading authentication...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ 
      user,
      users,
      login,
      logout,
      register,
      requestUsernameChange,
      approveUsernameChange,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin'
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
