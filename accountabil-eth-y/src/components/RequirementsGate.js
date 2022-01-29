import React from "react";

function RequirementsGate({ isValid, message, children }) {
  return (
    <>
      {isValid ? (
        <>{children}</>
      ) : (
        <div>
          <h1>{message}</h1>
        </div>
      )}
    </>
  );
}

export default RequirementsGate;
