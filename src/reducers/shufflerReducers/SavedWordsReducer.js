import { ADD_WORD, REMOVE_WORD, FETCH_WORDS } from "../../actions/types";

export default (state = [], action) => {
  switch (action.type) {
    case ADD_WORD:
      return [...state, action.payload];

    case FETCH_WORDS:
      return action.payload;

    case REMOVE_WORD:
      return state.filter(word => {
        return word.id !== action.payload.id;
      });

    default:
      return state;
  }
};
