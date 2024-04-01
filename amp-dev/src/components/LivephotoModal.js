import React, { useState } from 'react';

const LivephotoModal = ({ show, onClose, handleCaptureLivePhoto }) => {
  const [capturedPhoto, setCapturedPhoto] = useState(null);

  const displayStyle = show ? { display: 'block' } : { display: 'none' };

  const handleCapturePhoto = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      const videoElement = document.createElement('video');
      videoElement.srcObject = mediaStream;
      videoElement.play();

      videoElement.addEventListener('loadeddata', async () => {
        const canvas = document.createElement('canvas');
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        canvas.getContext('2d').drawImage(videoElement, 0, 0, canvas.width, canvas.height);

        const photoBlob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg'));
        setCapturedPhoto(photoBlob);

        mediaStream.getTracks().forEach((track) => track.stop());
      });
    } catch (error) {
      console.error('Error capturing photo:', error);
    }
  };

  const handleSendCapturedPhoto = () => {
    if (capturedPhoto) {
      handleCaptureLivePhoto(capturedPhoto);
      setCapturedPhoto(null);
      onClose();
    }
  };

  return (
    <>
      {show && <div className="modal-blur"></div>}
      <div className="modal modal-margin" tabIndex="-1" style={displayStyle}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Capture Live Photo</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <div className="live-photo-preview">
                {capturedPhoto && <img src={URL.createObjectURL(capturedPhoto)} alt="Captured Live Photo" />}
              </div>
              <div className="text-center mt-3">
                <button className="btn btn-primary" onClick={handleCapturePhoto}>Capture Photo</button>
                {capturedPhoto && (
                  <button className="btn btn-success" onClick={handleSendCapturedPhoto}>Send Photo</button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LivephotoModal;
