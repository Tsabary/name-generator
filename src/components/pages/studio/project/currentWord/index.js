import "./styles.scss";
import React from "react";
import SingleLetter from "../singleLetter";
import { connect } from "react-redux";

const CurrentWord = ({ currentWord }) => {
  const renderLetters = currentWord => {
    return currentWord.map(letter => {
      //I'm passing the letter the locked position just so when things change, React is forced to re-render. Before, it would just leave things the same and a newly locked letter would sometimes still show the unlocked icon.
      return (
        <SingleLetter
          letter={letter}
          key={letter.position}
          locked={letter.locked}
        />
      );
    });
  };

  return <div className="current-word">{renderLetters(currentWord)}</div>;
};

const mapStateToProps = state => {
  return { currentWord: state.currentWord };
};

export default connect(mapStateToProps)(CurrentWord);
