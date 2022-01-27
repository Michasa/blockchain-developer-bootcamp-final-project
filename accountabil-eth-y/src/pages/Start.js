import React from "react";
import { Link } from "react-router-dom";

function Start() {
  return (
    <div>
      What do you want to do?
      <div>
        <Link to="create">Create</Link>
      </div>
      or
      <div>Define</div>
      <div>Submit</div>
      <div>Cashout</div>
    </div>
  );
}

export default Start;
