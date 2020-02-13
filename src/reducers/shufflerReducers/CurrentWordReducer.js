import {
  ADD_END,
  ADD_START,
  ASSIGN_WORD,
  LOCK_LETTER,
  CHANGE_LETTER,
  REMOVE_LETTER
} from "../../actions/types";

export default (
  state = [
    // { position: 0, letter: "p", locked: false },
    // { position: 1, letter: "l", locked: false },
    // { position: 2, letter: "u", locked: false },
    // { position: 3, letter: "m", locked: false }
  ],
  action
) => {
  switch (action.type) {
    // case ADD_START:
    //   var newWord = [{ position: 0, letter: "x", locked: false }, ...state];
    //   for (var i = 0; i < newWord.length; i++) {
    //     newWord[i].position = i;
    //   }
    //   return newWord;

    case ADD_START:
      let newWordStart = [
        { position: 0, letter: "x", locked: false },
        ...state
      ];
      for (var i = 0; i < newWordStart.length; i++) {
        newWordStart[i].position = i;
        newWordStart[i].locked = !!state[i-1] ? state[i-1].locked : false;
      }
      return newWordStart;

    case ADD_END:
      let newWordEnd = [...state, { position: 0, letter: "x", locked: false }];
      for (var i = 0; i < newWordEnd.length; i++) {
        newWordEnd[i].position = i;
        newWordEnd[i].locked = !!state[i] ? state[i].locked : false;
      }
      return newWordEnd;

    case ASSIGN_WORD:
      return action.payload.good[0];

    case LOCK_LETTER:
      return state.map(letter => {
        return letter.position === action.payload.position
          ? action.payload
          : letter;
      });

    case REMOVE_LETTER:
      console.log("remove called from reducer");
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
