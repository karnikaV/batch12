import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User>, password: string) => Promise<void>;
  logout: () => void;
  invites: Invite[];
  addInvite: (invite: Invite) => void;
  acceptInvite: (inviteId: string) => void;
  declineInvite: (inviteId: string) => void;
  removeInvite: (inviteId: string) => void;
  verifyLawyer: (lawyerId: string, barCouncilId: string) => void;
}

export interface Invite {
  id: string;
  from: User;
  to: string;
  message: string;
  timestamp: string;
  conversationId?: string;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  invites: [],
  addInvite: () => {},
  acceptInvite: () => {},
  declineInvite: () => {},
  removeInvite: () => {},
  verifyLawyer: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [invites, setInvites] = useState<Invite[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('legalConnectUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    // Load invites from localStorage
    const savedInvites = localStorage.getItem('legalConnectInvites');
    if (savedInvites) {
      const parsedInvites = JSON.parse(savedInvites);
      console.log('Loading invites from localStorage:', parsedInvites);
      setInvites(parsedInvites);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Get all users from localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const foundUser = users.find((u: any) => u.email === email);
      if (!foundUser) throw new Error('User not found');
      setUser(foundUser);
      localStorage.setItem('legalConnectUser', JSON.stringify(foundUser));
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (userData: Partial<User>, password: string) => {
    try {
      // Get all users from localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      // Create new user object
      const newUser = {
        id: Math.random().toString(36).substring(2, 9),
        name: userData.name || 'User',
        email: userData.email || '',
        role: userData.role || 'client',
        verified: userData.role === 'lawyer' ? false : true, // Only lawyers need verification
        barCouncilId: userData.role === 'lawyer' ? userData.barCouncilId : undefined,
        specialization: userData.role === 'lawyer' ? userData.specialization : undefined,
        experience: userData.role === 'lawyer' ? userData.experience : undefined,
      };
      // Add to users array and save
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      // Set as current user
      setUser(newUser);
      localStorage.setItem('legalConnectUser', JSON.stringify(newUser));
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const verifyLawyer = (lawyerId: string, barCouncilId: string) => {
    try {
      // Get all users from localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.map((u: User) => 
        u.id === lawyerId ? { ...u, verified: true, barCouncilId } : u
      );
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      // Update current user if it's the lawyer being verified
      if (user?.id === lawyerId) {
        const updatedUser = { ...user, verified: true, barCouncilId };
        setUser(updatedUser);
        localStorage.setItem('legalConnectUser', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Lawyer verification failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('legalConnectUser');
  };

  const addInvite = (invite: Invite) => {
    console.log('Adding new invite:', invite);
    setInvites(prev => {
      const newInvites = [...prev, invite];
      console.log('Updated invites state:', newInvites);
      return newInvites;
    });
    // Store invites in localStorage
    const storedInvites = JSON.parse(localStorage.getItem('legalConnectInvites') || '[]');
    const updatedInvites = [...storedInvites, invite];
    console.log('Storing invites in localStorage:', updatedInvites);
    localStorage.setItem('legalConnectInvites', JSON.stringify(updatedInvites));
  };

  const removeInvite = (inviteId: string) => {
    setInvites(prev => prev.filter(inv => inv.id !== inviteId));
    // Update localStorage
    const storedInvites = JSON.parse(localStorage.getItem('legalConnectInvites') || '[]');
    localStorage.setItem('legalConnectInvites', JSON.stringify(storedInvites.filter((inv: Invite) => inv.id !== inviteId)));
  };

  const acceptInvite = (inviteId: string) => {
    const invite = invites.find(inv => inv.id === inviteId);
    if (invite) {
      // Create a new conversation
      const conversationId = Math.random().toString(36).substring(2, 9);
      
      // Get existing conversations
      const conversations = JSON.parse(localStorage.getItem('conversations') || '[]');
      
      // Add new conversation
      const newConversation = {
        id: conversationId,
        participants: [
          invite.from,
          { id: user?.id || '', name: user?.name || '', email: user?.email || '', role: user?.role || '' }
        ],
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      localStorage.setItem('conversations', JSON.stringify([...conversations, newConversation]));
      
      // Remove the invite
      removeInvite(inviteId);
      
      return conversationId;
    }
    return null;
  };

  const declineInvite = (inviteId: string) => {
    console.log('Declining invite:', inviteId);
    // Remove the invite
    removeInvite(inviteId);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      register, 
      logout,
      invites,
      addInvite,
      acceptInvite,
      declineInvite,
      removeInvite,
      verifyLawyer
    }}>
      {children}
    </AuthContext.Provider>
  );
};