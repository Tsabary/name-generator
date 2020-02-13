import { FETCH_REPLIES } from "../../actions/types";

export default (state = [], action) => {
  switch (action.type) {
    case FETCH_REPLIES:
      return action.payload;

    default:
      return state;
  }
};
