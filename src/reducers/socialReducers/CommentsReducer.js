import { FETCH_COMMENTS, ADD_COMMENT } from "../../actions/types";

export default (state = [], action) => {
  switch (action.type) {
    case FETCH_COMMENTS:
      return action.payload;

    case ADD_COMMENT:
      return [...state, action.payload];

    default:
      return state;
  }
};
