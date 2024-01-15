import React from 'react';


const Modal = ({ show, onClose, children }) => {
    const displayStyle = show ? { display: 'block' } : { display: 'none' };
  
    return (
      <>
      {show && <div className="modal-blur"></div>}
        <div className="modal modal-margin" tabIndex="-1" style={displayStyle}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Blur Picture</h5>
                <button type="button" className="btn-close" onClick={onClose}></button>
              </div>
              <div className="modal-body">
                {children}
              </div>
            </div>
         </div>
        </div>
      </>
    );
  };
  
export default Modal;
  