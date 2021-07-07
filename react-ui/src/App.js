import './App.css';
import React, { Component } from 'react';

import { Switch, Route, Link, Redirect } from 'react-router-dom';
import { withRouter } from 'react-router-dom';


import ListEmployees from "./components/listEmployees.component";
import AddEmp from './components/addEmployee.component';
import EditEmp from './components/editEmployee.component';
import AdminSettings from './components/adminSettings.component';
import LiveSearch from './liveSearch.js'
import { LoginScreen } from './components/auth/Login.component';
import userSessionServices from './services/user-session.services';


import 'bootstrap/dist/css/bootstrap.min.css';
import Gear from 'react-bootstrap-icons/dist/icons/gear'
import Toast from 'react-bootstrap/Toast';
import Dropdown from 'react-bootstrap/Dropdown';
import axios from 'axios';
import userTableServices from './services/user-table.services';





class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      toastShow: false,
      toastTimeout: 3000,
      toastValue: '',
      renderApp: 0,
      userLoggedIn: false,
      role: '',
      id: null,
      currentUser: null,
      currentUserID: null,
      userHasToken: null,
      authPass: null
    }

    // this.onChildClicked = this.onChildClicked.bind(this);
    this.successToast = this.successToast.bind(this);
    //this.onChildClick1 = this.onChildClick1.bind(this);
    this.editEmployee_onSuccess = this.editEmployee_onSuccess.bind(this);
    this.addEmployee_onSuccess = this.addEmployee_onSuccess.bind(this);
    this.successfulLogin = this.successfulLogin.bind(this);
    this.tokenCheck = this.tokenCheck.bind(this);

  }


  // first thing app does is check for login token
  componentDidMount = () => {
    this.tokenCheck()
  }



  // check if there is a local token called 'EmpDirSessionID'
  //if there is one, set the state as such
  tokenCheck = () => {
    var currentUserSessionId = localStorage.getItem('EmpDirUserSessionID')

    if (currentUserSessionId !== null) {
      this.setState({
        userHasToken: true
      }, () => {
        this.validateSession();
      })

    } else {
      this.setState({
        userHasToken: false
      })
    }

  }

  validateSession = () => {
    var currentUserSessionId = localStorage.getItem('EmpDirUserSessionID');

    userSessionServices.validate(currentUserSessionId)
      .then(Response => {
        console.log(Response)
        if (Response.data.isValidSession) {
          console.log('status 200 ok')
          this.getUsernameByToken();
        }
        else {
          console.log('unauthorized session');
          localStorage.clear('EmpDirUserSessionID')
          this.tokenCheck();
        }
      })
      .then(
        () => {
          this.setState({
            userLoggedIn: true
          })
        }
      )
  }

  getUsernameByToken = () => {
    var currentUserSessionId = localStorage.getItem('EmpDirUserSessionID')
    userSessionServices.get(currentUserSessionId)
      .then(Response => {
        this.setState({
          currentUser: Response.data[0].username
        })
      })
      .then(
        ()=>{
          this.getRoleByUsername()
        }
      )
  }

  getRoleByUsername = () => {
    userTableServices.getUserByUsername(this.state.currentUser)
      .then(Response => {
        this.setState({
          role: Response.data.role,
          id: Response.data.id
        })
        console.log(Response)
      })
  }



  nextPath = (path) => {
    this.props.history.push(path)
  }


  successToast = (props) => {
    console.log('successToast Activated')
    this.setState({
      toastShow: true,
      toastValue: props
    });
  }

  editEmployee_onSuccess = () => {
    this.successToast('Save Successful')
  };

  addEmployee_onSuccess = () => {
    this.successToast('Successfully created new employee')
  };



  hideToast = () => {
    this.setState({ toastShow: false })
  };

  successfulLogin = (loggedInUser, authPass) => {
    this.setState({
      authPass: authPass,
      currentUser: loggedInUser
    });
    console.log(this.state)
    const username1 = this.state.currentUser
    const options = {
      username: username1
    }
    axios.post(`http://localhost:8080/api/session/new`, options)
      .then(Response => {
        localStorage.setItem('EmpDirUserSessionID', Response.data.session_id);
      })
      .then(
        ()=>{this.tokenCheck()}
      )
  }




  logOutUser = () => {
    localStorage.clear('EmpDirUserSessionID');
    this.setState({
      userLoggedIn: false
    })
  }




  render() {

    /////////////////////////////////////////admin mode///////////////////////////////////////////////////
    if (this.state.userLoggedIn && this.state.role == '1') {
      return (
        <div style={{
          width: 'auto',
          height: '100%'
        }}>
          <nav className="navbar navbar-expand navbar-dark bg-dark">
            <a href="/empdir" className="navbar-brand">Home</a>
            <div className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link to={"/empdir"} className="nav-link">List All</Link>
              </li>
              <li className="nav-item">
                <Link to={"/add"} className="nav-link">Add New</Link>
              </li>
              <li className="nav-item">
                <Link to={"/search"} className="nav-link">Live Search</Link>
              </li>
            </div>
            <div className="navbar-nav float-right ">
              <li className="nav-item" style={{ color: 'white', marginTop: '5px' }}>
                {this.state.currentUser}
              </li>
              <li className="nav-item">
                <Dropdown>
                  <Dropdown.Toggle id="gear-dropdown">
                    <Gear />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item>
                      <Link to={"/admin"} className="nav-link" style={{ color: 'black' }}>Admin</Link>
                    </Dropdown.Item>
                    <Dropdown.Item>
                      <Link to={"/logout"} onClick={this.logOutUser} className="nav-link" style={{ color: 'black' }}>LogOut</Link>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </li>
            </div>
          </nav>
          <div
            id="toast-div"
            aria-live="polite"
            aria-atomic="true"
            style={{
              position: 'relative',
              minHeight: '5%'
            }}>
            <Toast
              style={{ position: 'absolute', top: 0, right: 25 }}
              show={this.state.toastShow}
              delay={this.state.toastTimeout}
              autohide
              onClose={this.hideToast}
              animation={true}>
              <Toast.Header>
                <strong className="mr-auto">HCI Employee Directory</strong>
              </Toast.Header>
              <Toast.Body>
                {this.state.toastValue}
              </Toast.Body>
            </Toast>
          </div>
          <div className="parent-div">

            <Switch>
              <Route exact path={["/", "/empdir"]} render={(props) => <ListEmployees {...props} {...this.state} />} />
              <Route path="/admin"
                render={
                  (props) => (<AdminSettings {...this.state} />
                  )} />

              <Route path="/add"
                render={
                  (props) => (<AddEmp {...props} {...this.state} addEmployee_onSuccess={this.addEmployee_onSuccess} />
                  )} />

              <Route path="/empdir/:id"
                render={
                  (props) => (<EditEmp {...props} editEmployee_onSuccess={this.editEmployee_onSuccess} />
                  )} />
              <Route path="/search" component={LiveSearch} />

              <Route exact path="/logout" render={() => (<Redirect to="/" />)} />

            </Switch>
          </div>
        </div>  //ending div
      );
    }


    ///////////////////////////////////////standard mode//////////////////////////////////////////////////
    else if (this.state.userLoggedIn && this.state.role == '3') {
      return (
        <div style={{
          width: 'auto',
          height: '100%'
        }}>
          <nav className="navbar navbar-expand navbar-dark bg-dark">
            <a href="/empdir" className="navbar-brand">Home</a>
            <div className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link to={"/empdir"} className="nav-link">List All</Link>
              </li>
              <li className="nav-item">
                <Link to={"/add"} className="nav-link">Add New</Link>
              </li>
            </div>
            <div className="navbar-nav float-right">
              <li className="nav-item" style={{ color: 'white', marginTop: '5px' }}>
                {this.state.currentUser}
              </li>
              <li className="nav-item">
                <Dropdown>
                  <Dropdown.Toggle id="gear-dropdown">
                    <Gear />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item>
                      <Link to={"/logout"} onClick={this.logOutUser} className="nav-link" style={{ color: 'black' }}>LogOut</Link>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </li>
            </div>
          </nav>
          <div
            id="toast-div"
            aria-live="polite"
            aria-atomic="true"
            style={{
              position: 'relative',
              minHeight: '5%'
            }}>
            <Toast
              style={{ position: 'absolute', top: 0, right: 25 }}
              show={this.state.toastShow}
              delay={this.state.toastTimeout}
              autohide
              onClose={this.hideToast}
              animation={true}>
              <Toast.Header>
                <strong className="mr-auto">HCI Employee Directory</strong>
              </Toast.Header>
              <Toast.Body>
                {this.state.toastValue}
              </Toast.Body>
            </Toast>
          </div>
          <div className="parent-div">

            <Switch>
            <Route exact path={["/", "/empdir"]} render={(props) => <ListEmployees {...props} {...this.state} />} />
              <Route exact path="/admin" component={AdminSettings} />

              <Route path="/add"
                render={
                  (props) => (<AddEmp {...props} {...this.state} addEmployee_onSuccess={this.addEmployee_onSuccess} />
                  )} />

              <Route path="/empdir/:id"
                render={
                  (props) => (<EditEmp {...props} editEmployee_onSuccess={this.editEmployee_onSuccess} />
                  )} />

              <Route exact path="/logout" render={() => (<Redirect to="/" />)} />
            </Switch>
          </div>
        </div>  //ending div
      );
    }
    else {
      return (
        <div className="login-div-main" >
          <LoginScreen successfulLogin={this.successfulLogin} />
        </div>
      )
    }
  }

}/// Closing Bracket for App Component *********************************************


export default withRouter(App);




