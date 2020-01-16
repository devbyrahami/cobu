import React from "react";
import { Button } from "semantic-ui-react";
import { toggleSidePanel } from "../../redux/actions/index";

import { connect } from "react-redux";

const SideBarIcon = ({ toggleSidePanel }) => (
  <Button
    icon="bars"
    size="small"
    color="grey"
    onClick={toggleSidePanel}
  ></Button>
);

const mapDispatchToProps = dispatch => ({
  toggleSidePanel: () => dispatch(toggleSidePanel())
});

export default connect(null, mapDispatchToProps)(SideBarIcon);
