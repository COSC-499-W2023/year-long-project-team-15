import Sidebar from '../containers/Sidebar';
import ChatView from '../containers/chatView';
import Header from '../containers/Header';

function Main() {
      return (

            <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
                <Header />
                <div style={{ display: 'flex', flex: 1 }}>
                    <Sidebar />
                    <ChatView />
                </div>
            </div>  
      );
    };

export default Main;