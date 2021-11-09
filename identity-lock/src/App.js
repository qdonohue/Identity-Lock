import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';

import { NetworkProvider } from './Network/useNetwork';
import { Home } from './Home';
import './App.css';


function App() {
  return (
    <Router>
      <NetworkProvider>
        <div className="App">
          <title>Identity Lock</title>
          <Switch>
            {/* Base route - info page, login page */}
            <Route path="/">
              <Home />
            </Route>
            {/* Redirect users here for sign up process */}
            <Route path="/signup">
            </Route>
            {/* Core management page - view documents to send, which are accessible, notifications */}
            <Route path="/home">
            </Route>
            {/* Management - add contacts, documents  */}
            <Route path="/home">
            </Route>
            <Route path="/viewdocument">
            </Route>
          </Switch>
        </div>
      </NetworkProvider>
    </Router>
  );
}

export default App;
