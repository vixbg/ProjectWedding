import React from 'react';
import LoginForm from './LoginForm';
import InviteList from './InviteList';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import AddEdit from './AddEdit';



class App extends React.Component {

  render() {
    let loginRequired = false;
    const token=localStorage.getItem('userToken');
    if(token === null || token === undefined){
      loginRequired = true;
      if( window.location.pathname === '/login' ) {
        loginRequired = false;
      }
    } 

    console.log(token, loginRequired);

    return (
      <Router>
        <Switch>
          <Route exact path="/login">
            <LoginForm />
          </Route>
          { loginRequired && <Redirect to="/login" /> }
          <Route exact path="/logout">
            <LoginForm logout />
          </Route>
          <Route exact path="/">
            <InviteList />
          </Route>
          <Route ecact path="/add">
            <AddEdit mode="new" />
          </Route>
          <Route ecact path="/edit">
            <AddEdit mode="edit" />
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default App;
