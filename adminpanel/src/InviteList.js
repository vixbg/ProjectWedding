import React from 'react';
import Paper from '@material-ui/core/Paper';
import { Container, TableHead, TableRow, TableCell, TableBody, Tooltip, TableFooter } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import Table from '@material-ui/core/Table'
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import CheckIcon from '@material-ui/icons/Check';
import PlusOneIcon from '@material-ui/icons/PlusOne';
import EventOneIcon from '@material-ui/icons/LooksOne';
import EventTwoIcon from '@material-ui/icons/LooksTwo';
import EventThreeIcon from '@material-ui/icons/Looks3';
import CloseIcon from '@material-ui/icons/Close';
import ExitAppIcon from '@material-ui/icons/ExitToApp';
import GroupIcon from '@material-ui/icons/Group';
import Button from '@material-ui/core/Button';
import Axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import Moment from 'react-moment';
import settings from './settings';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import { withRouter } from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
/*import AddEdit from './AddEdit';*/
import LanguageIcon from '@material-ui/icons/Language';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import copy from "clipboard-copy";

class InviteList extends React.Component {

    guestId;
    
    
    
    constructor(props){
        super(props)
        this.state = {
            guestList: null, 
            count: 0,
            dialogOpen: false,
            viewed: 0,
            attending1: 0,
            attending2: 0,
            attending3: 0,
        };
    }

    componentDidMount(){
        Axios.get(settings.server + 'guests', {headers:{"Auth-Token" : localStorage.getItem('userToken')}})
        .then( (response) => {
            this.setState({
                guestList: response.data.guests,
                count: response.data.count,
                viewed: response.data.viewed,
                attending1: response.data.attending1,
                attending2: response.data.attending2,
                attending3: response.data.attending3,
                italian: response.data.italian,
                
                
            })
            console.log(response.data, window.location.href, this.props.location)
            
        })

        .catch( (error) => {
            
            if(error.response && error.response.status === 401) {
                this.props.history.push("/logout")
                return
            }
            
            
        })


    }

    dbdelete() {
        Axios.delete ( settings.server + "guests/" + this.guestId,
            {headers:{"Auth-Token" : localStorage.getItem('userToken')}}
        )

        .then ((response) => {
            if(response.status === 204) {
                this.setState({dialogOpen: false})
                this.componentDidMount()
            }
        })
        
    }

    

    linkCopy(secretLink) {
        let code = window.location.href + "invitation/" + secretLink
        code = code.replace ("http://admin.", "http://www.")
        copy (code)

    }
    

