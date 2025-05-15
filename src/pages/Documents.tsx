import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import { Paperclip, Upload, Download, FileText, File, Trash2, Eye, Share, Share2, MessageSquare, Check, X } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';
import { formatFileSize, getFileIcon, isImageFile } from '../utils/fileUtils';
import { Document, User } from '../types';

// Mock documents for testing
const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Legal Agreement.pdf',
    type: 'application/pdf',
    size: 1024 * 1024 * 2, // 2MB
    uploadedBy: { id: '3', name: 'Jane Client', email: 'client@example.com', role: 'client' },
    sharedWith: [{ id: '1', name: 'John Lawyer', email: 'lawyer@example.com', role: 'lawyer' }],
    uploadedAt: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    status: 'pending',
    comments: [
      {
        id: '1',
        documentId: '1',
        user: { id: '1', name: 'John Lawyer', email: 'lawyer@example.com', role: 'lawyer' },
        content: 'Please review this document and let me know if you need any changes.',
        timestamp: new Date().toISOString(),
      },
    ],
  },
];

const Documents: React.FC = () => {
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [newComment, setNewComment] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load documents from localStorage
    const savedDocuments = JSON.parse(localStorage.getItem('documents') || '[]');
    setDocuments(savedDocuments);

    // Socket.IO: Listen for real-time document events
    if (!socket) return;

    const handleDocUpload = (doc: Document) => {
      setDocuments(prev => {
        const updated = [doc, ...prev.filter(d => d.id !== doc.id)];
        localStorage.setItem('documents', JSON.stringify(updated));
        return updated;
      });
    };
    const handleDocDelete = (docId: string) => {
      setDocuments(prev => {
        const updated = prev.filter(d => d.id !== docId);
        localStorage.setItem('documents', JSON.stringify(updated));
        return updated;
      });
    };
    const handleDocShare = (doc: Document) => {
      setDocuments(prev => {
        const updated = prev.map(d => d.id === doc.id ? doc : d);
        localStorage.setItem('documents', JSON.stringify(updated));
        return updated;
      });
    };

    socket.on('document-uploaded', handleDocUpload);
    socket.on('document-deleted', handleDocDelete);
    socket.on('document-shared', handleDocShare);

    return () => {
      socket.off('document-uploaded', handleDocUpload);
      socket.off('document-deleted', handleDocDelete);
      socket.off('document-shared', handleDocShare);
    };
  }, [socket]);

  // Filter documents to show only those uploaded by or shared with the current user
  const visibleDocuments = documents.filter(
    doc =>
      doc.uploadedBy.id === user.id ||
      (doc.sharedWith && doc.sharedWith.some((u: any) => u.id === user.id || u.email === user.email))
  );

  // Mock document upload function
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      
      // Create preview URL for images
      if (isImageFile(file.type)) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !user) return;
    setUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 300);
    
    // Simulate network request
    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);
      
      // Auto-share with the other party in all conversations
      let sharedWith: User[] = [];
      const conversations = JSON.parse(localStorage.getItem('conversations') || '[]');
      conversations.forEach((conv: any) => {
        conv.participants.forEach((participant: User) => {
          if (participant.id !== user.id && !sharedWith.some(u => u.id === participant.id)) {
            sharedWith.push(participant);
          }
        });
      });

      const newDocument: Document = {
        id: Math.random().toString(36).substring(2, 9),
        name: selectedFile.name,
        type: selectedFile.type,
        size: selectedFile.size,
        url: URL.createObjectURL(selectedFile),
        uploadedBy: user,
        uploadedAt: new Date().toISOString(),
        sharedWith,
        status: 'pending',
        comments: [],
        lastModified: String(selectedFile.lastModified || Date.now()),
      };
      
      setDocuments(prev => [newDocument, ...prev]);
      setSelectedFile(null);
      setUploading(false);
      setUploadProgress(0);
      
      if (fileInputRef.current) fileInputRef.current.value = '';

      // Save to localStorage
      localStorage.setItem('documents', JSON.stringify([newDocument, ...documents]));

      // Emit event via socket
      if (socket && isConnected) {
        socket.emit('document-uploaded', newDocument);
      }
    }, 2000);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments(prev => {
      const updatedDocs = prev.filter(doc => doc.id !== id);
      localStorage.setItem('documents', JSON.stringify(updatedDocs));
      // Emit event via socket
      if (socket && isConnected) {
        socket.emit('document-deleted', id);
      }
      return updatedDocs;
    });
  };

  const handlePreviewDocument = (doc: Document) => {
    setSelectedDoc(doc);
    setShowPreview(true);
  };

  const handleShareDocument = (documentId: string, users: User[]) => {
    setDocuments(prev => {
      const updatedDocs = prev.map(doc =>
        doc.id === documentId
          ? { ...doc, sharedWith: [...doc.sharedWith, ...users] }
          : doc
      );
      localStorage.setItem('documents', JSON.stringify(updatedDocs));
      // Emit event via socket
      const sharedDoc = updatedDocs.find(d => d.id === documentId);
      if (socket && isConnected && sharedDoc) {
        socket.emit('document-shared', sharedDoc);
      }
      return updatedDocs;
    });
    setShowShareModal(false);
  };

  const closePreview = () => {
    setShowPreview(false);
    setSelectedDoc(null);
  };

  const handleAddComment = (documentId: string) => {
    if (!newComment.trim() || !user) return;

    const comment = {
      id: Math.random().toString(36).substring(2, 9),
      documentId,
      user,
      content: newComment,
      timestamp: new Date().toISOString(),
    };

    setDocuments(prev =>
      prev.map(doc =>
        doc.id === documentId
          ? { ...doc, comments: [...(doc.comments || []), comment] }
          : doc
      )
    );

    setNewComment('');
  };

  const handleUpdateStatus = (documentId: string, status: Document['status']) => {
    setDocuments(prev =>
      prev.map(doc =>
        doc.id === documentId
          ? { ...doc, status, lastModified: new Date().toISOString() }
          : doc
      )
    );
  };

  // File type icons
  const getIconByType = (type: string) => {
    const iconType = getFileIcon(type);
    
    switch (iconType) {
      case 'pdf':
        return (
          <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
            <FileText className="text-red-600" size={20} />
          </div>
        );
      case 'doc':
        return (
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <FileText className="text-blue-600" size={20} />
          </div>
        );
      case 'img':
        return (
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="text-green-600" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
            <File className="text-gray-600" size={20} />
          </div>
        );
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <header className="bg-white border-b p-4">
        <h1 className="text-xl font-semibold text-gray-800">Documents</h1>
      </header>

      {/* Document upload section */}
      <div className="p-6 border-b bg-gray-50">
        <h2 className="text-lg font-medium mb-4">Upload Document</h2>
        
        <div className="flex items-start space-x-4">
          <div className="flex-1">
            <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
              {selectedFile ? (
                <div className="w-full">
                  <div className="flex items-center mb-3">
                    {previewUrl ? (
                      <div className="w-12 h-12 mr-3 rounded bg-gray-100 overflow-hidden">
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 mr-3 rounded bg-blue-100 flex items-center justify-center">
                        <FileText className="text-blue-600" size={24} />
                      </div>
                    )}
                    <div className="flex-1 truncate">
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
                    </div>
                  </div>
                  
                  {uploading && (
                    <div className="w-full mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-right mt-1">{Math.round(uploadProgress)}%</p>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Paperclip size={36} className="text-gray-400 mb-3" />
                  <p className="text-gray-600 mb-2">Drag and drop files here or click to browse</p>
                  <p className="text-sm text-gray-500">PDF, DOCX, JPG, PNG up to 10MB</p>
                </>
              )}
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
            </div>
            
            <div className="mt-4 flex justify-end space-x-3">
              {!selectedFile ? (
                <button
                  onClick={handleBrowseClick}
                  className="bg-white border border-blue-700 text-blue-700 px-4 py-2 rounded hover:bg-blue-50 transition duration-200 flex items-center"
                >
                  <Paperclip size={18} className="mr-1" />
                  Browse Files
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50 transition duration-200"
                    disabled={uploading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpload}
                    className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition duration-200 flex items-center"
                    disabled={uploading}
                  >
                    {uploading ? 'Uploading...' : (
                      <>
                        <Upload size={18} className="mr-1" />
                        Upload Document
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Document list */}
      <div className="p-6">
        <h2 className="text-lg font-medium mb-4">Your Documents</h2>
        
        {documents.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <FileText className="text-gray-400" size={32} />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-1">No documents</h3>
            <p className="text-gray-500 mb-4">Get started by uploading your first document.</p>
            <button
              onClick={handleBrowseClick}
              className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition duration-200 inline-flex items-center"
            >
              <Upload size={18} className="mr-1" />
              Upload Document
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visibleDocuments.map(doc => (
              <div 
                key={doc.id} 
                className="document-card bg-white rounded-lg border hover:border-blue-300 p-4 transition-all"
              >
                <div className="flex">
                  {getIconByType(doc.type)}
                  
                  <div className="ml-3 flex-1">
                    <p className="font-medium text-gray-800">{doc.name}</p>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-sm text-gray-500">{formatFileSize(doc.size)}</p>
                      <p className="text-xs text-gray-400">{formatDate(doc.uploadedAt)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t flex justify-between">
                  <div className="text-xs text-gray-500">
                    Uploaded by: {doc.uploadedBy.name}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePreviewDocument(doc)}
                      className="text-blue-600 hover:text-blue-800 p-1"
                      title="Preview"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedDoc(doc);
                        setShowCommentsModal(true);
                      }}
                      className="text-gray-600 hover:text-gray-800 p-1"
                      title="Comments"
                    >
                      <MessageSquare size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteDocument(doc.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = doc.url;
                        link.download = doc.name;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                      className="text-green-600 hover:text-green-800 p-1"
                      title="Download"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Document Preview Modal */}
      {showPreview && selectedDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-medium">{selectedDoc.name}</h3>
              <button
                onClick={closePreview}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto">
              <div className="flex justify-center items-center h-full">
                {isImageFile(selectedDoc.type) ? (
                  <img src={previewUrl || ""} alt={selectedDoc.name} className="max-w-full max-h-[60vh] object-contain" />
                ) : (
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <FileText className="text-gray-500" size={36} />
                    </div>
                    <p>Preview not available for this file type.</p>
                    <p className="text-sm text-gray-500 mt-2">{selectedDoc.type}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">
                  {formatFileSize(selectedDoc.size)} • Uploaded on {new Date(selectedDoc.uploadedAt ? selectedDoc.uploadedAt : '').toLocaleDateString()}
                </p>
              </div>
              <div>
                <button
                  className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 flex items-center"
                  onClick={() => {}}
                >
                  <Download size={16} className="mr-1" />
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-medium">Upload Document</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer"
                >
                  <Upload size={32} className="mx-auto text-gray-400" />
                  <p className="mt-2 text-gray-600">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-gray-500">
                    PDF, DOC, DOCX up to 10MB
                  </p>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comments Modal */}
      {showCommentsModal && selectedDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-medium">Comments</h3>
              <button
                onClick={() => setShowCommentsModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <div className="max-h-96 overflow-y-auto">
                  {selectedDoc.comments?.map(comment => (
                    <div key={comment.id} className="mb-4">
                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <FileText className="text-blue-600" size={16} />
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="flex justify-between items-start">
                            <p className="font-medium">{comment.user.name}</p>
                            <span className="text-xs text-gray-500">
                              {formatDate(comment.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full border border-gray-300 rounded-md p-2"
                    rows={3}
                  />
                  <button
                    onClick={() => handleAddComment(selectedDoc.id)}
                    className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Add Comment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;