import React from "react";
import { Menu, Icon, Modal, Form, Input, Button } from "semantic-ui-react";
import firebase from "../../firebase/firebase";
import { connect } from "react-redux";
import { setCurrentChannel } from "../../redux/actions/index";

class Channels extends React.Component {
  state = {
    activeChannel: "",
    user: this.props.currentUser,
    channels: [],
    channelName: "",
    channelDetails: "",
    //it goes to firebase => database section => it creates 'channels' within the db
    channelsRef: firebase.database().ref("channels"),
    modal: false,
    firstLoad: true //set first channel by default
  };

  componentDidMount() {
    this.addListeners();
  }

  //listens for new channels added..
  addListeners = () => {
    let loadedChannels = [];
    this.state.channelsRef.on("child_added", snap => {
      loadedChannels.push(snap.val());
      this.setState({ channels: loadedChannels }, () => this.setFirstChannel());
    });
  };

  setFirstChannel = () => {
    //if we check there is channel,then we want to set the first channel as default
    //below we are grabbing the FIRST channel
    const firstChannel = this.state.channels[0];
    if (this.state.firstLoad && this.state.channels.length > 0) {
      this.props.setCurrentChannel(firstChannel);
      this.setActiveChannel(firstChannel);
    }
    //if there is 0 Channels
    this.setState({ firstLoad: false });
  };

  addChannel = () => {
    const { channelsRef, channelName, channelDetails, user } = this.state;
    const key = channelsRef.push().key; //this will provide UID for every channels added

    const newChannel = {
      id: key,
      name: channelName,
      details: channelDetails,
      createdBy: {
        name: user.displayName, //we are retreiving displayName from the currentUser's props,
        avatar: user.photoURL
      }
    };

    //when user add the channel,it will clear the field and close the Modal..
    channelsRef
      .child(key)
      .update(newChannel)
      .then(() => {
        this.setState({ channelName: "", channelDetails: "" });
        this.closeModal();
        console.log("channel added");
      })
      .catch(err => {
        console.log(err);
      });
  };

  //handle submit and check form submission true or false
  handleSubmit = e => {
    e.preventDefault();
    //if there is channelName && channelDetails then..
    if (this.isFormValid(this.state)) {
      this.addChannel();
    }
  };

  //it must include channelname and channel details,which we passed in the conditions above..
  isFormValid = ({ channelName, channelDetails }) =>
    channelName && channelDetails;

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  //channel = each element of channel user will be clicking..
  changeChannel = channel => {
    this.setActiveChannel(channel);
    this.props.setCurrentChannel(channel);
  };

  setActiveChannel = channel => {
    this.setState({ activeChannel: channel.id });
  };

  //we are taking all the channels we have in state and display them
  displayChannels = channels =>
    channels.length > 0 &&
    channels.map(channel => (
      <Menu.Item
        key={channel.id}
        onClick={() => this.changeChannel(channel)}
        name={channel.name}
        style={{ opacity: 0.7 }}
        //this will highlight the selected channel,thru id matching
        active={channel.id === this.state.activeChannel}
      >
        #{channel.name}
      </Menu.Item>
    ));

  openModal = () => this.setState({ modal: true });
  closeModal = () => this.setState({ modal: false });

  render() {
    const { channels, modal } = this.state;
    return (
      //Menu from main component,and below is the new child component of Menu
      <React.Fragment>
        <Menu.Menu style={{ paddingBottom: "2em" }}>
          <Menu.Item>
            <span>
              <Icon name="exchange" />
              CHANNELS
            </span>{" "}
            ({channels.length}) <Icon name="add" onClick={this.openModal} />
          </Menu.Item>
          {this.displayChannels(channels)}
        </Menu.Menu>

        <Modal basic open={modal} onClose={this.closeModal}>
          <Modal.Header>Add a Channel</Modal.Header>
          <Modal.Content>
            <Form onSubmit={this.handleSubmit}>
              <Form.Field>
                <Input
                  fluid
                  label="Name of Channel"
                  name="channelName"
                  onChange={this.handleChange}
                ></Input>
              </Form.Field>

              <Form.Field>
                <Input
                  fluid
                  label="About the Channel"
                  name="channelDetails"
                  onChange={this.handleChange}
                ></Input>
              </Form.Field>
            </Form>
          </Modal.Content>

          <Modal.Actions>
            <Button color="green" inverted onClick={this.handleSubmit}>
              <Icon name="checkmark" />
              Add
            </Button>

            <Button color="red" inverted onClick={this.closeModal}>
              <Icon name="remove" /> Remove
            </Button>
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    );
  }
}

//we destructure from mapDispatchToProps
export default connect(null, { setCurrentChannel })(Channels);
