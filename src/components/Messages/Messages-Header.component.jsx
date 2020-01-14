import React from "react";
import { Header, Segment, Input, Icon } from "semantic-ui-react";

class MessagesHeader extends React.Component {
  render() {
    const {
      channelName,
      numUniqueUsers,
      handleSearchChange,
      searchLoading,
      isPrivateChannel,
      handleStar,
      isChannelStarred
    } = this.props;
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
            {/*if its not private channel then we show the star icon */}
            {!isPrivateChannel && (
              <Icon
                onClick={handleStar}
                name={isChannelStarred ? "star" : "star outline"}
                color={isChannelStarred ? "yellow" : "black"}
                size="small"
                style={{ margin: "0 5px" }}
              />
            )}
          </span>
          <Header.Subheader style={{ fontSize: 12 }}>
            {numUniqueUsers}
          </Header.Subheader>
        </Header>

        {/*Channel Search Input*/}

        <Header floated="right">
          <Input
            onChange={handleSearchChange}
            size="mini"
            icon="search"
            name="searchTerm"
            placeholder="Search Users"
            loading={searchLoading}
          />
        </Header>
      </Segment>
    );
  }
}

export default MessagesHeader;
