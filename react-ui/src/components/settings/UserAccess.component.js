import axios from "axios";
import React, { Fragment } from "react";
import {Tabs, Tab, Table, Button, Accordion, Card, Spinner} from "react-bootstrap";
import { Form } from "react-bootstrap";
import Modal from 'react-bootstrap/Modal';
import {Trash} from 'react-bootstrap-icons';
import UserTableService from '../../services/user-table.services.js';
import ItemManagementService from '../../services/item-management.services.js';


class RoleList extends React.Component{
    constructor(props){
        super(props);
        this.state={
            role_list: []
        }

        
    }

    componentDidMount(){
        axios.get("http://localhost:8080/api/admin/roles/all")
        .then(Response =>{
            this.setState({
                role_list: Response.data
            })
        })
        .catch(err=>{
            console.log('there was an error')
        });
        console.log(this.state)
    }
    render(){
        return(
            <div id="user-role-div" className="role-table">
                <div>
                <Table bordered hover>
                        <thead>
                            <tr>
                                <th>Role ID</th>
                                <th>Role Name</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.role_list.map((currRole, i)=>{
                                return(
                                    <Fragment>
                                        <tr key={i}>
                                            <td>{currRole.id}</td>
                                            <td>{currRole.role_name}</td>
                                            
                                        </tr>
                                    </Fragment>
                                )
                            })}
                        </tbody>
                    </Table>
                </div>
            </div>
        )
    }
}

class AddNewUserModal extends React.Component{
    constructor(props){
        super(props);
        this.state={
            person_name:'',
            username:'',
            password:'',
            ad_auth:null,
            role:'',
            role_list:[]

        }
        this.onChangePersonName = this.onChangePersonName.bind(this);
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeADAuth = this.onChangeADAuth.bind(this);
        this.onChangeRole = this.onChangeRole.bind(this);
        this.onSubmitNewUser = this.onSubmitNewUser.bind(this);
    }
    
    
    onChangePersonName(e){
        this.setState({
            person_name:e.target.value
        });

    };

    onChangeUsername(e){
        this.setState({
            username:e.target.value
        });

    };
    onChangePassword(e){
        this.setState({
            password:e.target.value
        });

    };


    onChangeADAuth(e){
        if(e.target.checked){
            this.setState({
                ad_auth: 'true'
            })
        }else if(!e.target.checked){
            this.setState({
                ad_auth: 'false'
            })
        }
    };

    onChangeRole(e){
        this.setState({
            role: e.target.value
        })
    }


    refreshSettings = () =>{
        axios.get("http://localhost:8080/api/admin/roles/all")
        .then(Response=>{
            console.log(Response);
            this.setState({person_name: Response.data.personName});
        })
    }



    onSubmitNewUser(){
        var data = {
            person_name: this.state.person_name,
            username: this.state.username,
            password: this.state.password,
            ad_auth: this.state.ad_auth,
            role: this.state.role,
        };
        console.log(data)
             UserTableService.create(data)
            .then(Response=>{
                this.setState({
                    person_name:Response.data.person_name,
                    username:Response.data.username,
                    password:Response.data.password,
                    ad_auth:Response.data.ad_auth,
                    role:Response.data.role
                })

            }) 
    }

    componentDidMount(){
        axios.get("http://localhost:8080/api/admin/roles/all")
        .then(Response => {
            console.log(Response);
            this.setState({role_list: Response.data})
        })
        .catch(error =>{
            console.log(error);
        })
    };

    render(){
    return(
        <Modal show={this.props.showModal} onHide={this.props.handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>
                    Add New User
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <form>
                        <div className="form-row">

                            <div className="col-md-4">
                                <label htmlFor="full_name">Person Full Name<span style={{color: 'red'}}>*</span></label>
                                <input type="text" className="form-control" id="item_value" onChange={this.onChangePersonName}/>
                            </div>

                            <div class="form-check col" style={{paddingLeft:'100px'}}>
                                <input class="form-check-input" type="checkbox" value="" id="defaultCheck1" onChange={this.onChangeADAuth}/>
                                    <label class="form-check-label" htmlFor="defaultCheck1">AD Authenticated</label>
                            </div>

                        </div>


                        <div className="form-row">
                            <div className="col-md-4">
                                <label htmlFor="full_name">Username<span style={{color: 'red'}}>*</span></label>
                                    <input type="text" className="form-control" id="item_value" onChange={this.onChangeUsername}/>
                            </div>

                            <div className="col-md-6" style={{paddingLeft:'100px'}}>
                                <fieldset disabled={this.state.ad_auth ? true : false} >
                                    <label htmlFor="full_name">Password<span style={{color: 'red'}}>*</span></label>
                                    <input type="text" className="form-control" id="item_value" onChange={this.onChangePassword}/>
                                </fieldset>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label htmlFor="department">User Role</label>
                                <Form.Control as="select" onChange={this.onChangeRole}>
                                    <option className="default-text">Please Select a Department</option>
                                {this.state.role_list.map((currRole, i)=>{
                                    return(
                                        <Fragment>
                                                <option key={i} value={currRole.role_access_level} >{currRole.role_name}</option>
                                        </Fragment>
                                    )
                                })}
                                </Form.Control>
                            </div>
                        </div>
                    </form>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button varient="secondary" onClick={this.onSubmitNewUser}>Add</Button>
            </Modal.Footer>
        </Modal>
    )
    }
}


class UserSettings extends React.Component{
    constructor(props){
        super(props);
        this.state={
            showNewUserModal: false,
            userList: []
        }
        this.log = this.log.bind(this);
    }

