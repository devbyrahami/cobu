import React from "react";
import { Menu } from "semantic-ui-react";
import UserPanel from "../UserPanel/UserPanel.component";

//needs to fix this later to avoid props drilling
class SidePanel extends React.Component {
  render() {
    const { currentUser } = this.props;
    return (
      //side panel styling
      <Menu
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
        <UserPanel currentUser={currentUser} />
      </Menu>
    );
  }
}

export default SidePanel;
