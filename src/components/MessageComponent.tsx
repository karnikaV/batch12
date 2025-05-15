import React from 'react';
import { Message } from '../types/index';
import { formatTime } from '../utils/dateUtils';
import { Scale, Bot } from 'lucide-react';

interface MessageComponentProps {
  message: Message;
  currentUserId: string;
}

const MessageComponent: React.FC<MessageComponentProps> = ({ message, currentUserId }) => {
  const isCurrentUser = message.senderId === currentUserId;
  const isAIMessage = message.isAI;
  
  // Format content to keep newlines for AI analysis
  const formattedContent = isAIMessage ? 
    message.content.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        <br />
      </React.Fragment>
    )) : message.content;
    
  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div 
        className={`${
          isAIMessage 
            ? 'bg-orange-50 border-orange-200 text-gray-800 max-w-2xl' 
            : isCurrentUser 
              ? 'bg-blue-600 text-white' 
              : 'bg-white border border-gray-200 text-gray-800'
        } rounded-lg p-3 ${isCurrentUser ? 'rounded-tr-none' : 'rounded-tl-none'} ${
          !isCurrentUser && !isAIMessage ? 'max-w-xs sm:max-w-md' : 'max-w-xs sm:max-w-md'
        }`}
      >
        <div className="flex items-center mb-1">
          {isAIMessage ? (
            <>
              <Bot size={16} className="text-orange-600 mr-1" />
              <span className="font-medium text-orange-600 mr-2">{message.senderName}</span>
            </>
          ) : (
            <>
              {!isCurrentUser && (
                <>
                  {message.senderRole === 'lawyer' && (
                    <Scale size={16} className="text-blue-600 mr-1" />
                  )}
                  <span className="font-medium text-gray-700 mr-2">{message.senderName}</span>
                </>
              )}
            </>
          )}
          <span className="text-xs opacity-70">{formatTime(message.timestamp)}</span>
        </div>
        
        <div className={`${isAIMessage ? 'font-medium' : ''}`}>
          {formattedContent}
        </div>
        
        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-2 space-y-1">
            {message.attachments.map(attachment => (
              <div key={attachment.id} className="flex items-center text-xs p-2 bg-gray-100 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>{attachment.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageComponent;