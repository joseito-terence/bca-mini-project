import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import Chat from "./Components/Chat";
import Login from "./Components/Login";
import Sidebar from "./Components/Sidebar";
import { auth } from "./firebase";

function App() {
  const [user, setUser] = useState();

  useEffect(() => {
    const unsubscribe = auth
      .onAuthStateChanged((authUser) => {       // this is a firebase authentication method to check if the state is changed i.e logged in or out.
        setUser(authUser ? 
          { 
            displayName: authUser.displayName,
            email: authUser.email,
            photoURL: authUser.photoURL
          } : null
        )
      })
    
    return () => {
      unsubscribe();
    }
  }, []);

  return (
    <div className="App">
      {!user ? (
        <Login />
      ) : (
        <div className="app__body">
        <Router> 
          <Sidebar user={user} />

          <Switch>
            <Route path="/rooms/:roomId">
              <Chat />
            </Route>
            <Route path="/">
              <Chat noneSelected/>
            </Route>
          </Switch>
        </Router>
      </div>
      )}
    </div>
  );
}

export default App;
