import React from "react";
import { Progress } from "semantic-ui-react";

const ProgressBar = ({ uploadState, percentUploaded }) =>
  //when the the progress bar is === the uploading stage ,then only it will show,once done it will go away
  uploadState && (
    <Progress
      className="progress__bar"
      percent={percentUploaded}
      progress
      indicating
      size="small"
      inverted
    />
  );

export default ProgressBar;
