import './App.css';
import React, {Component, useCallback} from 'react';

import {Switch, Route, Link, Redirect, BrowserRouter} from 'react-router-dom';
import {withRouter} from 'react-router-dom';


import ListEmployees from "./components/listEmployees.component";
import AddEmployee from './components/addEmployee.component';
import EditEmp from './components/editEmployee.component';
import AdminSettings from './components/adminSettings.component';


import 'bootstrap/dist/css/bootstrap.min.css';
import Gear from 'react-bootstrap-icons/dist/icons/gear'
import Toast from 'react-bootstrap/Toast';
import Dropdown from 'react-bootstrap/Dropdown';





class App extends Component {
  constructor(props){
    super(props)
    this.state={
      toastShow: false,
      toastTimeout: 3000,
      renderApp: 0
    }

    this.onChildClicked = this.onChildClicked.bind(this);
    this.successToast = this.successToast.bind(this);
    this.onChildClick1 = this.onChildClick1.bind(this);
    this.editEmployee_onSuccess = this.editEmployee_onSuccess.bind(this);

  }

  componentDidMount(){
    console.log("App Did Mount");
    this.render(<ListEmployees/>)
      
  }


  nextPath(path) {
    this.props.history.push(path)
  }


  successToast(){
    console.log('successToast Activated')
    this.setState({
      toastShow: true,
    });
  }

  editEmployee_onSuccess = () => {
    console.log("App Function Triggered")
  };


  onChildClicked() {
    console.log("attempting to showToast:True")
    this.successToast()
    this.nextPath('/empdir')
  };

  onChildClick1() {
    console.log('onChildClick1 activated from parent');
    this.successToast()
  }

  hideToast = () =>{
    setTimeout(() => {
      this.setState({toastShow: false})
    }, 1000);
    
  };


  

  render() {
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
          <li className="nav-item">
              <Dropdown>
                <Dropdown.Toggle id="gear-dropdown">
                  <Gear/>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item>
                    <Link to={"/admin"} className="nav-link" style={{color: 'black'}}>Admin</Link>
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
                style={{position: 'absolute', top: 0, right:25}}
                show={this.state.toastShow}
                delay={this.state.toastTimeout}
                autohide 
                onClose={this.hideToast}
                animation={true}>
                <Toast.Header>
                  <strong className="mr-auto">HCI Employee Directory</strong>
                </Toast.Header>
                <Toast.Body>
                  Save Successful!
                </Toast.Body>
              </Toast>
          </div>  
        <div className="parent-div">
          
        <Switch>
          <Route exact path={["/","/empdir"]} render={(props) => <ListEmployees {...props}/>}/>
          <Route exact path="/add" component={AddEmployee}/>
          <Route exact path="/admin" component={AdminSettings}/>

          <Route path="/empdir/:id" 
            render={
              (props) => (<EditEmp {...props} editEmployee_onSuccess={this.editEmployee_onSuccess} />
              )}/>
        </Switch>
        </div>
      </div>  //ending div
  );
}
}

export default withRouter(App);




