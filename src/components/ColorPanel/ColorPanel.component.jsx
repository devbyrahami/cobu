import React from "react";
import {
  Sidebar,
  Menu,
  Divider,
  Button,
  Modal,
  Icon,
  Label,
  Segment
} from "semantic-ui-react";

import { TwitterPicker } from "react-color";

import firebase from "../../firebase/firebase";
import { connect } from "react-redux";
import { setColors } from "../../redux/actions/index";

//---SIDEBARICON
// import SideBarIcon from "../../components/UserPanel/Sidebar-Icon.component";
// import SidePanel from "../SidePanel/SidePanel.component";

class ColorPanel extends React.Component {
  state = {
    modal: false,
    primary: "",
    secondary: "",
    user: this.props.currentUser,
    usersRef: firebase.database().ref("users"),
    userColors: [] //all selected primary and secondary colors will be placed here..
  };

  //display the color change in the ui
  componentDidMount() {
    //set up the listener when user select and colors
    this.addListener(this.state.user.uid);
  }

  componentWillUnmount() {
    this.removeListener();
  }

  //removing listener when the component unmount..
  removeListener = () => {
    this.state.usersRef.child(`${this.state.user.uid}/colors`).off();
  };

  addListener = userId => {
    let userColors = [];
    this.state.usersRef

      .child(`${userId}/colors`)
      //checking in whether in the db there is colors added
      .on("child_added", snap => {
        //putting the colors at the front of the array
        userColors.unshift(snap.val());
        //it will update the state
        this.setState({ userColors });
      });
  };

  openModal = () => this.setState({ modal: true });
  closeModal = () => this.setState({ modal: false });

  //changing color fuction when user change it
  handleChangePrimary = color => this.setState({ primary: color.hex });
  handleChangeSecondary = color => this.setState({ secondary: color.hex });

  handleSaveColors = () => {
    //we want to validate if there is color selected in state before save to db
    if (this.state.primary && this.state.secondary) {
      this.saveColors(this.state.primary, this.state.secondary);
    }
  };

  saveColors = (primary, secondary) => {
    this.state.usersRef
      .child(`${this.state.user.uid}/colors`)
      .push()
      //pushing primary and secondary colors into db
      .update({
        primary,
        secondary
      })
      .then(() => {
        console.log("colors added");

        //once color added it will close the whole tab of colors
        this.closeModal();
      })
      .catch(err => {
        console.error(err);
      });
  };

  displayUserColors = colors =>
    colors.length > 0 &&
    colors.map((color, i) => (
      <React.Fragment key={i}>
        <Divider />
        <div
          className="color__container"
          onClick={() => this.props.setColors(color.primary, color.secondary)}
        >
          <div className="color__square" style={{ background: color.primary }}>
            <div
              className="color__overlay"
              style={{ background: color.secondary }}
            ></div>
          </div>
        </div>
      </React.Fragment>
    ));

  // <SideBarIcon />
  // <Divider />
  render() {
    const { modal, primary, secondary, userColors } = this.state;
    // const { hidden } = this.props;
    return (
      <Sidebar as={Menu} inverted vertical visible width="very thin">
        <Divider />

        <Button icon="add" size="small" color="blue" onClick={this.openModal} />
        {this.displayUserColors(userColors)}
        <Modal basic open={modal} onClose={this.closeModal}>
          <Modal.Header>Select App Colors</Modal.Header>
          <Modal.Content>
            <Segment inverted>
              <Label content="Primary Color" style={{ margin: "20px 0px" }} />
              <TwitterPicker
                color={primary}
                onChange={this.handleChangePrimary}
              />
            </Segment>
            <Segment inverted>
              <Label content="Secondary Color" style={{ margin: "20px 0px" }} />
              <TwitterPicker
                color={secondary}
                onChange={this.handleChangeSecondary}
              />
            </Segment>
          </Modal.Content>
          <Modal.Actions>
            <Button color="green" inverted onClick={this.handleSaveColors}>
              <Icon name="checkmark " />
              Save colors
            </Button>
            <Button color="red" inverted onClick={this.closeModal}>
              <Icon name="remove" />
              Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </Sidebar>
    );
  }
}

/*----TOGGLESIDEPANEL---
const mapStateToProps = state => ({
  hidden: state.toggle.hidden
});



   {hidden ? null : <SidePanel />}
*/

export default connect(null, { setColors })(ColorPanel);
