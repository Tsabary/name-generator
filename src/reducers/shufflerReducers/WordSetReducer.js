import { GENERATE_SET } from "../../actions/types";

import { allLetters } from "../../constants";

export default (state = [], action) => {
  const generateWord = currentWord => {
    var newWord = [];
    for (var i = 0; i < currentWord.length; i++) {
      newWord.push(
        currentWord[i].locked
          ? currentWord[i]
          : {
              position: i,
              letter: allLetters()[
                Math.floor(Math.random() * Math.floor(allLetters().length))
              ],
              locked: false
            }
      );
    }
    return newWord;
  };

  const generateSet = (size, currentWord) => {
    const newSet = [];
    for (var i = 0; i < size; i++) {
      newSet.push(generateWord(currentWord));
    }
    return newSet;
  };

  switch (action.type) {
    case GENERATE_SET:
      return generateSet(25, action.payload);

    default:
      return state;
  }
};
