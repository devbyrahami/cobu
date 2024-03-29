import React from "react";
import { Menu } from "semantic-ui-react";
import UserPanel from "../UserPanel/UserPanel.component";
import Channels from "./Channels.component";

import DirectMessages from "./Direct-Messages.component";
import Starred from "./Starred.component";

//needs to fix this later to avoid props drilling
class SidePanel extends React.Component {
  render() {
    const { currentUser, primaryColor } = this.props;
    return (
      //side panel styling

      <Menu
        className="sidepanel"
        size="large"
        inverted
        fixed="left"
        vertical
        style={{
          background: "linear-gradient(#1488cc, #2b32b2)",
          fontSize: "1.2rem",
          color: "white"
        }}
      >
        {/* We are passing in props to our components tp be used,this needs to be revised */}
        <UserPanel currentUser={currentUser} />
        <Starred currentUser={currentUser} />
        <Channels currentUser={currentUser} />
        <DirectMessages currentUser={currentUser} />
      </Menu>
    );
  }
}

export default SidePanel;
