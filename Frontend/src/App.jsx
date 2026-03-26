import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import CreatePost from './pages/CreatePost';
import Posts from './pages/Posts';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="app-nav">
          <div className="logo">NeonGallery</div>
          <div className="nav-links">
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/create-post">Create Post</NavLink>
            <NavLink to="/posts">Gallery</NavLink>
          </div>
        </nav>
        <div className="page-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/posts" element={<Posts />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div className="home-container">
      <h1>Discover & Share <br/> Digital Postcards</h1>
      <p>A beautifully glowing sanctuary to create, organize, and show off your postcards. Experience the next generation of visual storytelling.</p>
      <div className="home-actions">
        <a href="/create-post" className="btn-primary">Create a Postcard</a>
        <a href="/posts" className="btn-secondary">Explore Gallery</a>
      </div>
    </div>
  );
}

export default App;