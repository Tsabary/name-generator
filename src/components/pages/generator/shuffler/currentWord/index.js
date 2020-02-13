import "./styles.scss";
import React from "react";
import SingleLetter from "../singleLetter";
import { connect } from "react-redux";

const CurrentWord = ({ currentWord }) => {
  const renderLetters = currentWord => {
    return currentWord.map(letter => {
      return <SingleLetter letter={letter} key={letter.position} />;
    });
  };

  return <div className="current-word">{renderLetters(currentWord)}</div>;
};

const mapStateToProps = state => {
  return { currentWord: state.currentWord };
};

export default connect(mapStateToProps)(CurrentWord);
