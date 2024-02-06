
import React from 'react';

const SidebarSkeleton = ({ children }) => {
  return (
    <div className="col-3 col-auto overflow-y-auto bg-body-secondary d-flex flex-column">
      {children}
    </div>
  );
};

export default SidebarSkeleton;
