import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPostById, updatePost, deletePost } from '../api';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: '',
    content: ''
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPostById(id);
        setPost(data);
        setEditData({
          title: data.title,
          content: data.content
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedPost = await updatePost(id, editData);
      setPost(updatedPost);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating post:', err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(id);
        window.location.href = '/';
      } catch (err) {
        console.error('Error deleting post:', err);
      }
    }
  };

  if (loading) return <LoadingSpinner message="Loading post..." />;
  if (error) return <ErrorMessage message={`Error: ${error}`} onRetry={() => window.location.reload()} />;
  if (!post) return <ErrorMessage message="Post not found" />;

  return (
    <div className="blog-post">
      {isEditing ? (
        <form onSubmit={handleEditSubmit} className="edit-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={editData.title}
              onChange={(e) => setEditData({...editData, title: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              value={editData.content}
              onChange={(e) => setEditData({...editData, content: e.target.value})}
              required
            />
          </div>
          <button type="submit" className="btn">Save Changes</button>
          <button type="button" className="btn btn-cancel" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <>
          <h2>{post.title}</h2>
          <div className="post-meta">
            <span className="post-date">
              Posted on {post.created_at ? new Date(post.created_at).toLocaleDateString() : 'Unknown date'}
            </span>
            {post.author && (
              <span className="post-author">by {post.author}</span>
            )}
          </div>
          <div className="post-content">
            <p>{post.content}</p>
          </div>
          <div className="post-actions">
            <button onClick={() => setIsEditing(true)} className="btn">
              Edit Post
            </button>
            <button onClick={handleDelete} className="btn btn-danger">
              Delete Post
            </button>
          </div>
        </>
      )}
      <Link to="/" className="back-link">← Back to all posts</Link>
    </div>
  );
};

export default BlogPost;