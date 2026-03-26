import React, { useState } from 'react';
import axios from 'axios';

function CreatePost() {
    const [title, setTitle] = useState('');
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);
        if (!image) {
            setMessage('Please select an image to upload');
            setIsError(true);
            return;
        }
        const formData = new FormData();
        formData.append('title', title);
        formData.append('caption', caption);
        formData.append('image', image);
        try {
            const response = await axios.post('http://localhost:3000/create-post', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setMessage(response.data.message || 'Post created successfully!');
            setTitle('');
            setCaption('');
            setImage(null);
            // reset file input
            const fileInput = document.getElementById('image-upload');
            if (fileInput) fileInput.value = '';
        } catch (error) {
            setIsError(true);
            setMessage(error.response?.data?.message || 'Error creating post');
        }
    };

    return (
        <div className="form-wrapper">
            <h2>Create a Postcard</h2>
            <form onSubmit={handleSubmit} className="form">
                <div className="form-group">
                    <label>Title</label>
                    <input 
                        type="text" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        placeholder="Enter a catchy title"
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>Caption</label>
                    <textarea 
                        value={caption} 
                        onChange={(e) => setCaption(e.target.value)} 
                        placeholder="Tell the story behind this image..."
                        rows="4"
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>Image Upload</label>
                    <input 
                        id="image-upload"
                        type="file" 
                        onChange={(e) => setImage(e.target.files[0])} 
                        accept="image/*" 
                        required 
                    />
                </div>
                <button type="submit" className="btn-primary">
                    Publish Postcard
                </button>
            </form>
            {message && (
                <div className={`status-message ${isError ? 'error' : 'success'}`}>
                    {message}
                </div>
            )}
        </div>
    );
}

export default CreatePost;