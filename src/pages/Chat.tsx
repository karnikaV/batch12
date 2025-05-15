import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import { Paperclip, Send, User, UserCircle, Plus, Users } from 'lucide-react';
import { Message, AIAnalysis, Conversation, User as UserType } from '../types/index';
import { formatTime } from '../utils/dateUtils';
import MessageComponent from '../components/MessageComponent';
import LawyerCard from '../components/LawyerCard';
import InviteModal from '../components/InviteModal';
import { generateIPCAnalysis } from '../data/ipcData';

// Add this helper function at the top-level of the file (outside the component)
async function getHuggingFaceKeywords(text: string): Promise<string[]> {
  try {
    const res = await fetch('http://localhost:5001/api/hf-keywords', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      console.error('Hugging Face API error:', errorData);
      throw new Error(errorData.error || 'Failed to extract keywords');
    }
    
    const data = await res.json();
    
    // data[0] is an array of extracted keywords
    if (!data || !data[0] || !Array.isArray(data[0])) {
      console.warn('Unexpected response format from keyword extraction API:', data);
      return [];
    }
    
    return data[0]?.map((k: any) => k.word) || [];
  } catch (error) {
    console.error('Error in keyword extraction:', error);
    // Re-throw to let the caller handle the error
    throw error;
  }
}

