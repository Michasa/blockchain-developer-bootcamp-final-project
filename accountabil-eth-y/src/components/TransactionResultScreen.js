import React from "react";
import { Link } from "react-router-dom";

function TransactionResultScreen({ data, success, children }) {
  return (
    <>
      {success ? (
        <div>
          <h1>Success!</h1>
          <p>Your request has gone through, please see the changes below</p>
          <div>[Transaction stuff here]</div>
          <Link to="/start" aria-disabled>
            Return to Start Page
          </Link>
        </div>
      ) : (
        <>{children}</>
      )}
    </>
  );
}

export default TransactionResultScreen;
