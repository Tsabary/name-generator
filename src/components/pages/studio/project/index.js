import "./styles.scss";
import React, { useState, useEffect, useContext } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import { AuthContext } from "../../../../providers/Auth";

import Header from "./header";
import ActionButtons from "./actionButtons";
import Shuffler from "./shuffler";

import {
  setCurrentPage,
  fetchSingleProject,
  setProject,
  fetchWords,
  fetchComments,
  fetchReplies,
  addLetterStart,
  addLetterEnd,
  addWord,
  addWordForML,
  generateSet,
  classifyWords,
  removeWordFromBank,
  assignWord,
  addMember,
  cleanWords
} from "../../../../actions";

import { handleKeep, handleShuffle, renderList } from "./functions";

const Project = ({
  projects,
  currentProject,
  currentWord,
  savedWords,
  wordSet,
  wordBank,
  setCurrentPage,
  fetchSingleProject,
  setProject,
  addWord,
  addWordForML,
  fetchWords,
  addLetterStart,
  addLetterEnd,
  fetchComments,
  fetchReplies,
  generateSet,
  classifyWords,
  removeWordFromBank,
  assignWord,
  addMember,
  match,
  cleanWords
}) => {
  const { currentUserProfile } = useContext(AuthContext);

  const [startTime, setStartTime] = useState(Date.now());
  const [wasSaved, setWasSaved] = useState(false);
  const [currentWordLength, setCurrentWordLength] = useState(false);
  const [previousWord, setPreviousWord] = useState([]);
  const [qualityBalance, setQualityBalance] = useState({
    good: 0,
    average: 0,
    bad: 0
  });

  useEffect(() => {
    setCurrentPage("studio"); // set the current page, for the menu and for the bg video

    if (!!currentUserProfile)
      if (!!projects.length) {
        //if the user is logged in and has projects in the reducer, then find the project with the id matching to the id from the url, set that project as the current project, and fetch all the relevant data
        projects.map(element => {
          if (element.id === match.params.id) {
            fetchWords(element.id);
            setProject(element);
            fetchComments(element.id);
            fetchReplies(element.id);
          }
        });
      } else {
        // if the user is logged in but his projects are empty, then this probably means that they've came directly to this address. In that case, feth this current project and all it's data. After that happened succefully, tis if statement would be executed again only this time the first condition would be met.
        fetchSingleProject(match.params.id, setProject);
      }
    // console.log(currentWord.length, currentWord);
    window.scrollTo(0, 0);
  }, [currentUserProfile, projects, wordSet]);

  useEffect(() => {
    if (!currentWord.length) {
      generateSet([{}, {}, {}, {}]);
    }
  }, []);

  useEffect(() => {
    classifyWords(wordSet); //whenever the word set has ListeningStateChangedEvent, we want to calssify our words
  }, [wordSet]);

  useEffect(() => {
    if (
      !!wordBank
      //   //  &&
      //   // currentWord
      //   //   .map(letter => {
      //   //     return letter.letter;
      //   //   })
      //   //   .join("") !==
      //   //   previousWord
      //   //     .map(letter => {
      //   //       return letter.letter;
      //   //     })
      //   //     .join("")
    ) {
      assignWord(wordBank, qualityBalance, setQualityBalance); //need a better check
      // setPreviousWord(currentWord);
    }
  }, [wordBank]);

  useEffect(() => {
    // if the new word ('currentWord' is the new word at this point) doesn't have as many charachters as the previous word, we need to generate a new set of words that had the same amount of charachters as the new word
    if (currentWord.length !== currentWordLength) {
      generateSet(currentWord);
      setCurrentWordLength(currentWord.length);
    }


    // If the previous word and the new word generate the same string, but we still got a new word, then most likely it is becuse the locked state of one of the letters has changed. Not certain, and probably not the best way to go but might be a good solution for now.
    // The last chack is to see if any of the letters is unlocked, or if they are all locked. Before, I f we reached a point where they were all locked, then we ran into a loop. Probably because he generator can only produce 1 result with these conditions and then it keeps getting forced to generate another set because our bank is too low. With this we don't.
    // prefferably a more elegant approach could be taken, but for now, it works.

    /* 
When should a new set be generated, in regard so the word changing (as opposed to our bank being low)?
1. The lock state of at least one letter has changed.
2. The length of the word has changed.
    */

    if (
      currentWord
        .map(letter => {
          return letter.locked;
        })
        .join("") !==
        previousWord
          .map(letter => {
            return letter.locked;
          })
          .join("") &&
      !!previousWord.length
    ) {

      generateSet(currentWord);
    }

    // if (
    //   currentWord
    //     .map(letter => {
    //       return letter.letter;
    //     })
    //     .join("") ===
    //     previousWord
    //       .map(letter => {
    //         return letter.letter;
    //       })
    //       .join("")

    // &&

    //   currentWord !== previousWord

    // &&

    //   !!previousWord.length

    // &&

    //   currentWord
    //     .map(letter => {
    //       return letter.locked;
    //     })
    //     .includes(false)
    // ) {
    //   generateSet(currentWord);
    // }

    setPreviousWord(currentWord);
  }, [currentWord]);

  const shuffleClick = () => {
    wordBank.good.length > 1 &&
    wordBank.average.length > 1 &&
    wordBank.bad.length > 1
      ? handleShuffle(
          currentWord,
          wasSaved,
          setWasSaved,
          startTime,
          setStartTime,
          addWordForML,
          currentProject,
          currentUserProfile.uid,
          wordBank,
          removeWordFromBank
        )
      : generateSet(currentWord);
  };

  const keepClick = () => {
    handleKeep(
      currentWord,
      setWasSaved,
      startTime,
      setStartTime,
      addWordForML,
      currentProject,
      currentUserProfile.uid,
      addWord,
      savedWords
    );
  };

  return !!currentUserProfile ? (
    <div className="shuffler">
      <Header currentProject={currentProject} addMember={addMember} />
      <Shuffler addLetterStart={addLetterStart} addLetterEnd={addLetterEnd} />
      <ActionButtons shuffleClick={shuffleClick} keepClick={keepClick} />

      <div className="shuffler__words medium-margin-top medium-margin-bottom">
        {renderList(savedWords)}
      </div>
    </div>
  ) : (
    <Redirect to="/" />
  );
};

const mapStateToProps = state => {
  return {
    currentWord: state.currentWord,
    savedWords: state.savedWords,
    wordSet: state.wordSet,
    wordBank: state.wordBank,
    projects: state.projects,
    currentProject: state.currentProject
  };
};

export default connect(mapStateToProps, {
  setCurrentPage,
  setProject,
  fetchSingleProject,
  fetchWords,
  fetchComments,
  fetchReplies,
  addLetterStart,
  addLetterEnd,
  addWord,
  addWordForML,
  generateSet,
  classifyWords,
  removeWordFromBank,
  assignWord,
  addMember,
  cleanWords
})(Project);
