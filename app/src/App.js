import React, { useEffect, useState, useRef} from 'react';
import Header from './ui-components/Header';
import Sidebar from './ui-components/Sidebar';
import { Box } from '@mui/material';


function App() {
  const headerRef = useRef();
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, []);
  return (
    <div className="App">
      <Header ref={headerRef}/>
        <Sidebar/>
    </div>
  );
}

export default App;

