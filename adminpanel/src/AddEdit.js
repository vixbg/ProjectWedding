import React from 'react';
import Paper from '@material-ui/core/Paper';
import { Container } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import ExitAppIcon from '@material-ui/icons/ExitToApp';
import Button from '@material-ui/core/Button';
import Axios from 'axios';
import settings from './settings';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import { withRouter } from 'react-router-dom';
/*import InviteList from './InviteList';*/
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';


class AddEdit extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            name: "",
            name2: "",
            email: "",
            email2: "",
            type: -1,
            italian: false,
            plusOne: false,
        };
    }
    

    componentDidMount () {
        console.log("ggg")
        if (this.props.mode === "new"){
            return
        }
            if (window.currentGuest === undefined){
                return
            }

        this.setState({
            name : window.currentGuest.names,
            email : window.currentGuest.email,
            type : window.currentGuest.type,
            italian: window.currentGuest.italian,
            name2 : window.currentGuest.plusOne && window.currentGuest.plusOne.names,
            email2: window.currentGuest.plusOne && window.currentGuest.plusOne.email,
            plusOne: window.currentGuest.plusOne !== null,
        })
        console.log (window.currentGuest)
    }

    createUser() {
        let plusOne = null;
        if (this.state.plusOne) {
            plusOne={
                names: this.state.name2,
                email: this.state.email2,
            }
        }
        Axios.post( settings.server + "guests", {
            names: this.state.name,
            email: this.state.email,
            type: this.state.type,
            italian: this.state.italian,
            plusOne: plusOne,
        },
            {headers:{"Auth-Token" : localStorage.getItem('userToken')}}


        )
        .then ((response) => {
            if ( response.status === 204 ) {
                this.props.history.push ("/")
                return
            }
            console.log (response)
        })
        .catch ((error) => {
            console.log (error)
        })
       

    }
    dbSave(){
        if (this.props.mode === "new" ){
            this.createUser()
            return
        }
        this.editUser()
    }
    editUser() {
        let plusOne = null;
        if (this.state.plusOne) {
            plusOne={
                names: this.state.name2,
                email: this.state.email2,
            }
        }
        Axios.put( settings.server + "guests", {
            names: this.state.name,
            email: this.state.email,
            type: this.state.type,
            italian: this.state.italian,
            id: window.currentGuest.id,
            plusOne: plusOne,
        },
            {headers:{"Auth-Token" : localStorage.getItem('userToken')}}


        )
        .then ((response) => {
            if ( response.status === 204 ) {
                this.props.history.push ("/")
                return
            }
            console.log (response)
        })
        .catch ((error) => {
            console.log (error)
        })
       

    }
    
    render(){
        return(
            <Container>
            <CssBaseline />

            <div>

                <Paper style={{
                    marginTop: 15,
                    padding: 10,
                }}>
                   <div>
                        <h3 style={{float:"left", verticalAlign:"middle"}}> 
                            <GroupAddIcon fontSize="large" style={{
                                margin:"5px", 
                                verticalAlign:"middle",
                             }} 
                            />
                            {this.props.mode === "new" ?  "Add" : "Edit"} Guest 
                    
                        </h3>     
                    </div>

                       
                 

                    <Grid container item spacing={3} style={{clear:'both'}}>
                        <Grid container item xs={12} spacing={3} justify="center">
                            <Grid item xs={3}>
                                <TextField id="name" label="Name" value={this.state.name} fullWidth onChange={(event) => {this.setState({name : event.target.value})}} />
                            </Grid>

                            <Grid item xs={3}>
                                <TextField id="email" label="E-Mail" value={this.state.email} fullWidth onChange={(event) => {this.setState ({email : event.target.value})} }/>
                            </Grid>

                            <Grid item xs={2}>
                                
                                <FormControl style={{minWidth:70}}>
                                    <InputLabel id="type">Type</InputLabel>
                        
                                    <Select
                                        labelWidth={10}
                                        labelId="Type"
                                        id="type"
                                        value={this.state.type}
                                        onChange={(event) => {this.setState ({type : event.target.value})}}
                                    >
                                        <MenuItem value={0}>Family</MenuItem>
                                        <MenuItem value={1}>Friend</MenuItem>
                        
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={2}>
                                <FormGroup row>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked= {this.state.italian}
                                                onChange= {(event) => {this.setState ({italian : event.target.checked})}}
                                                color="primary"
                                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                                            />
                                        
                                        }
                                        label="Italian"
                                    />
                                </FormGroup>
                                <FormGroup row>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked= {this.state.plusOne}
                                                onChange= {(event) => {this.setState ({plusOne : event.target.checked})}}
                                                color="primary"
                                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                                            />
                                        
                                        }
                                        label="Plus One"
                                    />
                                </FormGroup>

                                

                            </Grid>

                            
                            
                        </Grid>
                { this.state.plusOne &&
                        <Grid container item xs={12} spacing={3} justify="center">
                                <Grid item xs={3}>
                                    <TextField id="name" label="Name" value={this.state.name2} fullWidth onChange={(event) => {this.setState({name2 : event.target.value})}} />
                                </Grid>

                                <Grid item xs={3}>
                                    <TextField id="email" label="E-Mail" value={this.state.email2} fullWidth onChange={(event) => {this.setState ({email2 : event.target.value})} }/>
                                </Grid>
                                <Grid item xs={2}></Grid>
                                <Grid item xs={2}></Grid>
                        </Grid>
                }
                        <Grid container item xs={12} justify="center">
                            
                        </Grid>


                        <Grid container item xs={12} justify="center">
                           
                        </Grid>
                        <Grid container item xs={12}  justify="flex-end">
                            

                                <Button onClick={() => this.dbSave()} > 
                                Save 
                                <SaveAltIcon style={{
                                            margin:"5px", 
                                            verticalAlign:"middle",
                                            }} >  
                                </SaveAltIcon>
                                </Button>

                                <Button href="/"> 
                                Back 
                                <ExitAppIcon style={{
                                                margin:"5px", 
                                                verticalAlign:"middle",
                                                }} >  
                                </ExitAppIcon>
                                </Button>
                                
                    
                            </Grid>
                    </Grid>
                    




                </Paper>

            </div>
            
        </Container>
        )
    }
}

export default withRouter(AddEdit);