import React from "react";
import { Link } from "react-router-dom";

const NotFound = () =>

  <div>
    Sorry this page was not found. Do you want go back to the
    <Link to="/" aria-disabled>
      application homepage?
    </Link>
  </div>


export default NotFound;
