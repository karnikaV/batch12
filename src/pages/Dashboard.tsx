import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import { Clock, UserCircle, MessageSquare, FileText, Users, Bell, CheckCircle } from 'lucide-react';
import { Conversation, User, Document } from '../types';
import { formatDate } from '../utils/dateUtils';

function Dashboard() {
  const { user, invites, acceptInvite, declineInvite } = useAuth();
  const { socket, isConnected } = useSocket();
  const navigate = useNavigate();
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [showInvites, setShowInvites] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const notifications = JSON.parse(localStorage.getItem('notifications') || '{}');
  const [myNotifications, setMyNotifications] = useState(notifications[user?.email] || []);
  const unreadCount = myNotifications.filter((n: any) => !n.read).length;
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyLawyer, setVerifyLawyer] = useState(null);

  // Load initial data
  useEffect(() => {
    if (!user) return;

    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Load conversations from localStorage
        const storedConversations = localStorage.getItem('conversations');
        if (storedConversations) {
          setConversations(JSON.parse(storedConversations));
        }

        // Load documents from localStorage
        const storedDocuments = localStorage.getItem('documents');
        if (storedDocuments) {
          setDocuments(JSON.parse(storedDocuments));
        }

        // Load available users based on role
        const storedUsers = localStorage.getItem('users');
        if (storedUsers) {
          const allUsers = JSON.parse(storedUsers);
          const filteredUsers = allUsers.filter((u: User) => 
            user.role === 'client' ? u.role === 'lawyer' : u.role === 'client'
          );
          setAvailableUsers(filteredUsers);
        }

        // Load recent activity
        const storedActivity = localStorage.getItem('recentActivity');
        if (storedActivity) {
          setRecentActivity(JSON.parse(storedActivity));
        }

        // Calculate unread messages
        const unread = conversations.reduce((count, conv) => count + (conv.unreadCount || 0), 0);
        setUnreadMessages(unread);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError('Failed to load dashboard data. Please try refreshing the page.');
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  // Socket event listeners
  useEffect(() => {
    if (!socket || !isConnected) return;

    // Listen for new messages
    socket.on('new-message', (message) => {
      setConversations(prev => {
        const updated = prev.map(conv => 
          conv.id === message.conversationId
            ? {
                ...conv,
                lastMessage: message,
                unreadCount: message.senderId !== user?.id ? (conv.unreadCount || 0) + 1 : conv.unreadCount,
                updatedAt: message.timestamp
              }
            : conv
        );
        localStorage.setItem('conversations', JSON.stringify(updated));
        return updated;
      });

      // Update recent activity
      setRecentActivity(prev => {
        const newActivity = {
          id: Math.random().toString(36).substring(2, 9),
          user: { id: message.senderId, name: message.senderName, role: message.senderRole },
          action: message.content,
          timestamp: message.timestamp
        };
        const updated = [newActivity, ...prev].slice(0, 10);
        localStorage.setItem('recentActivity', JSON.stringify(updated));
        return updated;
      });

      setUnreadMessages(prev => prev + 1);
    });

    // Listen for new documents
    socket.on('document-shared', (document) => {
      setDocuments(prev => {
        const updated = [...prev, document];
        localStorage.setItem('documents', JSON.stringify(updated));
        return updated;
      });

      // Update recent activity
      setRecentActivity(prev => {
        const newActivity = {
          id: Math.random().toString(36).substring(2, 9),
          user: document.uploadedBy,
          action: `Shared document: ${document.name}`,
          timestamp: document.uploadDate
        };
        const updated = [newActivity, ...prev].slice(0, 10);
        localStorage.setItem('recentActivity', JSON.stringify(updated));
        return updated;
      });
    });

    // Listen for document deletions
    socket.on('document-deleted', (documentId) => {
      setDocuments(prev => {
        const updated = prev.filter(doc => doc.id !== documentId);
        localStorage.setItem('documents', JSON.stringify(updated));
        return updated;
      });
    });

    // Listen for new invites
    socket.on('new-invite', ({ to, invite }) => {
      console.log('Received new-invite for:', to, 'Current user:', user?.email);
      if (user && user.email === to) {
        // Add to notifications
        let notifications = JSON.parse(localStorage.getItem('notifications') || '{}');
        const updatedNotifications = [...(notifications[to] || []), {
          id: invite.id,
          type: 'invite',
          message: `You have been invited to a conversation by ${invite.from.name}.`,
          conversationId: invite.conversationId,
          timestamp: invite.timestamp,
          read: false
        }];
        notifications[to] = updatedNotifications;
        localStorage.setItem('notifications', JSON.stringify(notifications));
        setShowNotifDropdown(false);
        setMyNotifications(updatedNotifications); // Update state for real-time UI
      }
    });

    return () => {
      socket.off('new-message');
      socket.off('document-shared');
      socket.off('document-deleted');
      socket.off('new-invite');
    };
  }, [socket, isConnected, user]);

  // Sync myNotifications state with localStorage on user change
  useEffect(() => {
    const notifications = JSON.parse(localStorage.getItem('notifications') || '{}');
    setMyNotifications(notifications[user?.email] || []);
  }, [user]);

  // Listen for storage events (multi-tab support)
  useEffect(() => {
    const handleStorage = () => {
      const notifications = JSON.parse(localStorage.getItem('notifications') || '{}');
      setMyNotifications(notifications[user?.email] || []);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [user]);

  const handleAcceptInvite = (inviteId: string) => {
    acceptInvite(inviteId);
    navigate(`/chat`);
  };

  const handleDeclineInvite = (inviteId: string) => {
    declineInvite(inviteId);
  };

  const isDashboardEmpty = conversations.length === 0 && documents.length === 0;

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <Bell className="mx-auto" size={48} />
          </div>
          <p className="text-gray-800 mb-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <header className="bg-white border-b p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              {user?.role === 'client' ? 'Client Dashboard' : 'Lawyer Dashboard'}
            </h1>
            <p className="text-xl mt-4">Welcome, {user?.name}</p>
            <p className="text-gray-600 mt-2">
              {user?.role === 'client'
                ? 'This is your secure legal communication portal. Connect with lawyers, manage your documents, and get legal assistance all in one place.'
                : 'This is your secure lawyer portal. Manage your clients, review case documents, and provide legal assistance through our secure communication channels.'}
            </p>
          </div>
          
          {user?.role === 'lawyer' && invites.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setShowInvites(!showInvites)}
                className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 relative"
              >
                <Bell className="text-blue-600" size={24} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {invites.length}
                </span>
              </button>
              
              {showInvites && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
                  <div className="p-4 border-b">
                    <h3 className="font-medium">New Invites</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {invites.map(invite => (
                      <div key={invite.id} className="p-4 border-b">
                        <div className="flex items-start">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <UserCircle className="text-blue-600" size={20} />
                          </div>
                          <div className="ml-3 flex-1">
                            <p className="font-medium">{invite.from.name}</p>
                            <p className="text-sm text-gray-500">{invite.message}</p>
                            <div className="mt-2 flex justify-end space-x-2">
                              <button
                                onClick={() => handleAcceptInvite(invite.id)}
                                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleDeclineInvite(invite.id)}
                                className="border border-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-50"
                              >
                                Decline
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="p-6">
        {isDashboardEmpty ? (
          <div className="text-center py-12">
            <div className="mb-4 text-blue-500">
              <MessageSquare size={48} className="mx-auto" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Get Started with LegalConnect</h2>
            <p className="text-gray-500 mb-6 max-w-lg mx-auto">
              {user?.role === 'client'
                ? 'Start a conversation with a lawyer to get legal advice or upload documents for review.'
                : 'Connect with clients who need your legal expertise or review uploaded case documents.'}
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/chat"
                className="bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800 transition duration-200"
              >
                Start a Conversation
              </Link>
              <Link
                to="/documents"
                className="bg-white border border-blue-700 text-blue-700 px-6 py-2 rounded hover:bg-blue-50 transition duration-200"
              >
                Upload Documents
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stats Cards */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full">
                  <UserCircle className="text-blue-600" size={24} />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-600">
                    {user?.role === 'client' ? 'Lawyers Available' : 'Active Clients'}
                  </h3>
                  <p className="text-3xl font-bold text-blue-600">{availableUsers.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full">
                  <MessageSquare className="text-green-600" size={24} />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-600">
                    {user?.role === 'client' ? 'Active Conversations' : 'Unread Messages'}
                  </h3>
                  <p className="text-3xl font-bold text-green-600">
                    {user?.role === 'client' ? conversations.length : unreadMessages}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-full">
                  <FileText className="text-purple-600" size={24} />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-600">
                    {user?.role === 'client' ? 'Uploaded Documents' : 'Case Documents'}
                  </h3>
                  <p className="text-3xl font-bold text-purple-600">{documents.length}</p>
                </div>
              </div>
            </div>

            {/* Available Users Section */}
            <div className="md:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="flex items-center text-lg font-medium text-gray-700">
                  <UserCircle className="mr-2" size={20} />
                  {user?.role === 'client' ? 'Available Lawyers' : 'Your Clients'}
                </h2>
              </div>
              <div className="p-4">
                {availableUsers.length > 0 ? (
                  availableUsers.map((availableUser) => (
                    <div key={availableUser.id} className="flex items-center justify-between p-4 border-b last:border-0 border-gray-100">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <UserCircle className="text-blue-600" size={20} />
                        </div>
                        <div className="ml-4">
                          <p className="font-medium flex items-center">
                            {availableUser.name}
                            {user?.role === 'client' && availableUser.verified && (
                              <CheckCircle className="ml-2 text-green-500" size={16} title="Verified Lawyer" />
                            )}
                          </p>
                          <p className="text-sm text-gray-500">{availableUser.email}</p>
                          {user?.role === 'client' && availableUser.verified && (
                            <button
                              className="text-blue-600 underline text-xs mt-1"
                              onClick={() => { setVerifyLawyer(availableUser); setShowVerifyModal(true); }}
                            >
                              Verify Lawyer
                            </button>
                          )}
                        </div>
                      </div>
                      <button
                        className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition duration-200"
                        onClick={() => {
                          // Find or create conversation based on user role
                          const currentUserId = user.id;
                          const otherUserId = availableUser.id;
                          let conversations = JSON.parse(localStorage.getItem('conversations') || '[]');
                          let conversation = conversations.find((c) =>
                            c.participants.some((p) => p.id === currentUserId) &&
                            c.participants.some((p) => p.id === otherUserId)
                          );
                          if (!conversation) {
                            conversation = {
                              id: Date.now().toString(),
                              participants: [
                                { id: currentUserId, name: user.name, role: user.role },
                                { id: otherUserId, name: availableUser.name, role: availableUser.role }
                              ],
                              messages: [],
                              createdAt: new Date().toISOString(),
                              updatedAt: new Date().toISOString()
                            };
                            conversations.push(conversation);
                            localStorage.setItem('conversations', JSON.stringify(conversations));
                          }
                          // Navigate to the chat page for this conversation
                          navigate(`/chat/${conversation.id}`);
                        }}
                        disabled={user?.role === 'client' && !availableUser.verified}
                      >
                        Chat
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No {user?.role === 'client' ? 'lawyers' : 'clients'} available
                  </div>
                )}
              </div>
              <div className="p-4 bg-gray-50 rounded-b-lg">
                <Link
                  to="/chat"
                  className="block text-center text-blue-600 hover:text-blue-800 transition duration-200"
                >
                  View All Conversations
                </Link>
              </div>
            </div>

            {/* Lawyer-specific sections */}
            {user?.role === 'lawyer' && (
              <div className="md:col-span-3 bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="flex items-center text-lg font-medium text-gray-700">
                    <Bell className="mr-2" size={20} />
                    AI Legal Insights
                  </h2>
                </div>
                <div className="p-6">
                  {conversations.length > 0 ? (
                    conversations
                      .filter(conv => {
                        const lastMessage = conv.lastMessage;
                        return lastMessage && lastMessage.isAI && lastMessage.senderId !== user.id;
                      })
                      .slice(0, 2)
                      .map(conv => (
                        <div key={conv.id} className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <Bell className="text-yellow-400" size={24} />
                            </div>
                            <div className="ml-3">
                              <h3 className="text-lg font-medium text-yellow-800">
                                {conv.lastMessage?.content.split('\n')[0]}
                              </h3>
                              <div className="mt-2 text-yellow-700">
                                <p>{conv.lastMessage?.content}</p>
                                <div className="mt-2 text-sm">
                                  <span className="font-medium">From:</span> {conv.participants.find(p => p.role === 'client')?.name}
                                </div>
                                <div className="mt-2">
                                  <Link to={`/chat/${conv.id}`} className="text-blue-600 hover:text-blue-800 flex items-center">
                                    View Conversation
                                    <Bell className="ml-1" size={16} />
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No AI insights available
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Client-specific sections */}
            {user?.role === 'client' && (
              <div className="md:col-span-3 bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="flex items-center text-lg font-medium text-gray-700">
                    <Bell className="mr-2" size={20} />
                    Legal Alerts
                  </h2>
                </div>
                <div className="p-6">
                  {unreadMessages > 0 ? (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Bell className="text-yellow-400" size={24} />
                      </div>
                      <div className="ml-3">
                          <h3 className="text-lg font-medium text-yellow-800">New Messages</h3>
                        <div className="mt-2 text-yellow-700">
                            You have {unreadMessages} unread message{unreadMessages !== 1 ? 's' : ''} from your lawyer{unreadMessages !== 1 ? 's' : ''}.
                            <div className="mt-2">
                              <Link to="/chat" className="text-blue-600 hover:text-blue-800 flex items-center">
                                View Messages
                                <Bell className="ml-1" size={16} />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No new alerts
                  </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {showVerifyModal && verifyLawyer && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-2 flex items-center">
              {verifyLawyer.name}
              <CheckCircle className="ml-2 text-green-500" size={20} />
            </h2>
            <p className="mb-2 text-gray-700">Bar Council ID: <span className="font-mono">{verifyLawyer.barCouncilId || 'N/A'}</span></p>
            <p className="mb-2 text-gray-700">Email: {verifyLawyer.email}</p>
            <a
              href={`https://www.barcouncilofindia.org/roll-number-search/?q=${verifyLawyer.barCouncilId || ''}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Lookup on Bar Council Website
            </a>
            <div className="mt-4 flex justify-end">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={() => setShowVerifyModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;