import React, { useState } from 'react';


function UploadVideoForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState(null);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleVideoChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Process the form data here
    console.log({ title, description, videoFile });
    // You might want to send this data to a server or process it as needed
  };

  return (
    <form onSubmit={handleSubmit} >
        <div class="mb-3">
            <label for="title" class="form-label">Video Title</label>
            <input type="text" class="form-control" id="title" placeholder="" 
            value={title} 
            onChange={handleTitleChange} 
            />
            </div>
        <div class="mb-3">
            <label for="description" class="form-label">Description</label>
            <textarea class="form-control" id="description" 
            placeholder="short description of the video or any context you would like the recipient to have" 
            value={description} 
            onChange={handleDescriptionChange}
            />
        </div>
        <div class="mb-3">
            <label for="videofile" class="form-label">Video File</label><br/>
            <input type="file" onChange={handleVideoChange} accept="video/*" />
        </div>
        <button class="btn btn-secondary" type="submit">
        Upload
        </button>
    </form>
  );
}

export default UploadVideoForm;