    render() {
        const guestList = this.state.guestList;
        const active = { color: 'black' };
        const inactive = { color: '#ccc '};
        const additonal = { color: '#06f'}

        const noData = guestList !== null && guestList.length === 0;
        

        const guestRows = guestList && guestList.map((indvGuest, index) => (
        <TableRow key={index}> 
            <TableCell> 
                {indvGuest.names} 
                {indvGuest.plusOne !== null && (<span><span style={{color: "gray"}}> and</span> {indvGuest.plusOne.names}</span>)}
            
            </TableCell>
            
            {indvGuest.type === 0 
                 ? 
                <TableCell style={{color: '#24790F', fontWeight: 'bold'}}>'Family'</TableCell> 
                 : 
                <TableCell style={{color: '#DC692F', fontWeight: 'bold'}}>'Friend'</TableCell>
            } 
            
            <TableCell> {indvGuest.email} </TableCell>
            
            <TableCell align="center"> 

                {indvGuest.viewedOn && (
                    <Tooltip title={<Moment date={indvGuest.viewedOn}/>}>
                        <CheckIcon style= {{color: "#24790F"}} />
                    </Tooltip>
                )} 
                    
                {indvGuest.viewedOn === null  && <CloseIcon style= {{color: "red"}} /> } 
                    
                <EventOneIcon style= {indvGuest.attending1 ? active : inactive} />
                <EventTwoIcon style= {indvGuest.attending2 ? active : inactive} />
                <EventThreeIcon style= {indvGuest.attending3 ? active : inactive} />
                <PlusOneIcon style= {indvGuest.plusOne ? additonal : inactive} />
                <LanguageIcon style= {indvGuest.italian ? additonal: inactive} />
            
            </TableCell>
            
            <TableCell> 
                <IconButton size='small' onClick={() => {window.currentGuest = indvGuest; this.props.history.push( "/edit")}} > <EditIcon /> </IconButton>
                <IconButton size='small' onClick={() =>  { this.guestId=indvGuest.id; this.setState({dialogOpen: true}); }}> <DeleteIcon /> </IconButton>
                <IconButton size="small" onClick={() => this.linkCopy(indvGuest.secretLink)}> <FileCopyIcon/> </IconButton>
            </TableCell>

        </TableRow>));
        
        
        return (
            <Container>
                <CssBaseline />

                <div>

                    <Paper style={{
                        marginTop: 15,
                        padding: 10,
                    }}>
                        <h3 style={{float:"left", verticalAlign:"middle"}}> 
                            <GroupIcon fontSize="large" style={{
                                margin:"5px", 
                                verticalAlign: "middle"
                                }} 
                                />
                            Guest Management List ({this.state.count})
                        
                        </h3>

                        

                        <div style={{
                            float:"right", 
                            marginTop:"17px",
                           
                            }}> 

                                <Button href="/logout"> 
                                Logout 
                                <ExitAppIcon style={{
                                                margin:"5px", 
                                                verticalAlign:"middle",
                                                }} >  
                                </ExitAppIcon>
                        </Button>
                                
                        </div>

                        <div style={{
                            float:"right", 
                            marginTop:"17px",
                           
                            }}> 

                                <Button href="/add"> 
                                Add
                                <GroupAddIcon style={{
                                                margin:"5px", 
                                                verticalAlign:"middle",
                                                }} >  
                                </GroupAddIcon>
                        </Button>
                                
                        </div>

                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell> Guest Name </TableCell>
                                    <TableCell> Guest Type </TableCell>
                                    <TableCell> E-mail </TableCell>
                                    <TableCell align= "center"> RSVP Details </TableCell>
                                    <TableCell> Actions </TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>

                                {guestList === null ? (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">
                                        <CircularProgress />
                                        </TableCell>
                                    </TableRow>

                                ) : guestRows}

                                {noData && (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center" style={{ color: 'gray'}}>
                                         No data in table
                                        </TableCell>
                                    </TableRow>

                                )}
                        
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={2} align="right" >  </TableCell>
                                    <TableCell align="right" >
                                        
                                        <span style={{ fontWeight: "Bold", fontSize: 14, display: "block", marginTop: 4, float: "right"}}>: {this.state.italian}</span>   
                                        <LanguageIcon style= {{color: "#000", float: "right", marginLeft: 10}} />
                                        <span style={{ fontWeight: "Bold", fontSize: 14, display: "block", marginTop: 4, float: "right"}}>: {this.state.attending3}</span> 
                                        <EventThreeIcon style= {{color: "#000", float: "right", marginLeft: 10}} /> 
                                        <span style={{ fontWeight: "Bold", fontSize: 14, display: "block", marginTop: 4, float: "right"}}>: {this.state.attending2}</span> 
                                        <EventTwoIcon style= {{color: "#000", float: "right", marginLeft: 10}} />
                                        <span style={{ fontWeight: "Bold", fontSize: 14, display: "block", marginTop: 4, float: "right"}}>: {this.state.attending1}</span>   
                                        <EventOneIcon style= {{color: "#000", float: "right", marginLeft: 10}} />
                                        <span style={{ fontWeight: "Bold", fontSize: 14, display: "block", marginTop: 4, float: "right"}}>: {this.state.viewed}</span>   
                                        <CheckIcon style= {{color: "#24790F", float: "right", marginLeft: 10}} /> 
                                            
                                    </TableCell>
                                    
                                </TableRow>
                            </TableFooter>

                        </Table>




                    </Paper>

                </div>

                <Dialog
                    open={this.state.dialogOpen}
                    keepMounted
                    onClose={() => this.setState({dialogOpen: false})}
                >
                <DialogTitle> Delete Confirmation </DialogTitle>
                <DialogContent>
                <DialogContentText>
                    Are you sure you want to delete this guest from the list?
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button color="primary" onClick={() => this.setState({dialogOpen: false})}>
                    No
                </Button>
                <Button color="secondary"onClick= {() => this.dbdelete()}>
                    Yes, Delete!
                </Button>
                </DialogActions>
                </Dialog>
                
            </Container>
            

        )
    
    }
  

}

export default withRouter(InviteList);