import React from "react";
import { Button, Segment, Input } from "semantic-ui-react";
import firebase from "../../firebase/firebase";

import FileModal from "./File-Modal.component";

class MessageForm extends React.Component {
  state = {
    message: "",
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    loading: false,
    errors: [],
    modal: false
  };

  //this for media upload open and closing
  openModal = () => this.setState({ modal: true });
  closeModal = () => this.setState({ modal: false });

  //onchange,this will retrive the value of the user's text
  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  createMessage = () => {
    const message = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: this.state.user.uid,
        name: this.state.user.displayName,
        avatar: this.state.user.photoURL
      },
      content: this.state.message
    };
    return message;
  };

  sendMessage = () => {
    const { messagesRef } = this.props;
    const { message, channel } = this.state;
    //we want to verify if there is a message first,only then we submit to firebase onclick
    if (message) {
      this.setState({ loading: true }); //we show loading ui first

      messagesRef
        .child(channel.id) // we need the id to specify which CHANNEL FIRST
        .push()
        .set(this.createMessage())
        //clear field and handle errors..
        .then(() => {
          this.setState({ loading: false, message: "", errors: [] });
        })
        .catch(err => {
          console.error(err);
          this.setState({
            loading: false,
            errors: this.state.errors.concat(err)
          });
        });
    } else {
      this.setState({
        errors: this.state.errors.concat({ message: "Add a message" })
      });
    }
  };

  uploadFile = (file, metadata) => {};

  render() {
    const { errors, message, loading, modal } = this.state;
    return (
      <Segment className="message__form">
        <Input
          fluid
          name="message"
          onChange={this.handleChange}
          //we added value here as message which equals to '' ,to clear the field
          value={message}
          style={{ marginBottom: "0.7em" }}
          label={<Button icon={"add"} />}
          // label={<Button color="blue" icon={"send"} />}
          labelPosition="left"
          placeholder="Write your message"
          //if there is an error with the name of message,then we show error,else ''
          className={
            errors.some(error => error.message.includes("message"))
              ? "error"
              : ""
          }
        />

        {/*below what makes the button icon fill the entire form*/}
        <Button.Group icon widths="2">
          <Button
            onClick={this.sendMessage}
            //it will disabled button when its loading to send a message..,so no more new messages until its clear
            disabled={loading}
            color="blue"
            content="Add reply"
            labelPosition="left"
            icon="edit"
          />
          <Button
            onClick={this.openModal}
            color="green"
            content="Upload Media"
            labelPosition="right"
            icon="cloud upload"
          />
          <FileModal
            modal={modal}
            closeModal={this.closeModal}
            uploadFile={this.uploadFile}
          />
        </Button.Group>
      </Segment>
    );
  }
}

export default MessageForm;
