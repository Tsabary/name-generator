import React from "react";
import ReactTooltip from "react-tooltip";

import SingleWord from "./singleWord";
const initializationWord = "plum";

export const handleShuffle = (
  currentWord,
  wasSaved,
  setWasSaved,
  startTime,
  setStartTime,
  addWordForML,
  currentProject,
  userUID,
  wordBank,
  removeWordFromBank
) => {
  //merge letter from letter objects into one word
  const joinedWord = currentWord
    .map(letter => {
      return letter.letter;
    })
    .join("");

  // first check that the word is not the initialization word
  if (joinedWord !== initializationWord)
    //next, check that the word we are shuffeling is not a word that was just saved a second ago. If it is, simply set the 'wasSaved' state back to false and continue. Otherwise, log this word as a bad shuffled word.
    wasSaved
      ? setWasSaved(false)
      : addWordForML(
          joinedWord,
          Date.now() - startTime,
          0,
          currentProject,
          userUID
        );

  //start counting time again. This happened (and should happen) regardles to whether the word was previously saved or not.
  setStartTime(Date.now());

  removeWordFromBank(currentWord);
};

export const handleKeep = (
  currentWord,
  setWasSaved,
  startTime,
  setStartTime,
  addWordForML,
  currentProject,
  userUID,
  addWord,
  savedWords
) => {
  // set 'wasSaved' state to true, so when this word gets shuffled it would know not to log it
  setWasSaved(true);
  const joinedWord = currentWord
    .map(letter => {
      return letter.letter;
    })
    .join("");

  // first check that the word is not the initialization word && if the word has already been save. We don't want to double save things
  if (
    !!joinedWord.length &&
    joinedWord !== initializationWord &&
    !savedWords
      .map(word => {
        return word.title;
      })
      .includes(joinedWord)
  ) {
    //start counting time again. This happened (and should happen) regardles to whether the word was previously saved or not.
    setStartTime(Date.now());

    // adds the word object to the db
    addWord(joinedWord, currentProject.id);

    //adds the word to the RTDB for the ML dataset? Need to follow
    addWordForML(
      joinedWord,
      Date.now() - startTime,
      1,
      currentProject,
      userUID
    );
  }
};

export const renderList = savedWords => {
  return !!savedWords.length
    ? savedWords
        .sort((a, b) =>
          a.total_score < b.total_score
            ? 1
            : a.total_score === b.total_score
            ? a.title > b.title
              ? 1
              : -1
            : -1
        )
        .map(savedWord => {
          return <SingleWord savedWord={savedWord} key={savedWord.id} />;
        })
    : null;
};

export const renderAvatars = memebrs => {
  return memebrs.map(memeber => {
    return (
      <div
        className="round-image__container round-image__container--small round-image__container--growing clickable"
        key={memeber.uid}
        data-tip
        data-for={memeber.uid}
      >
        <img
          className="round-image"
          src={
            memeber.avatar ||
            "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
          }
        />
        <ReactTooltip id={memeber.uid} type="dark" effect="solid">
          {memeber.name}
        </ReactTooltip>
      </div>
    );
  });
};

export const handleInvite = (
  e,
  addMember,
  inviteEmail,
  setInviteEmail,
  setFormStatus,
  project_ID
) => {
  e.preventDefault();
  setInviteEmail("");
  addMember(inviteEmail, project_ID, setFormStatus);
};
