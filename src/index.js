import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import * as serviceWorker from "./serviceWorker";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter
} from "react-router-dom";
import Login from "./components/Auth/Login.component";
import Register from "./components/Auth/Register.component";
import firebase from "./firebase/firebase";

import "semantic-ui-css/semantic.min.css";
import Spinner from "./components/spinner/spinner.component";

import { createStore } from "redux";
import { Provider, connect } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./redux/reducers";

//MAYBE ERROR with users login/logout route here..
import { setUser, clearUser } from "./redux/actions/index";

const store = createStore(rootReducer, composeWithDevTools());

//previously it was functional component
class Root extends React.Component {
  //CREATING A LISTENER: listens for user's login/logout
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        //this will show user if there is user..
        this.props.setUser(user);
        //if there is user,we are going push to the homepage
        this.props.history.push("/");
      } else {
        this.props.history.push("/login");
        this.props.clearUser();
      }
    });
  }

  render() {
    //if its still loading and its true,then we will show the laoding spinner..
    return this.props.isLoading ? (
      <Spinner />
    ) : (
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
      </Switch>
    );
  }
}

const mapStateToProps = state => ({
  isLoading: state.user.isLoading
});

const RootWithAuth = withRouter(
  connect(mapStateToProps, { setUser, clearUser })(Root)
);

//initially we render App,but we have changed our root app to Root
ReactDOM.render(
  <Provider store={store}>
    <Router>
      <RootWithAuth />
    </Router>
  </Provider>,

  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
