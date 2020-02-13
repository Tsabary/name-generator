import "./styles.scss";
import React, { useState, useEffect, useContext } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { AuthContext } from "../../../../providers/Auth";

import CurrentWord from "./currentWord";

import {
  setCurrentPage,
  fetchSingleProject,
  setProject,
  fetchWords,
  fetchComments,
  fetchReplies,
  // shuffleLetters,
  addLetterStart,
  addLetterEnd,
  addWord,
  addWordForML,
  generateSet,
  classifyWords,
  removeWordFromBank,
  assignWord,
  addMember,
  // addUserToTeam
  cleanWords
} from "../../../../actions";

import {
  handleKeep,
  handleShuffle,
  renderList,
  renderAvatars,
  handleInvite
} from "./functions";

const Shuffler = ({
  projects,
  currentProject,
  currentWord,
  savedWords,
  wordSet,
  wordBank,
  setCurrentPage,
  fetchSingleProject,
  setProject,
  // shuffleLetters,
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
  addUserToTeam,
  match,
  cleanWords
}) => {
  const { currentUserProfile } = useContext(AuthContext);

  const [startTime, setStartTime] = useState(Date.now());
  const [wasSaved, setWasSaved] = useState(false);
  const [currentWordLength, setCurrentWordLength] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [formSubmited, setFormSubmited] = useState(false);

  useEffect(() => {
    setCurrentPage("generator"); // set the current page, for the menu and for the bg video

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
    console.log(currentWord.length, currentWord);
    window.scrollTo(0, 0);
  }, [currentUserProfile, projects, wordSet]);

  useEffect(() => {
    if (!currentWord.length) {
      generateSet([{}, {}, {}, {}]);
      console.log("generating set");
    }
  }, []);

  useEffect(() => {
    console.log("classifyWords", wordSet.length);
    classifyWords(wordSet); //whenever the word set has ListeningStateChangedEvent, we want to calssify our words
  }, [wordSet]);

  useEffect(() => {
    console.log("assignWord", wordBank);

    if (!!wordBank) assignWord(wordBank); //need a better check
  }, [wordBank]);

  useEffect(() => {
    if (currentWord.length !== currentWordLength) {
      generateSet(currentWord);
      setCurrentWordLength(currentWord.length);
    }
  }, [currentWord]);

  const shuffleClick = () => {
    wordBank.good.length > 1
      ? handleShuffle(
          currentWord,
          wasSaved,
          setWasSaved,
          startTime,
          setStartTime,
          addWordForML,
          currentProject,
          currentUserProfile.uid,
          // shuffleLetters,
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

  return (
    <div className="shuffler">
      <div className="shuffler__header">
        <input
          className="shuffler__header-invite-checkbox"
          type="checkbox"
          id="invite_members"
        />
        <span className="shuffler__header--visible">
          <Link className="shuffler__navigate-back" to="/generator">
            <span className="tiny-margin-right">&#x2190;</span>
            {currentProject.title}
          </Link>
          <div className="shuffler__header-seperator" />

          {!!currentProject && !!currentProject.team ? (
            <div className="shuffler__header-members">
              {currentProject.team.length}{" "}
              {currentProject.team.length === 1 ? "member:" : "members:"}
              <div className="shuffler__header-member-avatars">
                {renderAvatars(currentProject.team)}
              </div>
            </div>
          ) : null}

          <div className="shuffler__header-seperator" />
          <div>
            <label className="text-button" htmlFor="invite_members">
              + Add members
            </label>
          </div>
        </span>
        <span className="shuffler__header--hidden">
          <label className="text-button" htmlFor="invite_members">
            &#x2190; Dashboard
          </label>
          {formSubmited ? (
            <div className="text-button" onClick={() => setFormSubmited(false)}>
              Add another member
            </div>
          ) : (
            <form
              onSubmit={e =>
                handleInvite(
                  e,
                  addMember,
                  inviteEmail,
                  setInviteEmail,
                  setFormSubmited,
                  currentProject.id
                )
              }
              className="shuffler__header-invite-form"
            >
              <input
                className="input-field__input"
                type="email"
                placeholder="Email address"
                autoComplete="new-password"
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
                required
              />
              <button type="submit" className="text-button">
                Add member
              </button>
            </form>
          )}
        </span>
      </div>

      <div className="shuffler__word big-margin-top">
        <div className="shuffler__adder" onClick={addLetterStart} />
        <CurrentWord />
        <div className="shuffler__adder" onClick={addLetterEnd} />
      </div>
      <div className="flex-group-spaced-around small-margin-top">
        <div className="shuffler__button clickable" onClick={shuffleClick}>
          <p>Shuffle</p>
        </div>

        <div className="shuffler__button clickable" onClick={keepClick}>
          <p>Keep</p>
        </div>
      </div>
      <div className="shuffler__words medium-margin-top medium-margin-bottom">
        {renderList(savedWords)}
      </div>
    </div>
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
  // shuffleLetters,
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
})(Shuffler);
