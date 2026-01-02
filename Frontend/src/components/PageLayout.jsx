import React from 'react';
import Header from './header.jsx';
import Footer from './Footer';

const PageLayout = ({ children }) => (
  <>
    <Header />
    <main className="container">{children}</main>
    <Footer />
  </>
);

export default PageLayout; 