import {
  ADD_END,
  ADD_START,
  SHUFFLE,
  ASSIGN_WORD,
  LOCK_LETTER,
  CHANGE_LETTER,
  REMOVE_LETTER
} from "../../actions/types";

import { allLetters } from "../../constants";

export default (
  state = [
    // { position: 0, letter: "p", locked: false },
    // { position: 1, letter: "l", locked: false },
    // { position: 2, letter: "u", locked: false },
    // { position: 3, letter: "m", locked: false }
  ],
  action
) => {
  // const generateWord = () => {
  //   var newWord = [];
  //   for (var i = 0; i < state.length; i++) {
  //     newWord.push(
  //       state[i].locked
  //         ? state[i]
  //         : {
  //             position: i,
  //             letter: allLetters()[
  //               Math.floor(Math.random() * Math.floor(allLetters().length))
  //             ],
  //             locked: false
  //           }
  //     );
  //   }
  //   return newWord;
  // };

  switch (action.type) {
    case ADD_START:
      var newWord = [{ position: 0, letter: "x", locked: false }, ...state];
      for (var i = 0; i < newWord.length; i++) {
        newWord[i].position = i;
      }
      return newWord;

    case ADD_END:
      var newWord = [...state, { position: 0, letter: "x", locked: false }];
      for (var i = 0; i < newWord.length; i++) {
        newWord[i].position = i;
      }
      return newWord;

      case ASSIGN_WORD:
        return action.payload.good[0];

    // case SHUFFLE:
    //   return generateWord();

    case LOCK_LETTER:
      return state.map(letter => {
        if (letter.position === action.payload.position) {
          return action.payload;
        } else {
          return letter;
        }
      });

    case REMOVE_LETTER:
      var newWord = state.filter(letter => letter.position !== action.payload);
      for (var i = 0; i < newWord.length; i++) {
        newWord[i].position = i;
      }
      return newWord;

    case CHANGE_LETTER:
      return state.map(letter => {
        if (letter.position === action.payload.position) {
          return action.payload;
        } else {
          return letter;
        }
      });

    default:
      return state;
  }
};
