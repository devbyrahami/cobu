import React from "react";
import { Segment, Comment } from "semantic-ui-react";
import MessagesHeader from "./Messages-Header.component";
import MessageForm from "./Message-Form.component";
import firebase from "../../firebase/firebase";
import Message from "./Message.component";

class Messages extends React.Component {
  state = {
    //this would be add as the name of the db inside firebase
    messagesRef: firebase.database().ref("messages"),
    messages: [],
    messagesLoading: true,
    channel: this.props.currentChannel,
    user: this.props.currentUser
  };

  componentDidMount() {
    const { channel, user } = this.state;

    //if there is user and channel then we want to add a listener
    if (channel && user) {
      this.addListeners(channel.id);
    }
  }

  addListeners = channelId => {
    this.addMessageListener(channelId);
  };

  addMessageListener = channelId => {
    let loadedMessages = [];
    this.state.messagesRef.child(channelId).on("child_added", snap => {
      loadedMessages.push(snap.val());
      // console.log(loadedMessages);
      this.setState({
        messages: loadedMessages,
        messagesLoading: false
      });
    });
  };

  displayMessages = messages =>
    messages.length > 0 &&
    messages.map(message => (
      <Message
        key={message.timestamp}
        message={message}
        user={this.state.user}
      />
    ));

  //dynamically show channel's name
  displayChannelName = channel => (channel ? `#${channel.name}` : "");

  render() {
    const { messagesRef, channel, user, messages } = this.state;

    return (
      <React.Fragment>
        <MessagesHeader channelName={this.displayChannelName(channel)} />
        <Segment>
          <Comment.Group className="messages">
            {this.displayMessages(messages)}
          </Comment.Group>
        </Segment>

        {/*Need to fix this later,there might better way to pass props */}
        <MessageForm
          messagesRef={messagesRef}
          currentChannel={channel}
          currentUser={user}
        />
      </React.Fragment>
    );
  }
}

export default Messages;
