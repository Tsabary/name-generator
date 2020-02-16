import { FETCH_REPLIES, ADD_REPLY } from "../../actions/types";

export default (state = [], action) => {
  switch (action.type) {
    case FETCH_REPLIES:
      return action.payload;

      case ADD_REPLY:
        return [...state, action.payload];

    default:
      return state;
  }
};
