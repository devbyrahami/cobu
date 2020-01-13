import React from "react";
import { Header, Segment, Input, Icon } from "semantic-ui-react";

class MessagesHeader extends React.Component {
  render() {
    const { channelName } = this.props;
    return (
      <Segment clearing>
        {/* channel title */}
        <Header
          fluid="true"
          as="h2"
          floated="left"
          styles={{ marginBottom: 0 }}
        >
          <span>
            {channelName}
            <Icon
              name={"star outline "}
              color="black"
              size="small"
              style={{ margin: "0 5px" }}
            />
          </span>
          <Header.Subheader>Users</Header.Subheader>
        </Header>

        {/*Channel Search Input*/}

        <Header floated="right">
          <Input
            size="mini"
            icon="search"
            name="searchTerm"
            placeholder="Search Messages"
          />
        </Header>
      </Segment>
    );
  }
}

export default MessagesHeader;
