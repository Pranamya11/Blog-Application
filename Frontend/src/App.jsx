import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/header.jsx';
import Footer from './components/Footer';
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
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/home" element={
                <>
                  <Header />
                  <main className="container">
                    <HomePage />
                  </main>
                  <Footer />
                </>
              } />
              <Route path="/posts" element={
                <>
                  <Header />
                  <main className="container">
                    <BlogList />
                  </main>
                  <Footer />
                </>
              } />
              <Route path="/my-blog" element={
                <>
                  <Header />
                  <main className="container">
                    <MyBlog />
                  </main>
                  <Footer />
                </>
              } />
              <Route path="/post/:id" element={
                <>
                  <Header />
                  <main className="container">
                    <BlogPost />
                  </main>
                  <Footer />
                </>
              } />
              <Route path="/create" element={
                <>
                  <Header />
                  <main className="container">
                    <ProtectedRoute>
                      <CreatePost />
                    </ProtectedRoute>
                  </main>
                  <Footer />
                </>
              } />
              <Route path="/edit-post/:id" element={
                <>
                  <Header />
                  <main className="container">
                    <ProtectedRoute>
                      <EditPost />
                    </ProtectedRoute>
                  </main>
                  <Footer />
                </>
              } />
              <Route path="/login" element={
                <>
                  <Header />
                  <main className="container">
                    <Login />
                  </main>
                  <Footer />
                </>
              } />
              <Route path="/signup" element={
                <>
                  <Header />
                  <main className="container">
                    <Signup />
                  </main>
                  <Footer />
                </>
              } />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;