import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';

import { NetworkProvider } from './Network/useNetwork';
import { AuthWrapper } from './Utility/AuthWrapper'
import { Home } from './Home';
import NavBar from './navbar';
import { Signup } from './Signup/Signup';
import { Documents } from './Documents';
import { Contacts } from './Contacts';
import { Alerts } from './Alerts';
import './App.css';
import { DocumentView } from './DocumentView';


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
              <Route exact path="/">
                <Home />
              </Route>
              {/* Redirect users here for sign up process */}
              <Route path="/signup">
                {/* <Signup /> */}
              </Route>
              {/* Core management page - view documents to send, which are accessible, notifications */}
              <Route path="/home">
                <Home />
              </Route>
              {/* View Documents you uploaded / manage */}
              <Route path="/documents">
                <Documents />
              </Route>
              {/* See your contacts / who you can send to. */}
              <Route path="/contacts">
                <Contacts />
              </Route>
              {/* View alerts you've recieved for document violations*/}
              <Route path="/alerts">
                <Alerts />
              </Route>
              <Route path="/viewdocument/:documentID">
                <DocumentView />
              </Route>
            </Switch>
          </div>
        </NetworkProvider>
      </AuthWrapper>
    </Router>
  );
}

export default App;