const Chat: React.FC = () => {
  const { conversationId } = useParams<{ conversationId?: string }>();
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();
  const navigate = useNavigate();
  
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(conversationId || null);
  const [availableLawyers, setAvailableLawyers] = useState<UserType[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [onlineLawyers, setOnlineLawyers] = useState<string[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load conversations from localStorage
    const savedConversations = JSON.parse(localStorage.getItem('conversations') || '[]');
    setConversations(savedConversations);

    // Load messages for the current conversation
    if (selectedConversation) {
      const conversation = savedConversations.find((conv: Conversation) => conv.id === selectedConversation);
      if (conversation) {
        setMessages(conversation.messages || []);
        // Reset unreadCount for this conversation
        const updatedConversations = savedConversations.map((conv: Conversation) =>
          conv.id === selectedConversation ? { ...conv, unreadCount: 0 } : conv
        );
        localStorage.setItem('conversations', JSON.stringify(updatedConversations));
        setConversations(updatedConversations);
      }
    }
  }, [selectedConversation]);

  useEffect(() => {
    if (conversationId) {
      setSelectedConversation(conversationId);
    }
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Socket.IO event handlers
  useEffect(() => {
    if (!socket) return;

    socket.on('new-message', (newMessage: Message) => {
      if (newMessage.conversationId === selectedConversation) {
        setMessages(prev => [...prev, newMessage]);
        
        // Update conversation in localStorage
        const conversations = JSON.parse(localStorage.getItem('conversations') || '[]');
        const updatedConversations = conversations.map((conv: Conversation) => {
          if (conv.id === newMessage.conversationId) {
            return {
              ...conv,
              messages: [...(conv.messages || []), newMessage],
              lastMessage: newMessage,
              updatedAt: newMessage.timestamp
            };
          }
          return conv;
        });
        localStorage.setItem('conversations', JSON.stringify(updatedConversations));
      }
    });

    socket.on('typing', ({ conversationId, isTyping, userId }) => {
      if (conversationId === selectedConversation && userId !== user?.id) {
        setIsTyping(isTyping);
      }
    });

    return () => {
      socket.off('new-message');
      socket.off('typing');
    };
  }, [socket, selectedConversation, user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedConversation || !user) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      conversationId: selectedConversation,
      senderId: user.id,
      senderName: user.name,
      senderRole: user.role,
      content: message,
      timestamp: new Date().toISOString(),
    };
    
    // Add message locally
    setMessages(prev => [...prev, newMessage]);
    
    // Update conversation in localStorage
    const conversations = JSON.parse(localStorage.getItem('conversations') || '[]');
    const updatedConversations = conversations.map((conv: Conversation) => {
      if (conv.id === selectedConversation) {
        return {
          ...conv,
          messages: [...(conv.messages || []), newMessage],
          lastMessage: newMessage,
          updatedAt: newMessage.timestamp
        };
      }
      return conv;
    });
    localStorage.setItem('conversations', JSON.stringify(updatedConversations));
    
    // Send via Socket.IO if connected
    if (socket && isConnected) {
      socket.emit('send-message', newMessage);
    }
    
    setMessage('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !user) return;
    
    try {
      setIsUploading(true);
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const fileNames = Array.from(files).map(file => file.name).join(', ');
      
      const fileMessage: Message = {
        id: Date.now().toString(),
        conversationId: selectedConversation || '',
        senderId: user.id,
        senderName: user.name,
        senderRole: user.role,
        content: `Shared file(s): ${fileNames}`,
        timestamp: new Date().toISOString(),
        attachments: Array.from(files).map(file => ({
          id: Math.random().toString(36).substring(2),
          name: file.name,
          url: '#',
          type: file.type,
          size: file.size,
        })),
      };
      
      setMessages(prev => [...prev, fileMessage]);
      
      // Update conversation in localStorage
      const conversations = JSON.parse(localStorage.getItem('conversations') || '[]');
      const updatedConversations = conversations.map((conv: Conversation) => {
        if (conv.id === selectedConversation) {
          return {
            ...conv,
            messages: [...(conv.messages || []), fileMessage],
            lastMessage: fileMessage,
            updatedAt: fileMessage.timestamp
          };
        }
        return conv;
      });
      localStorage.setItem('conversations', JSON.stringify(updatedConversations));
      
      // Send via Socket.IO if connected
      if (socket && isConnected) {
        socket.emit('send-message', fileMessage);
      }
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleInviteLawyer = () => {
    setShowInviteModal(true);
  };

  const handleSendInvite = (email: string, message: string) => {
    if (!user) return;
    
    // 1. Check if lawyer exists, if not, add to users
    let users: UserType[] = JSON.parse(localStorage.getItem('users') || '[]');
    let lawyer = users.find(u => u.email === email && u.role === 'lawyer');
    if (!lawyer) {
      lawyer = {
        id: Date.now().toString(),
        name: email.split('@')[0],
        email,
        role: 'lawyer'
      };
      users.push(lawyer);
      localStorage.setItem('users', JSON.stringify(users));
    }

    // 2. Check if conversation exists, if not, create it
    let conversations: Conversation[] = JSON.parse(localStorage.getItem('conversations') || '[]');
    let conversation = conversations.find(conv =>
      conv.participants.some(p => p.id === user.id) &&
      conv.participants.some(p => p.id === lawyer!.id)
    );
    if (!conversation) {
      conversation = {
        id: Date.now().toString(),
        participants: [
          { id: user.id, name: user.name, role: user.role },
          { id: lawyer.id, name: lawyer.name, role: lawyer.role }
        ],
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      conversations.push(conversation);
      localStorage.setItem('conversations', JSON.stringify(conversations));
    }

    // 3. Add invite to lawyer's invites
    let invites = JSON.parse(localStorage.getItem('invites') || '[]');
    invites.push({
      id: Date.now().toString(),
      to: lawyer,
      from: user,
      message,
      conversationId: conversation.id,
      createdAt: new Date().toISOString()
    });
    localStorage.setItem('invites', JSON.stringify(invites));

    // 4. Add a system message to the conversation
    const newMessage: Message = {
      id: Date.now().toString(),
      conversationId: conversation.id,
      senderId: user.id,
      senderName: user.name,
      senderRole: user.role,
      content: `You invited ${lawyer.name} (${lawyer.email}) to join this conversation.`,
      timestamp: new Date().toISOString(),
    };
    conversation.messages = [...(conversation.messages || []), newMessage];
    conversation.lastMessage = newMessage;
    conversation.updatedAt = new Date().toISOString();
    localStorage.setItem('conversations', JSON.stringify(conversations));

    // Add notification for the lawyer
    let notifications = JSON.parse(localStorage.getItem('notifications') || '{}');
    if (!notifications[lawyer.email]) notifications[lawyer.email] = [];
    notifications[lawyer.email].push({
      id: Date.now().toString(),
      type: 'invite',
      message: `You have been invited to a conversation by ${user.name}.`,
      conversationId: conversation.id,
      timestamp: new Date().toISOString(),
      read: false
    });
    localStorage.setItem('notifications', JSON.stringify(notifications));

    // Emit real-time invite notification via socket
    if (socket && isConnected) {
      socket.emit('new-invite', {
        to: lawyer.email,
        invite: {
          id: Date.now().toString(),
          from: user,
          message,
          conversationId: conversation.id,
          timestamp: new Date().toISOString(),
        }
      });
    }

    // 5. Update UI
    setConversations(conversations);
    setSelectedConversation(conversation.id);
    setMessages(conversation.messages);
  };

  const handleAnalyzeMessage = async (messageContent: string) => {
    try {
      const trimmed = messageContent.trim();
      if (!trimmed || trimmed.length < 10) {
        alert('Please enter a detailed legal query (at least 10 characters).');
        return;
      }

      // 1. Get keywords from Hugging Face
      try {
        const keywords = await getHuggingFaceKeywords(trimmed.toLowerCase());
        
        if (!keywords || !keywords.length) {
          console.warn('No keywords found, using message text directly');
          // Continue analysis with the original text if no keywords found
          performAnalysis(trimmed);
          return;
        }
        
        // 2. Use keywords to match IPC section
        performAnalysis(keywords.join(' '));
      } catch (error) {
        console.error('Error extracting keywords:', error);
        // Fallback to using the original message text
        performAnalysis(trimmed);
      }
    } catch (error) {
      console.error('Analysis error:', error);
      alert('An error occurred during analysis. Please try again later.');
    }
  };

  // Helper function to perform the actual analysis and update the UI
  const performAnalysis = (queryText: string) => {
    const analysisResult = generateIPCAnalysis(queryText);

    if (!analysisResult || typeof analysisResult === 'string') {
      alert(analysisResult || 'No relevant IPC section found for this query.');
      return;
    }

    const aiMessage: Message = {
      id: Date.now().toString(),
      conversationId: selectedConversation || '',
      senderId: 'ai',
      senderName: 'AI Assistant',
      senderRole: 'lawyer',
      content: `Legal Analysis:\n\nIPC Section ${analysisResult.section} - ${analysisResult.title}\n\n${analysisResult.description}\n\nRelated Case: ${analysisResult.relatedCase || 'N/A'}`,
      timestamp: new Date().toISOString(),
      isAI: true
    };
    
    setMessages(prev => [...prev, aiMessage]);
    
    // Update conversation in localStorage
    const conversations: Conversation[] = JSON.parse(localStorage.getItem('conversations') || '[]');
      const updatedConversations = conversations.map((conv: Conversation) => {
        if (conv.id === selectedConversation) {
          return {
            ...conv,
          messages: [...(conv.messages || []), aiMessage],
          lastMessage: aiMessage,
          updatedAt: aiMessage.timestamp
          };
        }
        return conv;
      });
      localStorage.setItem('conversations', JSON.stringify(updatedConversations));

    // Send via Socket.IO if connected
    if (socket && isConnected) {
      socket.emit('send-message', aiMessage);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <header className="bg-white border-b p-4">
        <h1 className="text-xl font-semibold text-gray-800">Chat</h1>
      </header>
      
      <div className="flex-1 flex overflow-hidden">
        {/* Conversations list */}
        <div className="w-64 border-r bg-white overflow-y-auto">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="font-medium text-gray-700">Conversations</h2>
            {user?.role === 'client' && (
              <button 
                onClick={handleInviteLawyer}
                className="invite-btn bg-blue-100 text-blue-700 p-1 rounded-full hover:bg-blue-200 transition-all"
                title="Invite a lawyer"
              >
                <Plus size={18} />
              </button>
            )}
          </div>
          
          <div>
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-4 border-b hover:bg-blue-50 cursor-pointer ${
                  selectedConversation === conversation.id ? 'bg-blue-50' : ''
                }`}
                onClick={() => navigate(`/chat/${conversation.id}`)}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <UserCircle className="text-blue-600" size={20} />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">
                      {conversation.participants.find(p => p.id !== user?.id)?.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {conversation.lastMessage?.content
                        ? conversation.lastMessage.content.substring(0, 30) +
                          (conversation.lastMessage.content.length > 30 ? '...' : '')
                        : ''}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Chat content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedConversation ? (
            <>
              {/* Chat header */}
              <div className="bg-white border-b p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="text-blue-600" size={20} />
                      </div>
                      {onlineLawyers.includes('1') && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">
                        {conversations.find(c => c.id === selectedConversation)?.participants.find(p => p.id !== user?.id)?.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {onlineLawyers.includes('1') ? (
                          <span className="text-green-600">Online</span>
                        ) : (
                          'Offline'
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {user && (
                      <button
                        onClick={() => {
                          // Remove the conversation entirely
                          const conversations: Conversation[] = JSON.parse(localStorage.getItem('conversations') || '[]');
                          const updatedConversations = conversations.filter((conv: Conversation) => conv.id !== selectedConversation);
                          localStorage.setItem('conversations', JSON.stringify(updatedConversations));
                          setConversations(updatedConversations);
                          setSelectedConversation(null);
                          setMessages([]);
                        }}
                        className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm hover:bg-red-200 transition duration-200"
                        title="Delete Chat History"
                      >
                        Delete Chat
                      </button>
                    )}
                  {user?.role === 'client' && (
                    <button
                      onClick={handleInviteLawyer}
                      className="bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center hover:bg-blue-800 transition duration-200 invite-btn"
                    >
                      Invite Lawyer
                    </button>
                  )}
                    {user?.role === 'lawyer' && messages.length > 0 && (
                      <button
                        onClick={() => handleAnalyzeMessage(messages[messages.length - 1].content)}
                        className="bg-yellow-600 text-white px-3 py-1 rounded text-sm flex items-center hover:bg-yellow-700 transition duration-200 ml-2"
                        disabled={!messages.length}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="mr-1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                          <path d="M12 17h.01" />
                        </svg>
                        Analyze Message
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {messages.map(msg => (
                  <MessageComponent 
                    key={msg.id} 
                    message={msg} 
                    currentUserId={user?.id || ''}
                  />
                ))}
                
                {isTyping && (
                  <div className="flex justify-start mb-4">
                    <div className="bg-white border border-gray-200 rounded-lg p-3 max-w-xs">
                      <div className="typing-indicator flex space-x-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
              
              {/* Input area */}
              <div className="bg-white border-t p-4">
                <div className="flex items-end">
                  <div className="flex-1 bg-gray-100 rounded-lg p-2">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder="Type a message..."
                      className="w-full bg-transparent border-0 focus:outline-none resize-none"
                      rows={2}
                    />
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileUpload}
                          className="hidden"
                          multiple
                        />
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                          className="text-gray-500 hover:text-blue-600 transition duration-150"
                        >
                          <Paperclip size={18} />
                        </button>
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        {isUploading && "Uploading..."}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className={`ml-3 p-2 rounded-full ${
                      message.trim() 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'bg-gray-200 text-gray-400'
                    } transition duration-150`}
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="text-blue-600" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                </div>
                <h2 className="text-xl font-medium mb-2">No conversation selected</h2>
                <p className="text-gray-500 mb-6">
                  {user?.role === 'client'
                    ? 'Start by inviting a lawyer to chat'
                    : 'Select a conversation from the list'}
                </p>
                
                {user?.role === 'client' && (
                  <button
                    onClick={handleInviteLawyer}
                    className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition duration-200 flex items-center mx-auto invite-btn"
                  >
                    <Users size={18} className="mr-2" />
                    Invite a Lawyer
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <InviteModal 
          onClose={() => setShowInviteModal(false)}
          onSendInvite={handleSendInvite}
          currentUser={user}
        />
      )}
    </div>
  );
};

export default Chat;