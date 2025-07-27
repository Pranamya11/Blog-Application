import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPostById, updatePost } from '../api';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [post, setPost] = useState({
    title: '',
    content: ''
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postData = await getPostById(id);
        
        // Check if the post belongs to the current user
        if (postData.author !== user?.name) {
          setError('You can only edit your own posts');
          setLoading(false);
          return;
        }
        
        setPost({
          title: postData.title || '',
          content: postData.content || ''
        });
        setLoading(false);
      } catch (error) {
        setError('Failed to load post. Please try again.');
        setLoading(false);
      }
    };

    if (user) {
      fetchPost();
    } else {
      setError('Please login to edit posts');
      setLoading(false);
    }
  }, [id, user]);

  const handleChange = (e) => {
    setPost({
      ...post,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await updatePost(id, post);
      
      setSuccess('Post updated successfully! Redirecting...');
      setTimeout(() => {
        navigate('/my-blog');
      }, 2000);
    } catch (error) {
      setError(error.message || 'Failed to update post. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading post..." />;
  if (error) return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;

  return (
    <div className="form-container fade-in">
      <h2 className="form-title">Edit Post</h2>
      {success && <div className="success">{success}</div>}
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={post.title}
            onChange={handleChange}
            placeholder="Enter post title"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            value={post.content}
            onChange={handleChange}
            placeholder="Write your post content here..."
            rows="12"
            required
          />
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Update Post'}
          </button>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => navigate('/my-blog')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPost; 