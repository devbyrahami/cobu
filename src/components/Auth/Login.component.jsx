import React from "react";
import firebase from "../../firebase/firebase";

import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon
} from "semantic-ui-react";

import { Link } from "react-router-dom";

class Login extends React.Component {
  state = {
    email: "",
    password: "",
    errors: [],
    loading: false //will be set to true when actually processing a user
  };

  /*
  show where the error occured within the form
  inputname= which field is trigeering the error
  */
  handleInputError = (errors, inputName) => {
    return errors.some(error => error.message.toLowerCase().includes(inputName))
      ? "error"
      : "";
  };

  /*
  this will dynamically target where user decided to key in their value..
  [e.target.name] = dynamically selecting which state to make change
  e.target.value = dynamically target to receive input from user according to targeted name
  */
  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  displayErrors = errors =>
    //checking every field and throw an error if conditions arent met
    errors.map((error, i) => <p key={i}>{error.message}</p>);

  handleSubmit = e => {
    e.preventDefault();

    if (this.isFormValid(this.state)) {
      this.setState({ errors: [], loading: true });
      firebase
        .auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(signedInUser => {
          console.log(signedInUser);
        })
        .catch(err => {
          console.error(err);
          this.setState({
            errors: this.state.errors.concat(err),
            loading: false
          });
        });
    }
  };

  isFormValid = ({ email, password }) => email && password;

  render() {
    const { email, password, errors, loading } = this.state;

    //we added value={email},to clear the input
    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header
            style={{ color: "white" }}
            as="h1"
            icon
            color="white"
            textAlign="center"
            className="icon-name"
          >
            <Icon name="users" color="standard" />
            COBU
          </Header>
          <p style={{ color: "white" }}>
            <span style={{ fontSize: 20 }}>Login to Cobu </span> <br />
          </p>
          <h5 style={{ color: "white" }}>"Community for Software Engineers"</h5>

          <Form size="large" onSubmit={this.handleSubmit}>
            <Segment>
              <Form.Input
                fluid
                name="email"
                icon="mail"
                iconPosition="left"
                placeholder="Email"
                onChange={this.handleChange}
                value={email}
                type="email"
                //styling our errors accordingly,and show where the errors come from
                className={this.handleInputError(errors, "email")}
              />
              <Form.Input
                fluid
                name="password"
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                onChange={this.handleChange}
                value={password}
                type="password"
                className={this.handleInputError(errors, "password")}
              />

              <Button
                color="green"
                disabled={loading}
                className={loading ? "loading" : ""}
                fluid
                size="large"
              >
                Submit
              </Button>
            </Segment>
          </Form>

          {errors.length > 0 && (
            <Message error>
              <h3>Error</h3>
              {this.displayErrors(errors)}
            </Message>
          )}
          <Message>
            Don't have an account? <Link to="/register">Register here</Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Login;
