import React from "react";

import CurrentWord from "../currentWord";

const Shuffler = ({ addLetterStart, addLetterEnd }) => {
  return (
    <div className="shuffler__word big-margin-top">
      <div className="shuffler__adder" onClick={addLetterStart} />
      <CurrentWord />
      <div className="shuffler__adder" onClick={addLetterEnd} />
    </div>
  );
};

export default Shuffler;
