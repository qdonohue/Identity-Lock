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
import { Documents } from './Document/Documents';
import { Contacts } from './Contacts/Contacts';
import { Alerts } from './Alerts/Alerts';
import './App.css';
import { DocumentView } from './Document/DocumentView';
import { ProfilePage } from './ProfilePage';
import {FaceVerificationDemo} from './Testing/FaceVerificationDemo'


function App() {
  return (
    <Router>
      <AuthWrapper>
        <NetworkProvider>
          <div className="h-screen flex-col justify-center align-center">
            <title>Identity Lock</title>
            <NavBar />
            <Switch>
              {/* Base route - info page, login page */}
              <Route exact path="/">
                <Home />
              </Route>
              {/* Redirect users here for sign up process */}
              <Route path="/signup">
                <Signup />
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
              <Route path="/profile">
                <ProfilePage />
              </Route>
              <Route path="/test">
                <FaceVerificationDemo />
              </Route>
              <Route path="/viewdocument/:id/:title">
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
