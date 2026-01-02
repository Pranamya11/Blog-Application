import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* <div className="footer-section">
            <h4>My Blog</h4>
            <p>A modern blog platform.</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/posts">Posts</Link></li>
              <li><Link to="/create">Create Post</Link></li>
            </ul>
          </div> */}
          {/* <div className="footer-section">
            <h4>Technologies</h4>
            <ul>
              <li>React 19</li>
              <li>React Router</li>
              <li>Axios</li>
              <li>Vite</li>
            </ul>
          </div> */}
        </div>
        <div className="footer-bottom">
          <p>&copy;  My Blog. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 