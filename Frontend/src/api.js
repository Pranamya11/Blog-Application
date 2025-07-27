import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies
});

// Get all posts
export const getPosts = async () => {
  try {
    const response = await api.get('/blogs');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch posts');
  }
};

// Get a single post by ID
export const getPostById = async (id) => {
  try {
    const response = await api.get(`/blogs/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch post');
  }
};

// Create a new post
export const createPost = async (postData, userName) => {
  try {
    const response = await api.post('/blogs/insert', {
      title: postData.title,
      content: postData.content,
      author: userName || 'Anonymous'
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create post');
  }
};

// Update an existing post
export const updatePost = async (id, postData) => {
  try {
    const response = await api.patch(`/blogs/${id}`, {
      title: postData.title,
      content: postData.content,
      author: postData.author || 'Anonymous'
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update post');
  }
};

// Delete a post
export const deletePost = async (id) => {
  try {
    const response = await api.delete(`/blogs/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete post');
  }
};

// Check authentication status
export const checkAuth = async () => {
  try {
    const response = await api.get('/check-auth');
    return response.data;
  } catch (error) {
    console.error('Auth check error:', error);
    return { isAuthenticated: false };
  }
};

// Logout function
export const logout = async () => {
  try {
    const response = await axios.post('http://localhost:3000/logout', {}, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to logout');
  }
}; 