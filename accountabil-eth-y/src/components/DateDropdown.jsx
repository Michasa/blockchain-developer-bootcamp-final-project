import React from "react";

let DateDropdown = () => {
  let rows = [];
  for (let index = 0; index < 30; index++) {
    rows.push(
      <option value={index + 1} key={"day" + index}>
        {index + 1}
      </option>
    );
  }
  return rows;
};
export default DateDropdown