    componentDidMount(){
        axios.get("http://localhost:8080/api/admin/users/all")
        .then(Response =>{
            this.setState({
                userList: Response.data
            })
        })
        .catch(err=>{
            console.log('there was an error')
        });
        console.log(this.state)
        
    }

    log(){
        console.log(this.state)
    }


    deleteItem = (props) => {
        console.log(props);
        UserTableService.delete(props)
        .then(Response =>{
            console.log(Response);
            this.refreshSettings();
            
        })
    }

    refreshSettings = () =>{
        axios.get("http://localhost:8080/api/admin/users/all")
        .then(Response=>{
            console.log(Response);
            this.setState({userList: Response.data});
        })
    }




    handleModalShow = () => {
        this.setState({showNewUserModal: true});
        console.log(this.state)
    }

    handleModalClose = () => {
        this.setState({showNewUserModal: false});
    }

    
    render(){
        return(
            <div id="user-settings-div" className="settings-table">
                <div className="modal-div container" id="modal-div">
                    <AddNewUserModal showModal={this.state.showNewUserModal} handleClose={this.handleModalClose} refreshSettings={this.refreshSettings} />
                </div>
                <div>
                    <div style={{float: 'right'}}>
                        <Button id="new-user-button" className="btn btn-primary" onClick={this.handleModalShow}>Add New User</Button>
                    </div>
                <Table bordered hover>
                        <thead>
                            <tr>
                                <th>User ID</th>
                                <th>Name</th>
                                <th>Username</th>
                                <th>AD Authenticated</th>
                                <th>Role ID</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                     {this.state.userList.map((currUser, i)=>{
                                return(
                                    <Fragment>
                                        <tr key={i}>
                                            <td>{currUser.id}</td>
                                            <td>{currUser.person_name}</td>
                                            <td>{currUser.username}</td>
                                            <td style={{fontStyle: 'italic'}}>{currUser.ad_auth}</td>
                                            <td>{currUser.role}</td>
                                            <td><Button variant="link"  onClick={this.deleteItem.bind(this,currUser.id)}><Trash size={24} color="red"/></Button></td>
                                        </tr>
                                    </Fragment>
                                )
                            })} 
                        </tbody>
                    </Table>
                </div>
            </div>
        )
    }
}


class Mappings extends React.Component{
    constructor(props){
        super(props);
        this.state={
            showNewMappingModal: false,
            user_mappings:[]
        }
        this.refreshSettings = this.refreshSettings.bind(this);
    }

    handleModalShow = () => {
        this.setState({showNewMappingModal: true});
        console.log(this.state)
    }

    handleModalClose = () => {
        this.setState({showNewMappingModal: false});
    }

    refreshSettings = () =>{
        axios.get("http://localhost:8080/api/admin/item_management/all")
        .then(Response=>{
            console.log(Response);
            this.setState({
                user_mappings:Response.data
            });
        })
    }

    deleteItem = (props) => {
        console.log(props);
        ItemManagementService.delete(props)
        .then(Response =>{
            console.log(Response);
            this.refreshSettings();
            
        })
    }

    

    componentDidMount(){
        axios.get("http://localhost:8080/api/admin/item_management/all")
        .then(Response =>{
            this.setState({
                user_mappings: Response.data
            })
        })
        .catch(err=>{
            console.log('there was an error')

        });
        console.log(this.state)
    }

