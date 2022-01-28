import React, { useState } from "react";

function Nominate() {
  const [newNominee, setNewNominee] = useState();

  let handleSubmit = (event) => {
    event.preventDefault();
    //check if this is a proper address and all that
    console.log(newNominee);
    // let newData = dayjs.unix(days).add(days, "day").unix();
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Set your new nominee to recieve your penalty pot
        <input
          type="text"
          name="newNominee"
          required
          onChange={(event) => setNewNominee(event.target.value)}
        />
      </label>
      <input type="submit" />
    </form>
  );
}

export default Nominate;
