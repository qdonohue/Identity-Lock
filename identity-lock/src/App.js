import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';

import { NetworkProvider } from './Network/useNetwork';
import {AuthWrapper } from './Utility/AuthWrapper'
import { Home } from './Home';
import NavBar from './navbar';
import './App.css';


function App() {
  return (
    <Router>
      <AuthWrapper>
        <NetworkProvider>
          <div className="App">
            <title>Identity Lock</title>
            <NavBar />
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
              {/* View Documents you uploaded / manage */}
              <Route path="/documents">
              </Route>
              {/* See your contacts / who you can send to. */}
              <Route path="/contacts">
              </Route>
              {/* View alerts you've recieved for document violations*/}
              <Route path="/alerts">
              </Route>
              <Route path="/viewdocument">
              </Route>
            </Switch>
          </div>
        </NetworkProvider>
      </AuthWrapper>
    </Router>
  );
}

export default App;
