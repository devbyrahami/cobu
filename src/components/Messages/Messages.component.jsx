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
    user: this.props.currentUser,
    numUniqueUsers: "",
    searchTerm: "",
    searchLoading: false,
    searchResults: []
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
      this.countUniqueUsers(loadedMessages);
    });
  };

  //filtering all the messages user's searching for..
  handleSearchMessages = () => {
    //we retreiving all the users messages
    const channelMessages = [...this.state.messages];
    const regex = new RegExp(this.state.searchTerm, "gi");
    const searchResults = channelMessages.reduce((acc, message) => {
      //we check if it matches regex,if so then we will push searched message to the accumulator
      if (
        (message.content && message.content.match(regex)) ||
        message.user.name.match(regex)
      ) {
        acc.push(message);
      }
      return acc;
    }, []);
    //then we placed it our searchResults array of messages,user's searched for []
    this.setState({ searchResults });

    //showing the loading when user's search after 1secs
    setTimeout(() => {
      this.setState({ searchLoading: false });
    }, 1000);
  };

  //retrieve the user's search input and show loading while waiting for the input searched..
  handleSearchChange = e => {
    this.setState(
      { searchTerm: e.target.value, searchLoading: true },

      () => this.handleSearchMessages()
    );
  };

  countUniqueUsers = messages => {
    const uniqueUsers = messages.reduce((acc, message) => {
      if (!acc.includes(message.user.name)) {
        acc.push(message.user.name);
      }
      return acc;
    }, []);

    // check if user is more than 1 or === 1
    const plural = uniqueUsers.length > 1 || uniqueUsers.length === 0;

    //if user is more than 1,we add 's' at the back,else only show 'user'
    const numUniqueUsers = `${uniqueUsers.length} user${plural ? "s" : ""}`;
    this.setState({ numUniqueUsers });
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
    const {
      messagesRef,
      channel,
      user,
      messages,
      numUniqueUsers,
      searchTerm,
      searchResults,
      searchLoading
    } = this.state;

    return (
      <React.Fragment>
        <MessagesHeader
          channelName={this.displayChannelName(channel)}
          numUniqueUsers={numUniqueUsers}
          handleSearchChange={this.handleSearchChange}
          searchLoading={searchLoading}
        />
        <Segment>
          <Comment.Group className="messages">
            {searchTerm
              ? this.displayMessages(searchResults)
              : this.displayMessages(messages)}
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
