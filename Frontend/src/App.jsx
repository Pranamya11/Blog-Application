import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PageLayout from './components/PageLayout';
import HomePage from './components/HomePage';
import BlogList from './components/blogList.jsx';
import BlogPost from './components/BlogPost';
import CreatePost from './components/CreatePost';
import EditPost from './components/EditPost';
import Login from './components/Login';
import Signup from './components/Signup';
import MyBlog from './components/MyBlog';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import Welcome from './components/Welcome';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <Router>
      <AuthProvider>
          <div className="App">
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/home" element={<PageLayout><HomePage /></PageLayout>} />
              <Route path="/posts" element={<PageLayout><BlogList /></PageLayout>} />
              <Route path="/my-blog" element={<PageLayout><MyBlog /></PageLayout>} />
              <Route path="/post/:id" element={<PageLayout><BlogPost /></PageLayout>} />
              <Route path="/create" element={<PageLayout><ProtectedRoute><CreatePost /></ProtectedRoute></PageLayout>} />
              <Route path="/edit-post/:id" element={<PageLayout><ProtectedRoute><EditPost /></ProtectedRoute></PageLayout>} />
              <Route path="/login" element={<PageLayout><Login /></PageLayout>} />
              <Route path="/signup" element={<PageLayout><Signup /></PageLayout>} />
              <Route path="*" element={<Welcome />} />
            </Routes>
          </div>
        </AuthProvider>
        </Router>
    </ErrorBoundary>
  );
}

export default App;