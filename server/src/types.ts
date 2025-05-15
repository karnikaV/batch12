export interface User {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'lawyer';
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: 'client' | 'lawyer';
  content: string;
  timestamp: string;
  isAI?: boolean;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface Conversation {
  id: string;
  participants: {
    id: string;
    name: string;
    role: 'client' | 'lawyer';
  }[];
  lastMessage?: Message;
  unreadCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface SocketUser {
  userId: string;
  socketId: string;
  userRole: 'client' | 'lawyer';
} 