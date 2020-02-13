import React from "react";

const ActionButtons = ({shuffleClick, keepClick}) => {
  return (
    <div className="flex-group-spaced-around small-margin-top">
      <div className="shuffler__button clickable" onClick={shuffleClick}>
        <p>Shuffle</p>
      </div>

      <div className="shuffler__button clickable" onClick={keepClick}>
        <p>Keep</p>
      </div>
    </div>
  );
};

export default ActionButtons;
