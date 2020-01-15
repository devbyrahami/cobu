import React from "react";
import { Button, Segment, Input } from "semantic-ui-react";
import firebase from "../../firebase/firebase";

import FileModal from "./File-Modal.component";
import ProgressBar from "./Progress-Bar.component";
import uuidv4 from "uuid/v4";

class MessageForm extends React.Component {
  state = {
    storageRef: firebase.storage().ref(),
    uploadState: "",
    uploadTask: null,
    typingRef: firebase.database().ref("typing"),
    percentUploaded: 0,
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

  createMessage = (fileUrl = null) => {
    const message = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: this.state.user.uid,
        name: this.state.user.displayName,
        avatar: this.state.user.photoURL
      }
    };
    if (fileUrl !== null) {
      message["image"] = fileUrl;
    } else {
      message["content"] = this.state.message;
    }
    return message;
  };

  sendMessage = () => {
    const { getMessagesRef } = this.props;
    const { message, channel, user, typingRef } = this.state;
    //we want to verify if there is a message first,only then we submit to firebase onclick
    if (message) {
      this.setState({ loading: true }); //we show loading ui first

      getMessagesRef()
        .child(channel.id) // we need the id to specify which CHANNEL FIRST
        .push()
        .set(this.createMessage())
        //clear field and handle errors..
        .then(() => {
          this.setState({ loading: false, message: "", errors: [] });
          typingRef
            .child(channel.id) //saving the user id
            .child(user.uid)
            .remove();
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

  //determine  which path will the media files goes to PUBLIC OR PRIVATE CHANNEl
  getPath = () => {
    if (this.props.isPrivateChannel) {
      return `chat/private-${this.state.channel.id}`;
    } else {
      return "chat/public";
    }
  };

  uploadFile = (file, metadata) => {
    //this determines which channel to be uploaded by the user..
    const pathToUpload = this.state.channel.id;
    const ref = this.props.getMessagesRef();
    //to create a random strings for the url
    const filePath = `${this.getPath()}/${uuidv4()}.jpg`;

    this.setState(
      {
        uploadState: "Uploading",

        uploadTask: this.state.storageRef.child(filePath).put(file, metadata)
      },

      () => {
        this.state.uploadTask.on(
          "state_changed",
          snap => {
            const percentUploaded = Math.round(
              (snap.bytesTransferred / snap.totalBytes) * 100
            );

            this.setState({ percentUploaded });
          },
          err => {
            console.error(err);
            this.setState({
              errors: this.state.errors.concat(err),
              uploadState: "error",
              uploadTask: null
            });
          },
          () => {
            this.state.uploadTask.snapshot.ref
              .getDownloadURL()
              .then(downloadUrl => {
                this.sendFileMessage(downloadUrl, ref, pathToUpload);
              })
              .catch(err => {
                console.error(err);
                this.setState({
                  errors: this.state.errors.concat(err),
                  uploadState: "error",
                  uploadTask: null
                });
              });
          }
        );
      }
    );
  };

  sendFileMessage = (fileUrl, ref, pathToUpload) => {
    ref
      .child(pathToUpload)
      .push()
      .set(this.createMessage(fileUrl))
      .then(() => {
        this.setState({ uploadState: "done" });
      })
      .catch(err => {
        console.error(err);
        this.setState({ errors: this.state.errors.concat(err) });
      });
  };

  handleKeyDown = () => {
    const { message, typingRef, channel, user } = this.state;

    //checking if there is message,which we stores all users messagges in state..
    if (message) {
      typingRef
        .child(channel.id) //saving the user id
        .child(user.uid)
        .set(user.displayName);
    } else {
      typingRef
        .child(channel.id) //saving the user id
        .child(user.uid)
        .remove();
    }
  };

  render() {
    const {
      errors,
      message,
      loading,
      modal,
      uploadState,
      percentUploaded
    } = this.state;
    return (
      <Segment className="message__form">
        <Input
          onKeyDown={this.handleKeyDown}
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
        </Button.Group>
        <FileModal
          modal={modal}
          closeModal={this.closeModal}
          uploadFile={this.uploadFile}
        />

        <ProgressBar
          uploadState={uploadState}
          percentUploaded={percentUploaded}
        />
      </Segment>
    );
  }
}

export default MessageForm;