    render(){
        return(
            <div id="user-settings-div" className="settings-table">
                <div className="modal-div container" id="modal-div">
                    <AddNewMappingsModal showModal={this.state.showNewMappingModal} handleClose={this.handleModalClose} refreshSettings={this.refreshSettings} />
                </div>
                <div style={{float: 'right'}}>
                        <Button id="new-mapping-button" className="btn btn-primary" onClick={this.handleModalShow}>Add New Mapping</Button>
                </div>
                <Table bordered hover>
                        <thead>
                            <tr>
                                <th>Item ID</th>
                                <th>Item Name(Department)</th>
                                <th>Owner Assigment</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                     {this.state.user_mappings.map((currMapping, i)=>{
                                return(
                                    <Fragment>
                                        <tr key={i}>
                                            <td>{currMapping.id}</td>
                                            <td>{currMapping.item_value}</td>
                                            <td>{currMapping.item_manager}</td>
                                            <td><Button variant="link"  onClick={this.deleteItem.bind(this,currMapping.id)}><Trash size={24} color="red"/></Button></td>
                                            </tr>
                                    </Fragment>
                                )
                            })} 
                        </tbody>
                    </Table>
            </div>
        )
    }
}

class AddNewMappingsModal extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            item_id: '',
            item_name:'',
            item_value:'',
            item_owner:[],
            items_available:[],
            users_available:[],

            hasBeenValidated:false,
            validated_item_value:'',
            validated_item_owner:''
        }

        this.onChangeItem = this.onChangeItem.bind(this);
        this.onChangeItemOwnership = this.onChangeItemOwnership.bind(this);
        this.onSubmitItemOwnership = this.onSubmitItemOwnership.bind(this);
        this.validateAssignment = this.validateAssignment.bind(this)
    }


    
componentDidMount(){
    axios.get("http://localhost:8080/api/admin/departments")
    .then(Response => {
        console.log(Response);
        this.setState({items_available: Response.data})
    })
    .catch(error =>{
        console.log(error);
    });
    axios.get("http://localhost:8080/api/admin/users/all")
    .then(Response => {
        console.log(Response);
        this.setState({users_available: Response.data})
    })
    .catch(error =>{
        console.log(error);
    });
};

refreshSettings = () =>{
    this.props.refreshSettings();
}

onChangeItem(e){
    this.setState({
        item_id:e.target.value, 
    });
    this.validateAssignment();
}

onChangeItemOwnership(e){
    this.setState({
        item_owner:e.target.value
    })
    this.validateAssignment();
}


validateAssignment(){
    if(this.state.item_id && this.state.item_owner){
        this.setState({
            hasBeenValidated:true
        })
    }
}

onSubmitItemOwnership(){
    var data = {
        item_id: this.state.item_id,
        item_owner_id :this.state.item_owner
    };
    console.log(data)
         ItemManagementService.create(data)
        .then(Response=>{
            this.props.refreshSettings();
            this.props.handleClose();
            this.setState({
                item_id:Response.data.item_id,
                item_owner:Response.data.item_owner_id
            })

        });


}


render(){
return(
    <Modal show={this.props.showModal} onHide={this.props.handleClose} size="lg">
        <Modal.Header closeButton>
                <Modal.Title>
                    Add New Mapping Assignment
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <form>
                        <div className="form-row">
                            <div className="col-md-4">
                                <label htmlFor="full_name">Item</label>
                                <Form.Control as="select" onChange={this.onChangeItem}>
                                    <option className="default-text">Please Select a Item</option>
                                {this.state.items_available.map((currItem, i)=>{
                                    return(
                                        <Fragment>
                                                <option key={i} value={currItem.id}>{currItem.item_value}</option>
                                        </Fragment>
                                    )
                                })}
                                </Form.Control>
                            </div>

                            <div className="col-md-4" style={{paddingLeft:'2vw'}}>
                                <label htmlFor="full_name">Item Ownership</label>
                                <Form.Control as="select" onChange={this.onChangeItemOwnership}>
                                    <option className="default-text">Please Select a User</option>
                                {this.state.users_available.map((currUser, i)=>{
                                    return(
                                        <Fragment>
                                                <option key={i} value={currUser.id} >{currUser.person_name}</option>
                                        </Fragment>
                                    )
                                })}
                                </Form.Control>
                            </div>


                        </div>
                    </form>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button varient="secondary" disabled={!this.state.hasBeenValidated} onClick={this.onSubmitItemOwnership}>Add</Button>
            </Modal.Footer>
    </Modal>
)
}
}

class UserAccess extends React.Component{

    render(){
        return (
            <div className="main-settings-render">
                <Tabs defaultActiveKey="tab-1">
                    <Tab eventKey="tab-1" title="Users">
                        <UserSettings/>
                    </Tab>
                    <Tab eventKey="tab-2" title="Roles">
                        <RoleList/>
                    </Tab>
                    <Tab eventKey="tab-3" title="Mappings">
                        <Mappings/>
                    </Tab>
                </Tabs>
            </div>
        )
            
    }

};

export {UserAccess};


