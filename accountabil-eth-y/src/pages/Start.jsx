import React from "react";
import { Link } from "react-router-dom";

const Start = () =>
  <div>
    What do you want to do?
    <div>
      <Link to="/create-contract" aria-disabled>
        Create a New Contract
      </Link>
    </div>
    or
    <div>
      <i> Connect a Accountability Checker contract to access these</i>
      <ol>
        <li>
          <Link to="/my-promise/nominate">Nominate an Address</Link>
        </li>
        <li>
          <Link to="/my-promise/create">Create Your Promise</Link>
        </li>

        <li>
          <Link to="/my-promise/check-in"> Daily Check In</Link>
        </li>
        <li>
          <Link to="/my-promise/cashout">Cashout Promise</Link>
        </li>
      </ol>
    </div>
  </div>


export default Start;
