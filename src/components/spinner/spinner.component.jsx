import React from "react";

//imported the loader ui from semantic ui
import { Loader, Dimmer } from "semantic-ui-react";

const Spinner = () => (
  <Dimmer active>
    <Loader
      size="huge"
      style={{ color: "#1488cc" }}
      content={"Patience is bitter, but COBU is worth it :)"}
    />
  </Dimmer>
);

export default Spinner;
