import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Routes } from './routes';
import { GlobalNotifications } from './components/notifications/GlobalNotifications';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes />
        <GlobalNotifications />
        <Toaster position="top-right" />
      </AuthProvider>
    </Router>
  );
}

export default App;
