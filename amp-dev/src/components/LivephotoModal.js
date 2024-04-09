import React, { useState, useRef } from 'react';

const LivephotoModal = ({ show, onClose, handleCaptureLivePhoto }) => {
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [mediaStream, setMediaStream] = useState(null);
  const videoRef = useRef(null);

  const displayStyle = show ? { display: 'block' } : { display: 'none' };

  const handleCapturePhoto = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      setMediaStream(stream);

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      videoRef.current.addEventListener('loadedmetadata', () => {
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
      });

      videoRef.current.addEventListener('play', () => {
        const captureInterval = setInterval(() => {
          if (videoRef.current.paused || videoRef.current.ended) {
            clearInterval(captureInterval);
          } else {
            context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            const photoBlob = canvas.toDataURL('image/jpeg');
            setCapturedPhoto(photoBlob);
          }
        }, 100); 
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
      stopMediaStream();
    }
  };

  const stopMediaStream = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null);
    }
  };

  const handleModalClose = () => {
    stopMediaStream();
    onClose();
  };

  return (
    <>
      {show && <div className="modal-blur"></div>}
      <div className="modal modal-margin" tabIndex="-1" style={displayStyle}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Capture Live Photo</h5>
              <button type="button" className="btn-close" onClick={handleModalClose}></button>
            </div>
            <div className="modal-body">
              <button className="btn btn-success" onClick={handleSendCapturedPhoto} style={{ marginBottom: '1rem' }}>Send Photo</button>
              <div className="live-photo-preview">
                <video ref={videoRef} style={{ width: '100%', height: 'auto' }} muted playsInline></video>
                {capturedPhoto && <img src={capturedPhoto} alt="Captured Live Photo" />}
              </div>
              <div className="text-center mt-3">
                <button className="btn btn-primary" onClick={handleCapturePhoto}>Capture Photo</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LivephotoModal;
