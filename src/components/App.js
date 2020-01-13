import React from "react";
import "./App.css";
import { Grid } from "semantic-ui-react";
import { connect } from "react-redux";

import ColorPanel from "./ColorPanel/ColorPanel.component";
import SidePanel from "./SidePanel/SidePanel.component";
import MetaPanel from "./MetaPanel/MetaPanel.component";
import Messages from "./Messages/Messages.component";

const App = ({ currentUser, currentChannel }) => (
  <Grid columns="equal" className="app" style={{ background: "#eee" }}>
    <ColorPanel />
    <SidePanel key={currentUser && currentUser.uid} currentUser={currentUser} />

    <Grid.Column style={{ marginLeft: 320 }}>
      <Messages
        key={currentChannel && currentChannel.id}
        currentChannel={currentChannel}
        currentUser={currentUser}
      />
    </Grid.Column>

    <Grid.Column width={4}>
      <MetaPanel />
    </Grid.Column>
  </Grid>
);

//providing user's displayName here
const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
  currentChannel: state.channel.currentChannel
});

export default connect(mapStateToProps)(App);
