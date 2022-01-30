import React from "react";
import { Link } from "react-router-dom";

function RequirementsGate({ isValid, message, children, nohomepage }) {
  return (
    <>
      {isValid ? (
        <>{children}</>
      ) : (
        <div>
          <h1>{message}</h1>
          {!nohomepage && (
            <Link to="/" aria-disabled>
              Return to Homepage
            </Link>
          )}
        </div>
      )}
    </>
  );
}

export default RequirementsGate;
