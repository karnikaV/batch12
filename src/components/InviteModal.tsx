import React, { useState } from 'react';
import { User } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface InviteModalProps {
  onClose: () => void;
  onSendInvite: (email: string, message: string) => void;
  currentUser: User | null;
}

const InviteModal: React.FC<InviteModalProps> = ({ onClose, onSendInvite, currentUser }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(
    `Hello, I'd like to consult with you regarding a legal matter on LegalConnect. Please join this conversation.`
  );
  const [sending, setSending] = useState(false);
  const { addInvite } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !currentUser) return;
    
    setSending(true);
    
    // Create a new invite
    const invite = {
      id: Math.random().toString(36).substring(2, 9),
      from: currentUser,
      to: email,
      message,
      timestamp: new Date().toISOString(),
    };

    // Add invite to context
    addInvite(invite);
    
    // Simulate network request
    setTimeout(() => {
      onSendInvite(email, message);
      setSending(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-medium">Invite a Lawyer</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              Lawyer's Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter lawyer's email"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
              Message
            </label>
            <textarea
              id="message"
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter a message for the lawyer"
            ></textarea>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 flex items-center justify-center"
              disabled={sending}
            >
              {sending ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                'Send Invite'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteModal;