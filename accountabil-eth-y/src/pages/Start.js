import React from "react";
import { Link } from "react-router-dom";

function Start() {
  return (
    <div>
      What do you want to do?
      <div>
        <Link to="/create" aria-disabled>
          Create
        </Link>
      </div>
      or
      <Link to="/my-promise/define">Define</Link>
      {/* <Link to="/my-promise/submit">Submit</Link>
      <Link to="/my-promise/cashout">Cashout</Link> */}
    </div>
  );
}

export default Start;
