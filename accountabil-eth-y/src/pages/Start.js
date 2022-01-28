import React from "react";
import { Link } from "react-router-dom";

function Start() {
  return (
    <div>
      What do you want to do?
      <div>
        <Link to="/create-contract" aria-disabled>
          Create
        </Link>
      </div>
      or
      <div>
        <i> Connect a Accountability Checker contract to access these</i>
        <Link to="/my-promise/create">Create Your Promise</Link>
        <Link to="/my-promise/nominate">Nominate an Address</Link>
        <Link to="/my-promise/check-in"> Daily Check In</Link>
        <Link to="/my-promise/cashout">Cashout Promise</Link>
      </div>
      {/* <Link to="/my-promise/submit">Submit</Link>
      <Link to="/my-promise/cashout">Cashout</Link> */}
    </div>
  );
}

export default Start;
