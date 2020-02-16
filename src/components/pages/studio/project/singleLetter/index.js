import "./styles.scss";
import React from "react";
import { connect } from "react-redux";
import { changeLetter, removeLetter } from "../../../../../actions";

const SingleLetter = ({ letter, changeLetter, removeLetter }) => {
  const handleLock = () => {
    changeLetter({ ...letter, locked: !letter.locked });
  };

  const handleRemove = () => {
    removeLetter(letter.position);
  };

  const handleType = newLetter => {
    changeLetter({ ...letter, letter: newLetter, locked: true });
  };

  return (
    <div className="letter">
      <div className="letter__action letter__remove" onClick={handleRemove}>
        ✖
      </div>
      <input
        className="letter__input"
        onFocus={event => event.target.select()}
        value={letter.letter.toUpperCase()}
        maxLength="1"
        onChange={e => handleType(e.target.value)}
      />

      <i
        className={
          letter.locked
            ? "icon lock letter__icon letter__action"
            : "icon unlock grey letter__icon letter__action"
        }
        onClick={handleLock}
      />
    </div>
  );
};

export default connect(null, { changeLetter, removeLetter })(SingleLetter);
