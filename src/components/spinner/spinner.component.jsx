import React from "react";

//imported the loader ui from semantic ui
import { Loader, Dimmer } from "semantic-ui-react";

const Spinner = () => (
  <Dimmer active>
    <Loader size="huge" content={"Hold on,won't be long my friend.."} />
  </Dimmer>
);

export default Spinner;
