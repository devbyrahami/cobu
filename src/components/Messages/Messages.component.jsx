import React from "react";
import { Segment, Comment } from "semantic-ui-react";
import MessagesHeader from "./Messages-Header.component";
import MessageForm from "./Message-Form.component";
import firebase from "../../firebase/firebase";
import Message from "./Message.component";

import { connect } from "react-redux";
import { setUserPosts } from "../../redux/actions/index";

import Typing from "./Typing.component";

class Messages extends React.Component {
  state = {
    //this would be add as the name of the db inside firebase
    privateMessagesRef: firebase.database().ref("privateMessages"),
    privateChannel: this.props.isPrivateChannel,
    messagesRef: firebase.database().ref("messages"),
    messages: [],
    messagesLoading: true,
    isChannelStarred: false,
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    usersRef: firebase.database().ref("users"),
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
      this.addUserStarsListener(channel.id, user.uid);
    }
  }

  addListeners = channelId => {
    this.addMessageListener(channelId);
  };

  addMessageListener = channelId => {
    let loadedMessages = [];
    const ref = this.getMessagesRef();
    ref.child(channelId).on("child_added", snap => {
      loadedMessages.push(snap.val());
      // console.log(loadedMessages);
      this.setState({
        messages: loadedMessages,
        messagesLoading: false
      });
      this.countUniqueUsers(loadedMessages);
      this.countUserPosts(loadedMessages);
    });
  };

  countUserPosts = messages => {
    let userPosts = messages.reduce((acc, message) => {
      if (message.user.name in acc) {
        acc[message.user.name].count += 1;
      } else {
        acc[message.user.name] = {
          avatar: message.user.avatar,
          count: 1
        };
      }
      return acc;
    }, {});
    this.props.setUserPosts(userPosts);
  };

  addUserStarsListener = (channelId, userId) => {
    this.state.usersRef
      .child(userId)
      .child("starred")
      .once("value")
      .then(data => {
        if (data.val() !== null) {
          const channelIds = Object.keys(data.val());
          const prevStarred = channelIds.includes(channelId);
          this.setState({ isChannelStarred: prevStarred });
        }
      });
  };

  getMessagesRef = () => {
    const { messagesRef, privateMessagesRef, privateChannel } = this.state;

    //if user in a private channel then we'll use the privateref,else in public it will use the public ref to database.
    return privateChannel ? privateMessagesRef : messagesRef;
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

  handleStar = () => {
    this.setState(
      prevState => ({
        isChannelStarred: !prevState.isChannelStarred
      }),
      () => this.starChannel()
    );
  };

  starChannel = () => {
    if (this.state.isChannelStarred) {
      this.state.usersRef.child(`${this.state.user.uid}/starred`).update({
        [this.state.channel.id]: {
          name: this.state.channel.name,
          details: this.state.channel.details,
          createdBy: {
            name: this.state.channel.createdBy.name,
            avatar: this.state.channel.createdBy.avatar
          }
        }
      });
    } else {
      this.state.usersRef
        .child(`${this.state.user.uid}/starred`)
        .child(this.state.channel.id)
        .remove(err => {
          if (err !== null) {
            console.error(err);
          }
        });
    }
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
  displayChannelName = channel => {
    return channel
      ? `${this.state.privateChannel ? "@" : "#"}${channel.name}`
      : "";
  };

  render() {
    const {
      messagesRef,
      channel,
      user,
      messages,
      numUniqueUsers,
      searchTerm,
      searchResults,
      searchLoading,
      privateChannel,
      isChannelStarred
    } = this.state;

    return (
      <React.Fragment>
        <MessagesHeader
          channelName={this.displayChannelName(channel)}
          numUniqueUsers={numUniqueUsers}
          handleSearchChange={this.handleSearchChange}
          searchLoading={searchLoading}
          isPrivateChannel={privateChannel}
          handleStar={this.handleStar}
          isChannelStarred={isChannelStarred}
        />
        <Segment>
          <Comment.Group className="messages">
            {searchTerm
              ? this.displayMessages(searchResults)
              : this.displayMessages(messages)}

            <div style={{ display: "flex", alignItems: "center" }}>
              <span className="user__typing">john is typing</span> <Typing />
            </div>
          </Comment.Group>
        </Segment>

        {/*Need to fix this later,there might better way to pass props */}
        <MessageForm
          messagesRef={messagesRef}
          currentChannel={channel}
          currentUser={user}
          isPrivateChannel={privateChannel}
          getMessagesRef={this.getMessagesRef}
        />
      </React.Fragment>
    );
  }
}

export default connect(null, { setUserPosts })(Messages);
