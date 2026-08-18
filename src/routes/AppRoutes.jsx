import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import { useAuth } from '../context/AuthContext';

const Dashboard = React.lazy(() => import('../pages/Dashboard'));
const Favorites = React.lazy(() => import('../pages/Favorites'));
const Folders = React.lazy(() => import('../pages/Folders'));
const Tags = React.lazy(() => import('../pages/Tags'));
const Archive = React.lazy(() => import('../pages/Archive'));
const Trash = React.lazy(() => import('../pages/Trash'));
const Private = React.lazy(() => import('../pages/Private'));
const NoteEditorPage = React.lazy(() => import('../pages/NoteEditorPage'));
const Settings = React.lazy(() => import('../pages/Settings'));
const Login = React.lazy(() => import('../pages/Login'));
const Register = React.lazy(() => import('../pages/Register'));
const ForgotPassword = React.lazy(() => import('../pages/ForgotPassword'));
const NotFound = React.lazy(() => import('../pages/NotFound'));

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingFallback />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-950">
    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Routes inside AppLayout */}
        <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="folders" element={<Folders />} />
          <Route path="folders/:folderId" element={<Folders />} />
          <Route path="tags" element={<Tags />} />
          <Route path="archive" element={<Archive />} />
          <Route path="trash" element={<Trash />} />
          <Route path="private" element={<Private />} />
          <Route path="notes/new" element={<NoteEditorPage />} />
          <Route path="notes/:noteId" element={<NoteEditorPage />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
