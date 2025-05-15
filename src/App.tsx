import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SocketProvider } from './contexts/SocketContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Documents from './pages/Documents';
import IPCLibrary from './pages/IPCLibrary';
import './App.css';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat/:conversationId?"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Chat />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/documents"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Documents />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/ipc-library"
              element={
                <ProtectedRoute>
                  <Layout>
                    <IPCLibrary />
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;