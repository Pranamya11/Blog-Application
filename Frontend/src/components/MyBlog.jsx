import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPosts, deletePost } from '../api';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import { useAuth } from '../context/AuthContext';

const MyBlog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingPost, setDeletingPost] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const allPosts = await getPosts();
        // Filter posts to show only those created by the current user
        const myPosts = allPosts.filter(post => post.author === user?.name);
        setPosts(myPosts);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (user) {
      fetchMyPosts();
    } else {
      setLoading(false);
      setError('Please login to view your posts');
    }
  }, [user]);

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    setDeletingPost(postId);
    try {
      await deletePost(postId);
      
      // Remove the deleted post from the list
      setPosts(posts.filter(post => post._id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
    } finally {
      setDeletingPost(null);
    }
  };

  const handleEdit = (postId) => {
    navigate(`/edit-post/${postId}`);
  };

  if (loading) return <LoadingSpinner message="Loading your posts..." />;
  if (error) return <ErrorMessage message={`Error: ${error}`} onRetry={() => window.location.reload()} />;

  return (
    <div className="my-blog fade-in">
      <h2>My Blog Posts</h2>
      {!user ? (
        <div className="empty-state">
          <p>Please login to view your posts</p>
          <Link to="/login" className="btn btn-primary">
            Login
          </Link>
        </div>
      ) : posts.length === 0 ? (
        <div className="empty-state">
          <p>You haven't created any posts yet. Start writing your first blog post!</p>
          <Link to="/create" className="btn btn-primary">
            Create Your First Post
          </Link>
        </div>
      ) : (
        <div className="posts-container">
                  {posts.map(post => (
          <div key={post._id} className="post-card">
            <div className="post-header">
              <h3>
                <Link to={`/post/${post._id}`}>{post.title}</Link>
              </h3>
              <div className="post-actions">
                <button
                  onClick={() => handleEdit(post._id)}
                  className="btn btn-secondary btn-sm"
                  title="Edit post"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(post._id)}
                  className="btn btn-danger btn-sm"
                  disabled={deletingPost === post._id}
                  title="Delete post"
                >
                  {deletingPost === post._id ? '🗑️ Deleting...' : '🗑️ Delete'}
                </button>
              </div>
            </div>
              <p className="post-excerpt">
                {post.content.substring(0, 150)}...
              </p>
              <div className="post-meta">
                <span className="post-date">
                  📅 {post.created_at ? new Date(post.created_at).toLocaleDateString() : 'No date'}
                </span>
                <span className="post-author">
                  👤 by {post.author}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBlog; 