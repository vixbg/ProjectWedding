import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import settings from './settings'; 
import { withRouter } from 'react-router-dom';

class LoginForm extends React.Component {

    userName;
    password;

    componentDidMount(){
      const tokenCheck = localStorage.getItem('userToken');
      if(tokenCheck !== undefined && tokenCheck !== null ){
        if (this.props.logout === true) {
          localStorage.removeItem('userToken');
        }
        // this.props.history.push('/')
      }
    }

    loginFunction(){
        const md5=require('md5');
        const axios = require('axios');
        axios.post (settings.server + 'auth', {Username:this.userName, Password:md5(this.password)})
            .then((response) => {
                localStorage.setItem('userToken', response.data)

                this.props.history.push('/')
            })
            .catch((error)=>{
                console.log(error)
            })
    
    }

    enterKey( event ){
      if (event.key !== "Enter"){
        return;

      }
      this.loginFunction();
    }

    render() {
        return (
            <Container component="main" maxWidth="xs">
              <CssBaseline />
              <div>
                
                <Typography component="h1" variant="h5">
                  Sign in
                </Typography>
                <form noValidate>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="user"
                    label="User Name"
                    name="user"
                    autoComplete="user"
                    autoFocus
                    onChange={(event) => { this.userName=event.target.value; }}
                    onKeyPress={(event) => { this.enterKey(event); }}
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    onChange={(event) => { this.password=event.target.value; }}
                    onKeyPress={(event) => { this.enterKey(event); }}
                  />
                  
                  <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={() => { this.loginFunction()}}
                    
                  >
                    Sign In
                  </Button>
                </form>
              </div>
            </Container>
            
          ); 
    }

}
export default withRouter(LoginForm); 