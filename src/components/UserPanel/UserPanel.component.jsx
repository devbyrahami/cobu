import React from "react";
import { Grid, Header, Icon, Dropdown, Image } from "semantic-ui-react";

//this is for signout function
import firebase from "../../firebase/firebase";

class UserPanel extends React.Component {
  state = {
    user: this.props.currentUser //retrieve the displayName on the global state
  };

  //when user click ,below provide few options for the users..
  dropdownOptions = () => [
    {
      key: "user",
      text: (
        <span>
          Signed in as <strong>{this.state.user.displayName}</strong>
        </span>
      ),
      disabled: true
    },
    {
      key: "avatar",
      text: <span>Change Image Profile</span>
    },
    {
      key: "signout",
      //when user click this button
      text: <span onClick={this.handleSignOut}>Sign Out</span>
    }
  ];

  //handle user sign out with firebase
  handleSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => console.log("signed out"));
  };

  render() {
    const { user } = this.state;
    return (
      <Grid style={{ background: "#2b32b" }}>
        <Grid.Column>
          <Grid.Row style={{ padding: "1.2em", margin: 0 }}>
            <Header
              inverted
              floated="left"
              as="h2"
              style={{ color: "white", letterSpacing: 2 }}
            >
              <Icon name="users" />
              COBU
            </Header>
            {/*USER DROPDOWN-semantic ui*/}
            <Header style={{ padding: "0.25em" }} as="h4" inverted>
              <Dropdown
                trigger={
                  <span>
                    <Image src={user.photoURL} spaced="right" avatar />
                    {user.displayName}
                  </span>
                }
                options={this.dropdownOptions()}
              />
            </Header>
          </Grid.Row>
        </Grid.Column>
      </Grid>
    );
  }
}

export default UserPanel;
