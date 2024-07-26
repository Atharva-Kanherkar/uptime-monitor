
import { BrowserRouter as Router  } from 'react-router-dom';
import AppContent from './pages/AppContent';
import { AppleIcon } from 'lucide-react';
import { ApolloProvider } from '@apollo/client';
import client from './apollo-client';

function App() {
  return (
    <ApolloProvider client={client}>
    <Router>
       <AppContent/>
    </Router>
    </ApolloProvider>
  );
}

export default App;
