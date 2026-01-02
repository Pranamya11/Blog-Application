import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '../api';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPosts();
        setPosts(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <LoadingSpinner message="Loading posts..." />;
  if (error) return <ErrorMessage message={`Error: ${error}`} onRetry={() => window.location.reload()} />;

  return (
    <div className="blog-list fade-in">
      <h2>Recent Posts</h2>
      {posts.length === 0 ? (
        <div className="empty-state">
          <p>No posts found. Be the first to create one!</p>
          <Link to="/create" className="btn btn-primary">
            Create Your First Post
          </Link>
        </div>
      ) : (
        <div className="posts-container">
          {posts.map(post => (
            <div key={post._id} className="post-card">
              <h3>
                <Link to={`/post/${post._id}`}>{post.title}</Link>
              </h3>
              <p className="post-excerpt">
                {post.content.substring(0, 150)}...
              </p>
              <div className="post-meta">
                <span className="post-date">
                  📅 {post.created_at ? new Date(post.created_at).toLocaleDateString() : 'No date'}
                </span>
                {post.author && (
                  <span className="post-author">
                    👤 by {post.author}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogList;