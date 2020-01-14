import React from "react";
import {
  Sidebar,
  Menu,
  Divider,
  Button,
  Modal,
  Icon,
  Label
} from "semantic-ui-react";

import { TwitterPicker } from "react-color";

class ColorPanel extends React.Component {
  state = {
    modal: false
  };

  openModal = () => this.setState({ modal: true });
  closeModal = () => this.setState({ modal: false });

  render() {
    const { modal } = this.state;

    return (
      <Sidebar as={Menu} inverted vertical visible width="very thin">
        <Divider />
        <Button icon="add" size="small" color="blue" onClick={this.openModal} />
        <Modal basic open={modal} onClose={this.closeModal}>
          <Modal.Header>Select App Colors</Modal.Header>
          <Modal.Content>
            <Label content="Primary Color" />
            <TwitterPicker />
            <Label content="Secondary Color" />
            <TwitterPicker />
          </Modal.Content>
          <Modal.Actions>
            <Button color="green" inverted>
              <Icon name="checkmark " />
              Save colors
            </Button>
            <Button color="red" inverted onClick={this.closeModal}>
              <Icon name="remove" />
              Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </Sidebar>
    );
  }
}

export default ColorPanel;
