import React from "react";
import { Link } from "react-router-dom";

const RequirementGate = ({
  isValid,
  message,
  children,
  showHomepage = true,
}) => {
  // TODO maybe give validations as array?
  return (
    <>
      {isValid ? (
        <>{children}</>
      ) : (
        <>
          <h1>{message}</h1>
          {showHomepage && (
            <Link to="/" aria-disabled>
              Return to Homepage
            </Link>
          )}
        </>
      )}
    </>
  );
};

export default RequirementGate;
