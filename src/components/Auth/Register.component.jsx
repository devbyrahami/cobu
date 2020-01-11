import React from "react";
import firebase from "../../firebase/firebase";
import md5 from "md5";

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

class Register extends React.Component {
  state = {
    username: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    errors: [],
    loading: false, //will be set to true when actually processing a user
    usersRef: firebase.database().ref("users")
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

  isFormValid = () => {
    //errors using Array,so we can have access of .length
    let errors = [];
    let error;

    if (this.isFormEmpty(this.state)) {
      //throw error
      error = { message: "Fill in all fields" };
      this.setState({ errors: errors.concat(error) });
      //indicating we should NOT handle submit
      return false;
    } else if (!this.isPasswordValid(this.state)) {
      //throw error
      error = { message: "Password is invalid" };
      this.setState({ errors: errors.concat(error) });
      //indicating we should NOT handle submit
      return false;
    } else {
      //if the form is not empty and password is valid,then we allow to submit the form
      return true;
    }
  };

  //to check is the passwords conditions are met
  isPasswordValid = ({ password, passwordConfirmation }) => {
    if (password.length < 6 || passwordConfirmation < 6) {
      //indicating the password is NOT valid..
      return false;
    } else if (password !== passwordConfirmation) {
      //indicating the password doesnt match
      return false;
    } else {
      //if conditions are met then password is valid
      return true;
    }
  };

  displayErrors = errors =>
    //checking every field and throw an error if conditions arent met
    errors.map((error, i) => <p key={i}>{error.message}</p>);

  /*
  to check the fields are 0 or more than 0
  true for form === empty
  */
  isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
    //checking if the length of each props below are === 0
    return (
      !username.length ||
      !email.length ||
      !password.length ||
      !passwordConfirmation.length
    );
  };

  handleSubmit = e => {
    e.preventDefault();

    /*
    if the form is completed with user's details then only submit to our backend
    then is True ,then function below will executed
    */

    if (this.isFormValid()) {
      this.setState({ errors: [], loading: true });

      //add all the user's login info to firebase auth
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(createdUser => {
          console.log(createdUser);

          //generate image avatar for users/-we can get this from firebase documentation
          createdUser.user
            .updateProfile({
              displayName: this.state.username,
              photoURL: `http://gravatar.com/avatar/${md5(
                createdUser.user.email
              )}?d=identicon`
            })

            // .then(() => {
            //   this.setState({ loading: false });
            // })

            .then(() => {
              this.saveUser(createdUser).then(() => {
                console.log("user saved");
              });
            })

            .catch(err => {
              console.error(err);
              this.setState({
                errors: this.state.errors.concat(err),
                loading: false
              });
            });
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

  //saving user to our db firestore..
  saveUser = createdUser => {
    return this.state.usersRef.child(createdUser.user.uid).set({
      name: createdUser.user.displayName,
      avatar: createdUser.user.photoURL
    });
  };

  render() {
    const {
      username,
      email,
      password,
      passwordConfirmation,
      errors,
      loading
    } = this.state;

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
            <span style={{ fontSize: 20 }}>Create an account </span> <br />
          </p>
          <h5 style={{ color: "white" }}>"Community for Software Engineers"</h5>

          <Form size="large" onSubmit={this.handleSubmit}>
            <Segment>
              <Form.Input
                fluid
                name="username"
                icon="user "
                iconPosition="left"
                placeholder="Username"
                onChange={this.handleChange}
                value={username}
                type="text"
              />
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
              <Form.Input
                fluid
                name="passwordConfirmation"
                icon="repeat"
                iconPosition="left"
                placeholder="Password Confirmation"
                onChange={this.handleChange}
                value={passwordConfirmation}
                type="password"
                className={this.handleInputError(
                  errors,
                  "passwordConfirmation"
                )}
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
            Already a user? <Link to="/login">Login</Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Register;
