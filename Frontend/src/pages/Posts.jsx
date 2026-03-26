import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Posts.css';

function Posts() {
    const [posts, setPosts] = useState([]);
    const [editingPostId, setEditingPostId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editCaption, setEditCaption] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchPosts = async () => {
        try {
            const response = await axios.get('http://localhost:3000/posts');
            setPosts(response.data.posts);
        } catch (error) {
            console.error('Error fetching posts:', error);
            setMessage('Error loading posts');
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const deletePost = async (postId) => {
        if (!window.confirm('Are you sure you want to discard this postcard?')) {
            return;
        }

        setLoading(true);
        try {
            await axios.delete(`http://localhost:3000/delete-post/${postId}`);
            setPosts(posts.filter(post => post._id !== postId));
            setMessage('Postcard deleted successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Error deleting post: ' + (error.response?.data?.error || error.message));
            setTimeout(() => setMessage(''), 5000);
        } finally {
            setLoading(false);
        }
    };

    const startEdit = (post) => {
        setEditingPostId(post._id);
        setEditTitle(post.title);
        setEditCaption(post.caption);
        setMessage('');
    };

    const cancelEdit = () => {
        setEditingPostId(null);
        setEditTitle('');
        setEditCaption('');
        setMessage('');
    };

    const updatePost = async (postId) => {
        if (!editTitle.trim() || !editCaption.trim()) {
            setMessage('Title and caption cannot be empty');
            return;
        }

        setLoading(true);
        try {
            await axios.patch(`http://localhost:3000/update-post/${postId}`, {
                title: editTitle,
                caption: editCaption
            });

            setPosts(posts.map(post =>
                post._id === postId
                    ? { ...post, title: editTitle, caption: editCaption }
                    : post
            ));

            setEditingPostId(null);
            setMessage('Post updated successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Error updating post: ' + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="posts-container">
            <div className="posts-page-header">
                <h2>Gallery Collection</h2>
            </div>
            
            {message && (
                <div className={`status-message ${message.includes('Error') ? 'error' : 'success'}`}>
                    {message}
                </div>
            )}
            
            <div className="posts-grid">
                {posts.length === 0 && !message.includes('Error') && (
                    <div style={{ color: 'var(--text-muted)', fontSize: '18px', gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
                        No postcards found. <a href="/create-post" style={{ color: 'var(--accent-2)', textDecoration: 'none' }}>Create one now!</a>
                    </div>
                )}
                {posts.map((post) => (
                    <div key={post._id} className="post-card">
                        <div className="post-image-container">
                            <img src={post.image} alt={post.title} className='post-image' />
                        </div>
                        <div className="post-content">
                            {editingPostId === post._id ? (
                                <div className="edit-form">
                                    <h3>Edit Postcard</h3>
                                    <input
                                        type="text"
                                        className="edit-input"
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        placeholder="Title"
                                    />
                                    <textarea
                                        className="edit-input edit-textarea"
                                        value={editCaption}
                                        onChange={(e) => setEditCaption(e.target.value)}
                                        placeholder="Caption"
                                    />
                                    <div className="edit-actions">
                                        <button 
                                            onClick={() => updatePost(post._id)} 
                                            className="btn-icon btn-save"
                                            disabled={loading}
                                        >
                                            ✓ Save
                                        </button>
                                        <button 
                                            onClick={cancelEdit} 
                                            className="btn-icon btn-cancel"
                                            disabled={loading}
                                        >
                                            ✕ Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <h3>{post.title}</h3>
                                    <p>{post.caption}</p>
                                    <div className="post-actions">
                                        <button
                                            onClick={() => startEdit(post)}
                                            className="btn-icon btn-edit"
                                            disabled={loading}
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deletePost(post._id)}
                                            className="btn-icon btn-delete"
                                            disabled={loading}
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                                            Delete
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Posts;